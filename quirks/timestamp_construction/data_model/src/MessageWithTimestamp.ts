import * as firestore from "@google-cloud/firestore";

export interface IMessageWithTimestamp {
  readonly id: string;
  readonly message: string;
  readonly dateOfCreation: firestore.Timestamp;
}

/**
 * Creates a Message document that use the Timestamp type to store its date of creation.
 * @param {string} id The document ID.
 * @param {string} message The message to store.
 * @param {firestore.Timestamp | undefined} [now=undefined] The current date and time.
 * @return {IMessageWithTimestamp}
 */
export function createMessageWithTimestamp(id: string, message: string, now: firestore.Timestamp | undefined = undefined): IMessageWithTimestamp {
  now = now ?? firestore.Timestamp.now();
  const messageWithTimestamp: IMessageWithTimestamp = {id, message, dateOfCreation: now};
  return messageWithTimestamp;
}
