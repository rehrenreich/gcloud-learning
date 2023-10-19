import * as firestore from "@google-cloud/firestore";
import * as OPA from "../../base/src";

export interface IMessagePartial extends Record<string, unknown> {
  message?: string;
  datesOfUpdates?: Array<Date> | firestore.FieldValue;
}

export interface IMessage extends OPA.IDocument {
  readonly id: string;
  message: string;
  readonly dateOfCreation: Date;
  readonly datesOfUpdates: Array<Date>;
}

/**
 * Creates a Message document that use the Date type to store its date of creation.
 * @param {string} id The document ID.
 * @param {string} message The message to store.
 * @param {Date | undefined} [now=undefined] The current date and time.
 * @return {IMessage}
 */
export function createMessage(id: string, message: string, now: Date | undefined = undefined): IMessage {
  now = now ?? OPA.nowProvider.nowForDate();
  message += " on " + now.toUTCString();
  const messageDoc: IMessage = {
    id,
    message,
    dateOfCreation: now,
    datesOfUpdates: [now],
  };
  return messageDoc;
}
