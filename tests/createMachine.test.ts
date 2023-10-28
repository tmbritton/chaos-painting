import createMachine, {CurrentState, StateMachine} from "../app/createMachine.js";
import { describe, expect, test, jest, beforeEach } from "bun:test";

// Import createMachine and other dependencies here

describe("createMachine", () => {
  let machine: StateMachine;

  beforeEach(() => {
    machine = createMachine({
      states: {
        off: {
          isInitial: true,
          actions: {
            onEnter: () => {
              console.log("off Enter");
            },
            onExit: () => {
              console.log("off Exit");
            },
          },
          events: {
            switch: {
              target: "on",
            },
          },
        },
        on: {
          actions: {
            onEnter: () => {
              console.log("On Enter");
            },
            onExit: () => {
              console.log("On Exit");
            },
          },
          events: {
            switch: {
              target: "off",
            },
          },
        },
      },
    });
  });

  test("Initial state should be off", () => {
    machine.subscribe({
      next: (state: CurrentState) => {
        expect(state.state).toBe('off')
      },
      error: (e) => {console.log(e)},
      complete: () => {console.log('complete')}
    })
  });

  test("state should be 'on' after a switch event", () => {
    let currentState = ''

    machine.subscribe({
      next: (state: CurrentState) => {
        currentState = state.state;
      },
      error: (e) => {console.log(e)},
      complete: () => {console.log('complete')}
    })
    machine.dispatch({ type: "switch" });
    expect(currentState).toBe("on");
  });

  /*
  test("should handle transitions and actions correctly", () => {
    machine.dispatch({ type: "switch" });
    expect(machine.currentState).toBe("on");
    expect(offOnExit).toHaveBeenCalled();
    expect(onOnEnter).toHaveBeenCalled();
    // Add additional assertions for transition actions here
  });

  test("should handle error for non-existent transition", () => {
    const errorSpy = jest.spyOn(console, 'error');
    machine.dispatch({ type: "invalidEvent" });
    expect(errorSpy).toHaveBeenCalledWith('Destination transition does not exist.');
    expect(machine.currentState).toBe("off"); // Ensure the state remains the same
  });
  */
});


/*
const offOnEnter = jest.fn(console.log('offOnEnter'));
const offOnExit = jest.fn(console.log('offOnExit'));
const onOnEnter = jest.fn(console.log('onOnEnter'));
const onOnExit = jest.fn(console.log('onOnExit'));

const machine = createMachine({
  initialState: "off",
  off: {
    actions: {
      onEnter() {
        offOnEnter();
      },
      onExit() {
        offOnExit();
      },
    },
    transitions: {
      switch: {
        target: "on",
        action() {
          console.log('transition action for "switch" in "off" state');
        },
      },
    },
  },
  on: {
    actions: {
      onEnter() {
        onOnEnter()
      },
      onExit() {
        onOnExit()
      },
    },
    transitions: {
      switch: {
        target: "off",
        action() {
          console.log('transition action for "switch" in "on" state');
        },
      },
    },
  },
});

/*
describe("The state machine works properly", () => {
  test("does not transition on invalid transition", () => {
    expect(machine.currentState).toBe('off')
    machine.transition('foo')
    expect(machine.currentState).toBe('off')
  });
  test("transitions", () => {
    expect(machine.currentState).toBe('off')
    machine.transition('switch')
    expect(machine.currentState).toBe('on')
    machine.transition('switch')
    expect(machine.currentState).toBe('off')
  });
  test("onEnter and onExit", () => {
    machine.transition('on');
    expect(onOnEnter).toHaveBeenCalled()
    expect(onOnEnter).toHaveBeenCalledTimes(1)
    machine.transition('off');
    expect(offOnEnter).toHaveBeenCalled()
    expect(offOnEnter).toHaveBeenCalledTimes(1)
  })
});
*/