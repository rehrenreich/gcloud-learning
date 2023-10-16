import * as OPA from "../../base/src";

export interface IMessageWithDate {
  readonly id: string;
  readonly message: string;
  readonly dateOfCreation: Date;
  readonly dateOfCreations: Array<Date>;
  readonly arbitraryObj: {
    nestedArbitraryObj: {
      dateOfCreation: Date;
      dateOfCreations: Array<Date>;
    }
  }
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
  message += " on " + now.toUTCString();
  const messageWithDate: IMessageWithDate = {
    id,
    message,
    dateOfCreation: now,
    dateOfCreations: [now],
    arbitraryObj: {
      nestedArbitraryObj: {
        dateOfCreation: now,
        dateOfCreations: [now],
      },
    },
  };
  return messageWithDate;
}

export type MessageWithDateFactoryFunc = (...[params]: Parameters<typeof createMessageWithDate>) => ReturnType<typeof createMessageWithDate>;
export const MessageWithDateCollectionDescriptor = new OPA.CollectionDescriptor<IMessageWithDate, OPA.QuerySet<IMessageWithDate>, MessageWithDateFactoryFunc>("MessageWithDate", "MessagesWithDates", false, (cd) => new OPA.QuerySet<IMessageWithDate>(cd), undefined, undefined, createMessageWithDate); // eslint-disable-line max-len
