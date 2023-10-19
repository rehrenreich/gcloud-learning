import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as OPA from "../../base/src";
import * as DataModel from "../../data_model/src";

const app = admin.initializeApp();
const httpsOptions = {cors: false, maxInstances: 2, region: ["us-east1"]};

type MessageDocument = DataModel.IMessage;
type MessageDocumentPartial = DataModel.IMessagePartial;
type MessageQuerySet = OPA.QuerySet<MessageDocument>;
type MessageConstructor = OPA.DefaultFunc<MessageDocument>;
const messagesColDesc = new OPA.CollectionDescriptor<MessageDocument, MessageQuerySet, MessageConstructor>("Message", "Messages", false, (cd) => new OPA.QuerySet<MessageDocument>(cd));
type CollectionReference = admin.firestore.CollectionReference<MessageDocument>;
type DocumentReference = admin.firestore.DocumentReference<MessageDocument>;

export const saveMessageWithTimestampFromDataModel = onRequest(httpsOptions,
  async (request, response) => {
    logger.info("saveMessageWithTimestampFromDataModel(...) ENTERED", {structuredData: true});
    const message = (request.query.message) ? (request.query.message as string) : "Test Message";

    const db = admin.firestore(app);
    const ds = (({db} as unknown) as OPA.IDataStorageState); // NOTE: This is a hacky shortcut and NOT intended for production codebase
    const colRefTyped: CollectionReference = messagesColDesc.getTypedCollection(ds);
    const docRefTyped: DocumentReference = (request.query.id) ? colRefTyped.doc(request.query.id as string) : colRefTyped.doc();
    const docId = docRefTyped.id;
    const docSnap = await docRefTyped.get();
    const docAlreadyExists = docSnap.exists;

    let messageDoc: MessageDocument | MessageDocumentPartial;
    if (docAlreadyExists) {
      const now = admin.firestore.Timestamp.now();
      messageDoc = {
        message: message + " on " + now.toDate().toUTCString(),
        datesOfUpdates: admin.firestore.FieldValue.arrayUnion(now),
      };
      await docRefTyped.set(messageDoc, {merge: true});
    } else {
      messageDoc = DataModel.createMessage(docId, message);
      await colRefTyped.add(messageDoc);
    }

    response.send(messageDoc);
    logger.info("saveMessageWithTimestampFromDataModel(...) COMPLETED", {structuredData: true});
  }
);

export const saveMessageWithTimestampFromFunctions = onRequest(httpsOptions,
  async (request, response) => {
    logger.info("saveMessageWithTimestampFromFunctions(...) ENTERED", {structuredData: true});
    const message = (request.query.message) ? (request.query.message as string) : "Test Message";
    const now = admin.firestore.Timestamp.now();

    const db = admin.firestore(app);
    const ds = (({db} as unknown) as OPA.IDataStorageState); // NOTE: This is a hacky shortcut and NOT intended for production codebase
    const colRefTyped: CollectionReference = messagesColDesc.getTypedCollection(ds);
    const docRefTyped: DocumentReference = (request.query.id) ? colRefTyped.doc(request.query.id as string) : colRefTyped.doc();
    const docId = docRefTyped.id;
    const docSnap = await docRefTyped.get();
    const docAlreadyExists = docSnap.exists;

    let messageDoc: MessageDocument | MessageDocumentPartial;
    if (docAlreadyExists) {
      messageDoc = {
        message: message + " on " + now.toDate().toUTCString(),
        datesOfUpdates: admin.firestore.FieldValue.arrayUnion(now),
      };
      await docRefTyped.set(messageDoc, {merge: true});
    } else {
      messageDoc = DataModel.createMessage(docId, message, now);
      await colRefTyped.add(messageDoc);
    }

    response.send(messageDoc);
    logger.info("saveMessageWithTimestampFromFunctions(...) COMPLETED", {structuredData: true});
  }
);

export const readMessages = onRequest(httpsOptions,
  async (request, response) => {
    logger.info("readMessages(...) ENTERED", {structuredData: true});
    const now = admin.firestore.Timestamp.now();

    const db = admin.firestore(app);
    const ds = (({db} as unknown) as OPA.IDataStorageState); // NOTE: This is a hacky shortcut and NOT intended for production codebase
    const messageDocs = await messagesColDesc.queries.getAll(ds);

    response.send({messages: messageDocs, dateOfQuery: now});
    logger.info("readMessages(...) COMPLETED", {structuredData: true});
  }
);
