import createMachine, {
  CurrentState,
  StateMachine,
  getTransitionTarget,
  MachineContext,
} from '../app/createMachine.js';
import { describe, expect, test, jest, beforeEach } from 'bun:test';

// Import createMachine and other dependencies here
const offOnEnter = jest.fn();
const offOnExit = jest.fn();
const onOnEnter = jest.fn();
const onOnExit = jest.fn();

describe('createMachine', () => {
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
              target: 'on',
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
              target: 'off',
            },
          },
        },
      },
    });
  });

  test('Initial state should be off', () => {
    machine.subscribe({
      next: (state: CurrentState) => {
        expect(state.state).toBe('off');
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        console.log('complete');
      },
    });
  });

  test("state should be 'on' after a switch event", () => {
    let currentState = '';

    machine.subscribe({
      next: (state: CurrentState) => {
        currentState = state.state;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        console.log('complete');
      },
    });
    machine.dispatch({ type: 'switch' });
    expect(currentState).toBe('on');
  });

  test('should call transition onEnter and onExit functions', () => {
    machine.subscribe({
      next: (_state: CurrentState) => {},
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        console.log('complete');
      },
    });
    machine.dispatch({ type: 'switch' });

    expect(offOnEnter).toHaveBeenCalled();
    expect(offOnExit).toHaveBeenCalled();
    expect(onOnEnter).toHaveBeenCalled();
  });

  test('should throw error for non-existent transition', () => {
    machine.subscribe({
      next: (_state: CurrentState) => {},
      error: (e) => {
        expect(e).toEqual('State off has no handler for event Balls');
      },
      complete: () => {},
    });
    machine.dispatch({ type: 'Balls' });
  });
});

test('should use a reducer to make changes to machine context', () => {
  let machine: StateMachine;
  let context: MachineContext;

  machine = createMachine({
    initialContext: {
      count: 0,
    },
    states: {
      off: {
        isInitial: true,
        events: {
          switch: {
            target: 'on',
            reducer: (currentContext, _payload) => {
              // Example: Increment a value in the context
              return { ...currentContext, count: currentContext.count + 1 };
            },
          },
        },
      },
      on: {},
    },
  });

  machine.subscribe({
    next: (state: CurrentState) => {
      context = state.context;
    },
    error: (error) => {
      console.log(error);
    },
    complete: () => {},
  });

  machine.dispatch({ type: 'switch' });

  // Assert that the context has been updated by the reducer
  expect(context.count).toBe(1);
});

test('If target is a function, it should call that function to determine the next state', () => {
  let machine: StateMachine;
  let currentState = '';

  machine = createMachine({
    initialContext: {
      isConditionMet: true,
    },
    states: {
      off: {
        isInitial: true,
        events: {
          switch: {
            target: (_currentState, context) => {
              // Example: Determine the next state based on a condition
              return context.isConditionMet ? 'on' : 'off';
            },
          },
        },
      },
      on: {},
    },
  });

  machine.subscribe({
    next: (state: CurrentState) => {
      currentState = state.state;
    },
    error: (error) => {
      console.log(error);
    },
    complete: () => {},
  });

  machine.dispatch({ type: 'switch' });

  // Assert that the currentState has been updated by the target function
  expect(currentState).toBe('on'); // Assuming isConditionMet is true in this test case
});

test('getTransitionTarget works as expected', () => {
  const states = {
    off: {
      isInitial: true,
      events: {
        switch: {
          target: 'on',
        },
      },
    },
    on: {
      events: {
        switch: {
          target: 'off',
        },
      },
    },
  };

  let target = getTransitionTarget('on', 'off', {}, states, {});
  expect(target).toBe('on');

  target = getTransitionTarget('off', 'on', {}, states, {});
  expect(target).toBe('off');

  target = getTransitionTarget(undefined, 'off', {}, states, {});
  expect(target).toBeUndefined();

  target = getTransitionTarget(
    (payload, _context) => {
      // Example: Determine the next state based on payload
      return payload.isConditionMet ? 'on' : 'off';
    },
    'off',
    {},
    states,
    { isConditionMet: true }
  );
  expect(target).toBe('on');

  // Additional test with a different payload condition
  target = getTransitionTarget(
    (payload, _context) => {
      return payload.isConditionMet ? 'on' : 'off';
    },
    'off',
    {},
    states,
    { isConditionMet: false }
  );
  expect(target).toBe('off');
});
