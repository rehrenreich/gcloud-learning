import * as firestore from "@google-cloud/firestore";
import * as OPA from "../../base/src";

export interface IMessagePartial<T extends Date | firestore.Timestamp> extends Record<string, unknown> {
  message?: string;
  datesOfUpdates?: Array<T> | firestore.FieldValue;
}

export interface IMessage<T extends Date | firestore.Timestamp> extends OPA.IDocument {
  readonly id: string;
  message: string;
  readonly dateOfCreation: T;
  readonly datesOfUpdates: Array<T>;
  readonly usesTimestamps: boolean;
}

/**
 * Creates a Message document that use the T type to store its date of creation.
 * @param {string} id The document ID.
 * @param {string} message The message to store.
 * @param {T | undefined} [now=undefined] The current date and time.
 * @param {boolean} [usesTimestampsByDefault=true] Whether to create a Timestamp or Date is the "now" value is undefined.
 * @return {IMessage<T>}
 */
export function createMessage<T extends Date | firestore.Timestamp>(id: string, message: string, now: T | undefined = undefined, usesTimestampsByDefault = true): IMessage<T> {
  now = now ?? ((usesTimestampsByDefault ? OPA.nowProvider.nowForTimestamp() : OPA.nowProvider.nowForDate()) as T);
  const usesTimestamps = OPA.isOf<firestore.Timestamp>(now, (t: unknown) => (!OPA.isNullish((t as Record<string, unknown>)["nanoseconds"]) && !OPA.isNullish((t as Record<string, unknown>)["seconds"]))); // eslint-disable-line max-len
  message += " on " + (usesTimestamps ? (now as firestore.Timestamp).toDate().toUTCString() : (now as Date).toUTCString());
  const messageDoc: IMessage<T> = {
    id,
    message,
    dateOfCreation: now,
    datesOfUpdates: [now],
    usesTimestamps,
  };
  return messageDoc;
}
