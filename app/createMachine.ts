import { Message, Dispatch, Payload } from "./types"
import createObservable, {Observer, Subscription, Observable} from "./observable"

interface StateDefinition {
  isInitial?: boolean,
  isExit?: boolean,
  actions?: {
    onEnter?: (context: MachineContext) => void,
    onExit?: (context: MachineContext) => void,
  }
  events?: {
    [key:string] : {
      target?: string,
      reducer?: (context: MachineContext, payload: {[key: string]: any}) => MachineContext
    }
  }
}

interface MachineContext {
  [key: string]: any
}

type MachineDefinition = {
  initialContext?: MachineContext
  states: {
    [key: string]: StateDefinition;
  }
}

export type CurrentState = {
  state: string;
  context: MachineContext;
}

export type StateMachine = {
  subscribe: Subscription,
  dispatch: Dispatch
}

const findInitialState = (states: {[key: string]: StateDefinition}) => {
  console.log('find initial state')
  let entryKey = '';
  Object.keys(states).forEach(key => {
    states[key].isInitial ? entryKey = key : null
  })
  return entryKey
}

const createMachine = (machineDefinition: MachineDefinition): StateMachine => {
  let current: CurrentState = {
    state: '',
    context: {}
  }

  let machineObservable: Observable;

  const init = () => {
    const initialState = findInitialState(machineDefinition.states)
    if (!initialState) {
      throw new Error('No initial state defined')
    }
    // Call transition instead to create observable
    current.context = machineDefinition.initialContext || {};
    transition(initialState)
  }

  // This is backward. We need to create the observable in init
  // and create and place into scrope the transition function.
  // Currently the observable will only execute once on creation.
  const transition = (event: string, payload?: Payload ): void => {
    console.log(current)
    console.log(event)
    console.log(machineObservable)
    machineObservable = machineObservable || createObservable((observer) => {
      // Exit early if we have no event handler for event.
      if (current.state && !machineDefinition?.states?.[current.state].events?.[event]) {
        console.log(`Event: ${event} Exit early`)
        observer.error(`State ${current.state} has no handler for event ${event}`)
        return;
      }

      // Get transition target from machine definition
      // If machine is initialized, get it from the target in the machine definition
      // Otherwise get the initial state
      // If transition target is undefined there is no transition defined for the event
      const transitionTarget = current.state ? machineDefinition?.states?.[current.state]?.events?.[event]?.target
        : findInitialState(machineDefinition.states)
      console.log(`Event: ${event} Current State: ${current.state} Target: ${transitionTarget}`)
      // Calculate new context in reducer function, if it's defined.
      if (machineDefinition?.states?.[current.state]?.events?.[event]?.reducer) {
        // @ts-ignore
        current.context = machineDefinition?.states?.[current.state]?.events?.[event]?.reducer({...current.context}, payload)
      }


      if (transitionTarget) {
        // Call current state onExit function, if it exists
        if (machineDefinition?.states?.[current?.state]?.actions?.onExit) {
          // @ts-ignore
          machineDefinition?.states?.[current?.state]?.actions?.onExit({...current.context});
        }

        // Set current state to transition target
        current.state = transitionTarget;

        // Call the new state's onEnter function, if it is defined.
        if (machineDefinition?.states?.[current.state]?.actions?.onEnter) {
          // @ts-ignore
          machineDefinition?.states?.[current.state]?.actions?.onEnter()
        }
      }

      // Emit the new state and context.
      observer.next(current)

      // Call the observer complete function if we've transitioned to the exit state.
      if (machineDefinition?.states?.[current.state]?.isExit) {
        observer.complete()
      }
    })
  };

  const dispatch = (e: Message) => {
    transition(e.type, e.payload)
  }

  init()

  return {
    // @ts-ignore
    subscribe: machineObservable.subscribe,
    dispatch
  }
};

export default createMachine;
