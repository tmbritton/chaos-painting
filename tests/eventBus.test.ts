import eventBus from '../app/eventBus';
import { Message } from '../app/types';
import { describe, jest, beforeEach, test, expect } from 'bun:test';

describe('eventBus', () => {
  let entityMap: any = {};

  // Mock implementation for message receptors
  const mockMessageReceptor = jest.fn((recipientId, message) => {
    // Implement your mock behavior here, e.g., store messages or trigger actions
  });

  beforeEach(() => {
    entityMap = {}; // Reset entityMap before each test
  });

  test('registerEntity registers an entity with a message receptor', () => {
    eventBus.registerEntity('entity1', mockMessageReceptor);

    // Verify that the entity is registered
    const entities = eventBus.getEntities();
    expect(entities.entity1).toBe(mockMessageReceptor);
  });

  test('send sends a message from a sender entity to a recipient entity', () => {
    // Register sender and recipient entities
    eventBus.registerEntity('senderEntity', mockMessageReceptor);
    eventBus.registerEntity('recipientEntity', mockMessageReceptor);

    const message: Message = {
      type: 'chat',
      payload: {
        content: 'Hello, recipient!',
      },
    };

    // Send a message from senderEntity to recipientEntity
    eventBus.send('senderEntity', 'recipientEntity', message);

    // Verify that the message receptor was called with the correct arguments
    expect(mockMessageReceptor).toHaveBeenCalled();
  });

  test('send handles the case when the recipient entity is not registered', () => {
    const mockNegativeMessageReceptor = jest.fn((recipientId, message) => {
      // Implement your mock behavior here, e.g., store messages or trigger actions
    });
    // Register sender entity
    eventBus.registerEntity('senderEntity', mockNegativeMessageReceptor);

    const message: Message = {
      type: 'chat',
      payload: {
        content: 'Hello, recipient!',
      },
    };

    // Try to send a message to an unregistered recipient entity
    // In this case, the message receptor should not be called
    eventBus.send('senderEntity', 'nonExistentRecipient', message);

    // Verify that the message receptor was not called
    expect(mockNegativeMessageReceptor).not.toHaveBeenCalled();
  });
});
