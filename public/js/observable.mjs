/**
 * A factory function that creates an observable.
 *
 * @param {Function} thrower - A callback function used to interact with the observer.
 * @returns {Object} An object containing the `subscribe` method.
 */
const createObservable = (thrower) => {
    /**
     * Subscribes an observer to the observable.
     *
     * @param {Observer} observer - The observer object with specific methods.
     * @param {Function} observer.next - The 'next' method for receiving data.
     * @param {Function} observer.error - The 'error' method for receiving errors.
     * @param {Function} observer.complete - The 'complete' method for completion.
     * @returns {void}
     */
    const subscribe = (observer) => {     
        return thrower(observer);
    }

    return {
        subscribe
    }
}

export default createObservable
