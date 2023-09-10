/**
 * @callback Transition
 */

/**
 * @typedef Machine
 * @type {object}
 * @property {object} value - Value of the machine.
 * @property {function} transition - Dispatcher to transition machine to a new state.
 */

/**
 * Create a new state machine.
 * @param {Object} machineDefinition - Object describing the state machine.
 * @param {Object} machineDefinition.initialState - The initial state of the machine.
 * @returns {Machine} New state machine
 */
const createMachine = (machineDefinition) => {
  /** @type {Machine} */
  const machine = {
    previousState: null,
    currentState: machineDefinition.initialState,

    transition: (event) => {
      const currentStateDefinition = machineDefinition[machine.currentState];
      const destinationTransition = currentStateDefinition.transitions[event];

      if (!destinationTransition) {
        return;
      }

      const destinationState = destinationTransition.target;
      const destinationStateDefinition = machineDefinition[destinationState];

      destinationTransition.action();
      currentStateDefinition.actions.onExit();
      destinationStateDefinition.actions.onEnter();

      machine.previousState = machine.currentState;
      machine.currentState = destinationState;

      return machine.currentState;
    },
  };
  return machine;
};

export default createMachine;
