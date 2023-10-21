import * as firestore from "@google-cloud/firestore";
import * as OPA from "../../base/src";

export interface IMessagePartial extends Record<string, unknown> {
  message?: string;
  datesOfUpdates?: Array<firestore.Timestamp> | firestore.FieldValue;
}

export interface IMessage extends OPA.IDocument {
  readonly id: string;
  message: string;
  readonly dateOfCreation: firestore.Timestamp;
  readonly datesOfUpdates: Array<firestore.Timestamp>;
}

/**
 * Creates a Message document that use the firestore.Timestamp type to store its date of creation.
 * @param {string} id The document ID.
 * @param {string} message The message to store.
 * @param {firestore.Timestamp | undefined} [now=undefined] The current date and time.
 * @return {IMessage}
 */
export function createMessage(id: string, message: string, now: firestore.Timestamp | undefined = undefined): IMessage {
  now = now ?? OPA.nowProvider.nowForTimestamp();
  message += " on " + now?.toDate().toUTCString();
  const messageDoc: IMessage = {
    id,
    message,
    dateOfCreation: now,
    datesOfUpdates: [now],
  };
  return messageDoc;
}

/** Class providing queries for Message collection. */
export class MessageQuerySet extends OPA.QuerySet<IMessage> {
  /**
   * Creates a MessageQuerySet.
   * @param {OPA.ITypedCollectionDescriptor<IMessage>} collectionDescriptor The collection descriptor to use for queries.
   */
  constructor(collectionDescriptor: OPA.ITypedCollectionDescriptor<IMessage>) {
    super(collectionDescriptor);
  }

  /**
   * The typed collection descriptor to use for queries.
   * @type {OPA.ITypedQueryableFactoryCollectionDescriptor<IMessage, MessageQuerySet, unknown>}
   */
  get typedCollectionDescriptor(): OPA.ITypedQueryableFactoryCollectionDescriptor<IMessage, MessageQuerySet, OPA.DefaultFunc<IMessage>> {
    return OPA.convertTo<OPA.ITypedQueryableFactoryCollectionDescriptor<IMessage, MessageQuerySet, OPA.DefaultFunc<IMessage>>>(this.collectionDescriptor);
  }

  /**
   * Creates a Message document that use the firestore.Timestamp type to store its date of creation.
   * @param {OPA.IDataStorageState} ds The state container for data storage.
   * @param {string} message The message to store.
   * @param {firestore.Timestamp | undefined} [now=undefined] The current date and time.
   * @return {Promise<string>} The new document ID.
   */
  async create(ds: OPA.IDataStorageState, message: string, now: firestore.Timestamp | undefined = undefined): Promise<string> {
    OPA.assertDataStorageStateIsNotNullish(ds);
    OPA.assertFirestoreIsNotNullish(ds.db);

    const collectionRef = this.collectionDescriptor.getTypedCollection(ds);
    const documentRef = collectionRef.doc();
    const documentId = documentRef.id;
    const document = createMessage(documentId, message, now);

    OPA.assertNonNullish(document);

    const batchUpdate = ds.constructorProvider.writeBatch();
    batchUpdate.create(documentRef, document);
    await batchUpdate.commit();
    return documentId;
  }

  /**
   * Updates a Message document that use the firestore.Timestamp type to store its date of creation using an IMessagePartial object.
   * @param {OPA.IDataStorageState} ds The state container for data storage.
   * @param {string} id The document ID.
   * @param {IMessagePartial} updateObject The object containing the updates.
   * @return {Promise<void>}
   */
  async update(ds: OPA.IDataStorageState, documentId: string, updateObject: IMessagePartial): Promise<void> {
    OPA.assertDataStorageStateIsNotNullish(ds);
    OPA.assertFirestoreIsNotNullish(ds.db);
    OPA.assertNonNullish(updateObject, "The incoming Update Object must not be null.");

    const document = await this.getByIdWithAssert(ds, documentId);
    const collectionRef = this.collectionDescriptor.getTypedCollection(ds);
    const documentRef = collectionRef.doc(document.id);

    const batchUpdate = ds.constructorProvider.writeBatch();
    batchUpdate.set(documentRef, updateObject, {merge: true});
    await batchUpdate.commit();
  }
}
