import createMachine from "../public/js/createMachine.mjs";
import { describe, expect, test, jest } from "bun:test";

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
