import { Message } from './types';

type MessageReceptor = (recipientId: string, m: Message) => void;

type EntityMap = {
  [id: string]: MessageReceptor;
};

/**
 * An event bus for inter-entity communication.
 */
const eventBus = (() => {
  const entityMap: EntityMap = {};

  /**
   * Registers an entity with the event bus, associating it with a message receptor.
   *
   * @param {string} id - The unique identifier of the entity.
   * @param {MessageReceptor} receiveMessage - The message receptor function.
   */
  const registerEntity = (id: string, receiveMessage: MessageReceptor) =>
    (entityMap[id] = receiveMessage);

  /**
   * Sends a message from a sender entity to a recipient entity.
   *
   * @param {string} senderId - The sender's identifier.
   * @param {string} recipientId - The recipient's identifier.
   * @param {Message} message - The message to be sent.
   */
  const send = (senderId: string, recipientId: string, message: Message) =>
    entityMap[recipientId] ? entityMap[recipientId](senderId, message) : null;

  const getEntities = () => entityMap;

  /**
   * Exposes the public API of the event bus, providing methods to register entities and send messages.
   */
  return {
    registerEntity,
    send,
    getEntities,
  };
})();

export default eventBus;
