import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as OPA from "../../base/src";
import * as DataModel from "../../data_model/src";

const app = admin.initializeApp();
const httpsOptions = {cors: false, maxInstances: 2, region: ["us-east1"]};

OPA.nowProvider.nowForTimestamp = admin.firestore.Timestamp.now;
// NOTE: The following function is a hacky shortcut and NOT intended for production codebase
const getConstructorProvider = (db: admin.firestore.Firestore): OPA.IFirebaseConstructorProvider => (({
  arrayUnion: admin.firestore.FieldValue.arrayUnion,
  timestampNow: admin.firestore.Timestamp.now,
  writeBatch: () => (db.batch()),
} as unknown) as OPA.IFirebaseConstructorProvider);

type MessageConstructor = OPA.DefaultFunc<DataModel.IMessage>;
const messagesColDesc = new OPA.CollectionDescriptor<DataModel.IMessage, DataModel.MessageQuerySet, MessageConstructor>("Message", "Messages", false, (cd) => new DataModel.MessageQuerySet(cd));

export const saveMessageWithDateFromDataModel = onRequest(httpsOptions,
  async (request, response) => {
    logger.info("saveMessageWithDateFromDataModel(...) ENTERED", {structuredData: true});
    const message = (request.query.message) ? (request.query.message as string) : "Test Message";

    const db = admin.firestore(app);
    const ds = (({db, constructorProvider: getConstructorProvider(db)} as unknown) as OPA.IDataStorageState); // NOTE: This is a hacky shortcut and NOT intended for production codebase

    let messageDoc: DataModel.IMessage | DataModel.IMessagePartial;
    if (request.query.id) {
      const now = new Date();
      messageDoc = {
        message: message + " on " + now.toUTCString(),
        datesOfUpdates: admin.firestore.FieldValue.arrayUnion(now),
      };
      await messagesColDesc.queries.update(ds, (request.query.id as string), messageDoc);
    } else {
      const messageDocId = await messagesColDesc.queries.create(ds, message);
      messageDoc = await messagesColDesc.queries.getByIdWithAssert(ds, messageDocId);
    }

    response.send(messageDoc);
    logger.info("saveMessageWithDateFromDataModel(...) COMPLETED", {structuredData: true});
  }
);

export const saveMessageWithDateFromFunctions = onRequest(httpsOptions,
  async (request, response) => {
    logger.info("saveMessageWithDateFromFunctions(...) ENTERED", {structuredData: true});
    const message = (request.query.message) ? (request.query.message as string) : "Test Message";
    const now = new Date();

    const db = admin.firestore(app);
    const ds = (({db, constructorProvider: getConstructorProvider(db)} as unknown) as OPA.IDataStorageState); // NOTE: This is a hacky shortcut and NOT intended for production codebase

    let messageDoc: DataModel.IMessage | DataModel.IMessagePartial;
    if (request.query.id) {
      messageDoc = {
        message: message + " on " + now.toUTCString(),
        datesOfUpdates: admin.firestore.FieldValue.arrayUnion(now),
      };
      await messagesColDesc.queries.update(ds, (request.query.id as string), messageDoc);
    } else {
      const messageDocId = await messagesColDesc.queries.create(ds, message, now);
      messageDoc = await messagesColDesc.queries.getByIdWithAssert(ds, messageDocId);
    }

    response.send(messageDoc);
    logger.info("saveMessageWithDateFromFunctions(...) COMPLETED", {structuredData: true});
  }
);

export const readMessages = onRequest(httpsOptions,
  async (request, response) => {
    logger.info("readMessages(...) ENTERED", {structuredData: true});
    const now = new Date();

    const db = admin.firestore(app);
    const ds = (({db} as unknown) as OPA.IDataStorageState); // NOTE: This is a hacky shortcut and NOT intended for production codebase
    const messageDocs = await messagesColDesc.queries.getAll(ds);

    response.send({messages: messageDocs, dateOfQuery: now});
    logger.info("readMessages(...) COMPLETED", {structuredData: true});
  }
);
