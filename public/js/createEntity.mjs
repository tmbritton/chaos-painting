import createMachine from './createMachine.mjs'
import eventBus from './eventBus.mjs';

/**
 * Create a new state machine.
 * @param {Object} machineDefinition - Object describing the state machine.
 * @param {Object} machineDefinition.initialState - The initial state of the machine.
 * @returns {Entity} New state machine
 */
const createEntity = (machineDefinition) => {
    const id = crypto.randomUUID();
    const messageQueue = [];
    const previousState = null;
    const state = createMachine(machineDefinition)

    const update = () => {
        if (messageQueue.length === 0) {
            return previousState
        } else {
            messageQueue.forEach((message) => {
                state.transition(message)
                if (state.outbox.length) {
                    state.outbox.forEach(item => {
                        sendMessage(item.recipientId, item.message)
                    })
                }
            })
            previousState = state.value
            return previousState
        }
    }

    const receiveMessage = (senderId, message) => {
        messageQueue.push({sender: senderId, type: message.type, payload: message.payload})
    }

    const sendMessage = (recipientId, message) => {
        eventBus.send(id, recipientId, message)
    }

    eventBus.registerEntity(id, receiveMessage)

    return {
        id,
        state: machineDefinition.initialState,
        update,
        receiveMessage
    }
}

export default createEntity
