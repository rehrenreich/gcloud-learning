import * as firestore from "@google-cloud/firestore";
import * as OPA from "../../base/src";

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
  now = now ?? OPA.nowProvider.nowForTimestamp();
  const messageWithTimestamp: IMessageWithTimestamp = {id, message, dateOfCreation: now};
  return messageWithTimestamp;
}

export type MessageWithTimestampFactoryFunc = (...[params]: Parameters<typeof createMessageWithTimestamp>) => ReturnType<typeof createMessageWithTimestamp>;
export const MessageWithTimestampCollectionDescriptor = new OPA.CollectionDescriptor<IMessageWithTimestamp, OPA.QuerySet<IMessageWithTimestamp>, MessageWithTimestampFactoryFunc>("MessageWithTimestamp", "MessagesWithTimestamps", false, (cd) => new OPA.QuerySet<IMessageWithTimestamp>(cd), undefined, undefined, createMessageWithTimestamp); // eslint-disable-line max-len
