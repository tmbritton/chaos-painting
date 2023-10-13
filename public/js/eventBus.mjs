// Event bus
export default eventBus = (() => {
    const entityMap = {}

    const registerEntity = (id, receiveMessage) => entityMap[id] = receiveMessage

    const send = (senderId, recipientId, message) => entityMap[recipientId](senderId, message)
    
    return {
        registerEntity,
        send
    }
})();
