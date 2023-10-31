import { Message, Dispatch, Payload } from "./types"
import createObservable, {Subscription} from "./observable"

export interface StateDefinition {
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

export interface MachineContext {
  [key: string]: any
}

export type MachineDefinition = {
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

  let machineObservable: ReturnType<typeof createObservable>
  let transition: (event: string, payload?: Payload ) => void

  const init = () => {
    const initialState = findInitialState(machineDefinition.states)
    if (!initialState) {
      throw new Error('No initial state defined')
    }
    current.context = machineDefinition.initialContext || {};
    
    machineObservable = createObservable((observer) => {
      transition = (event: string, payload?: Payload ) => {
        // Exit early if we have no event handler for event.
        if (current.state && !machineDefinition?.states?.[current.state].events?.[event]) {
          observer.error(`State ${current.state} has no handler for event ${event}`)
          return;
        }

        // Get transition target from machine definition
        // If machine is initialized, get it from the target in the machine definition
        // Otherwise get the initial state
        // If transition target is undefined there is no transition defined for the event
        const transitionTarget = current.state ? machineDefinition?.states?.[current.state]?.events?.[event]?.target
          : findInitialState(machineDefinition.states)

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
      }
      // Transition to create initial state.
      transition('')
    })
  }

  const dispatch = (e: Message) => {
    transition(e.type, e.payload)
  }

  init();

  return {
    subscribe: machineObservable.subscribe,
    dispatch
  }
};

export default createMachine;
