// Import the createObservable function
import createObservable from '../public/js/observable.mjs';
import { describe, expect, test, jest } from 'bun:test';

// Mock Observer for testing
const mockObserver = {
  next: jest.fn((m) => console.log(m)),
  error: jest.fn((m) => console.log(m)),
  complete: jest.fn((m) => console.log(m)),
};

describe('createObservable', () => {
  test('should call the observer.next method when data is emitted', () => {
    const observerable = createObservable((observer) => {
      observer.next('Next');
    });
    observerable.subscribe(mockObserver);
    expect(mockObserver.next.mock.calls[0][0]).toBe('Next');
  });

  test('should call the observer.error method when an error is emitted', () => {
    const observable = createObservable((observer) => {
      observer.error(new Error('Test error'));
    });

    observable.subscribe(mockObserver);

    // Manually compare the arguments
    expect(mockObserver.error.mock.calls[0][0].message).toBe('Test error');
  });

  test('should call the observer.complete method when the observable is complete', () => {
    const observable = createObservable((observer) => {
      observer.complete();
    });

    observable.subscribe(mockObserver);

    expect(mockObserver.complete).toHaveBeenCalled();
  });
});
