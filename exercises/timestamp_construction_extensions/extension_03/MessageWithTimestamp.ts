import * as firestore from "@google-cloud/firestore";
import * as OPA from "../../base/src";

export interface IMessageWithTimestamp {
  readonly id: string;
  readonly message: string;
  readonly dateOfCreation: firestore.Timestamp;
  readonly datesOfUpdates: Array<firestore.Timestamp> | firestore.FieldValue;
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
  message += " on " + now.toDate().toUTCString();
  const messageWithTimestamp: IMessageWithTimestamp = {
    id,
    message,
    dateOfCreation: now,
    datesOfUpdates: firestore.FieldValue.arrayUnion(now),
  };
  return messageWithTimestamp;
}
