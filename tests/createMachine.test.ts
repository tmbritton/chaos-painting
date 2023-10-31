import createMachine, {CurrentState, StateMachine} from "../app/createMachine.js";
import { describe, expect, test, jest, beforeEach } from "bun:test";

// Import createMachine and other dependencies here
const offOnEnter = jest.fn();
const offOnExit = jest.fn();
const onOnEnter = jest.fn();
const onOnExit = jest.fn();

describe("createMachine", () => {
  let machine: StateMachine;

  beforeEach(() => {
    machine = createMachine({
      states: {
        off: {
          isInitial: true,
          actions: {
            onEnter: () => {
              offOnEnter();
            },
            onExit: () => {
              offOnExit();
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
              onOnEnter();
            },
            onExit: () => {
              onOnExit();
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

  test("should call transition onEnter and onExit functions", () => {
    machine.subscribe({
      next: (_state: CurrentState) => {},
      error: (e) => {console.log(e)},
      complete: () => {console.log('complete')}
    })
    machine.dispatch({ type: "switch" });

    expect(offOnEnter).toHaveBeenCalled()
    expect(offOnExit).toHaveBeenCalled()
    expect(onOnEnter).toHaveBeenCalled()
  });

  test("should throw error for non-existent transition", () => {
    machine.subscribe({
      next: (_state: CurrentState) => {},
      error: (e) => {
        expect(e).toEqual('State off has no handler for event Balls')
      },
      complete: () => {}
    })
    machine.dispatch({ type: 'Balls'});
  });
});
