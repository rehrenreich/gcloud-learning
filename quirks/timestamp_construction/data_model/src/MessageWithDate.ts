import * as OPA from "../../base/src";

export interface IMessageWithDate {
  readonly id: string;
  readonly message: string;
  readonly dateOfCreation: Date;
}

/**
 * Creates a Message document that use the Date type to store its date of creation.
 * @param {string} id The document ID.
 * @param {string} message The message to store.
 * @param {Date | undefined} [now=undefined] The current date and time.
 * @return {IMessageWithDate}
 */
export function createMessageWithDate(id: string, message: string, now: Date | undefined = undefined): IMessageWithDate {
  now = now ?? OPA.nowProvider.nowForDate();
  const messageWithDate: IMessageWithDate = {id, message, dateOfCreation: now};
  return messageWithDate;
}
