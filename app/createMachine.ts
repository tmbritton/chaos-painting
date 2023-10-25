import { Message } from "./types"
import createObservable, {Observer, Subscription} from "./observable"

interface StateDefinition {
  isInitial?: boolean,
  isExit?: boolean,
  actions?: {
    onEnter?: () => void,
    onExit?: () => void,
  }
  reducer?: (context: MachineContext, payload: {[key: string]: any}) => MachineContext
}

interface MachineContext {
  [key: string]: any
}

interface Transition {
  target: string,
  reducer?: (context: MachineContext, payload: Message['payload']) => void
}

type MachineDefinition = {
  initialState: string;
  initialContext?: MachineContext
  states: {
    [key: string]: StateDefinition;
  }
  transitions: {
    [key: string]: Transition
  };
}

type StateMachine = {
  currentState: string;
  context: MachineContext;
}

const findInitialState = (states: {[key: string]: StateDefinition}) => {
  let entryKey = '';
  Object.keys(states).forEach(key => {
    states[key].isInitial ? entryKey = key : null
  })
  return entryKey
}

const createMachine = (machineDefinition: MachineDefinition) => {
  let current: StateMachine

  const init = () => {
    const initialState = findInitialState(machineDefinition.states)
    if (!initialState) {
      throw new Error('No initial state defined')
    }
    // Call transition instead to create observable
    current.currentState = initialState
    current.context = machineDefinition.initialContext || {}
  }

  const transition = (state: string, payload?:{[key: string]: any} ) => {
    if (!machineDefinition?.states?.[state]) {
      throw new Error('Transition state is not defined')
    }
    if (machineDefinition?.states?.[current?.currentState]?.actions?.onExit) {
      // @ts-ignore
      machineDefinition?.states?.[current?.currentState]?.actions?.onExit()
    }
    if (machineDefinition?.states?.[state]?.reducer && payload) {
      // @ts-ignore
      machineDefinition?.states?.[state]?.reducer(current.context, payload)
    }
  }

  init();
  /**
   * Private API:
   *  - init
   *    Take machineDefinition call transition to create machine object and observer
   *  - transition
   *    Transitions machine to new state, calls onEnter, onExit, and reducer functions
   * Public API:
   *  - dispatch
   *    Receives events, calls transition
   *  - subscribe
   *    Subscribe to events emitted by machine observable
   */
  /*
  let subscribe: Subscription;
  //let machineObserverable: typeof createObservable;
  const machine: StateMachine = {
    currentState: machineDefinition.initialState,
    context: machineDefinition.context,
    dispatch: (event: Message) => {
      const machineObserverable = createObservable((observer) => {
        const currentStateDefinition = machineDefinition[machine.currentState];
        const destinationTransition = currentStateDefinition.transitions[event.type];
    
        if (!destinationTransition) {
          observer.error('Destination transition does not exist.')
        }

        const destinationState = destinationTransition.target;
        const destinationStateDefinition = machineDefinition[destinationState];

        machine.context = destinationTransition.reducer(machine.context, event.payload);
        currentStateDefinition.actions.onExit();
        destinationStateDefinition.actions.onEnter();

        machine.currentState = destinationState;

        observer.next(machine.currentState);
      });
      subscribe = machineObserverable.subscribe
    },
  }
  */

  return {
    //subscribe: subscribe,
    //dispatch: machine.dispatch
  };
};

export default createMachine;
