export type Observer = {
  next: (next: any) => void;
  error: (error: any) => void;
  complete: () => void;
};

type Emitter = (observer: Observer) => void;

export type Subscription = (observer: Observer) => void;

export type Observable = (emitter: Emitter) => { subscribe: Subscription };

/**
 * A factory function that creates an observable.
 * @param {Function} emitter - A callback function used to interact with the observer.
 * @returns {Object} An object containing the `subscribe` method.
 */
const createObservable = (emitter: Emitter): { subscribe: Subscription } => {
  /**
   * Subscribes an observer to the observable.
   */
  const subscribe: Subscription = (observer) => emitter(observer);

  return {
    subscribe,
  };
};

export default createObservable;
