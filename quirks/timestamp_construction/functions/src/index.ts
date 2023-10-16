import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as OPA from "../../base/src";
import * as DataModel from "../../data_model/src";

const app = admin.initializeApp();
const httpsOptions = {cors: false, maxInstances: 2, region: ["us-east1"]};

export const saveMessageWithDateFromDataModel = onRequest(httpsOptions,
  (request, response) => {
    logger.info("saveMessageWithDateFromDataModel(...) ENTERED", {structuredData: true});
    const message = (request.query.message) ? (request.query.message as string) : "Test Message";

    const db = admin.firestore(app);
    const colRef = db.collection("Messages");
    const docRef = colRef.doc();
    const docId = docRef.id;

    const messageDoc = DataModel.createMessageWithDate(docId, message);
    docRef.set(messageDoc);

    response.send(messageDoc);
    logger.info("saveMessageWithDateFromDataModel(...) COMPLETED", {structuredData: true});
  }
);

export const saveMessageWithDateFromDataModelTyped = onRequest(httpsOptions,
  (request, response) => {
    logger.info("saveMessageWithDateFromDataModelTyped(...) ENTERED", {structuredData: true});
    const message = (request.query.message) ? (request.query.message as string) : "Test Message";

    const db = admin.firestore(app);
    // NOTE: The unsafe cast on the next line is used to simplify the code to 1 line for this example ONLY
    const dataStorageState = (({db} as unknown) as OPA.IDataStorageState);

    const colRef = DataModel.MessageWithDateCollectionDescriptor.getTypedCollection(dataStorageState);
    const docRef = colRef.doc();
    const docId = docRef.id;

    const messageDoc = DataModel.createMessageWithDate(docId, message);
    docRef.set(messageDoc);

    response.send(messageDoc);
    logger.info("saveMessageWithDateFromDataModelTyped(...) COMPLETED", {structuredData: true});
  }
);

export const saveMessageWithDateFromFunctions = onRequest(httpsOptions,
  (request, response) => {
    logger.info("saveMessageWithDateFromFunctions(...) ENTERED", {structuredData: true});
    const message = (request.query.message) ? (request.query.message as string) : "Test Message";
    const now = new Date();

    const db = admin.firestore(app);
    const colRef = db.collection("Messages");
    const docRef = colRef.doc();
    const docId = docRef.id;

    const messageDoc = DataModel.createMessageWithDate(docId, message, now);
    docRef.set(messageDoc);

    response.send(messageDoc);
    logger.info("saveMessageWithDateFromFunctions(...) COMPLETED", {structuredData: true});
  }
);

export const saveMessageWithDateFromFunctionsTyped = onRequest(httpsOptions,
  (request, response) => {
    logger.info("saveMessageWithDateFromFunctionsTyped(...) ENTERED", {structuredData: true});
    const message = (request.query.message) ? (request.query.message as string) : "Test Message";
    const now = new Date();

    const db = admin.firestore(app);
    // NOTE: The unsafe cast on the next line is used to simplify the code to 1 line for this example ONLY
    const dataStorageState = (({db} as unknown) as OPA.IDataStorageState);

    const colRef = DataModel.MessageWithDateCollectionDescriptor.getTypedCollection(dataStorageState);
    const docRef = colRef.doc();
    const docId = docRef.id;

    const messageDoc = DataModel.createMessageWithDate(docId, message, now);
    docRef.set(messageDoc);

    response.send(messageDoc);
    logger.info("saveMessageWithDateFromFunctionsTyped(...) COMPLETED", {structuredData: true});
  }
);

export const saveMessageWithTimestampFromDataModel = onRequest(httpsOptions,
  (request, response) => {
    logger.info("saveMessageWithTimestampFromDataModel(...) ENTERED", {structuredData: true});
    const message = (request.query.message) ? (request.query.message as string) : "Test Message";

    const db = admin.firestore(app);
    const colRef = db.collection("Messages");
    const docRef = colRef.doc();
    const docId = docRef.id;

    const messageDoc = DataModel.createMessageWithTimestamp(docId, message);
    docRef.set(messageDoc);

    response.send(messageDoc);
    logger.info("saveMessageWithTimestampFromDataModel(...) COMPLETED", {structuredData: true});
  }
);

export const saveMessageWithTimestampFromDataModelTyped = onRequest(httpsOptions,
  (request, response) => {
    logger.info("saveMessageWithTimestampFromDataModelTyped(...) ENTERED", {structuredData: true});
    const message = (request.query.message) ? (request.query.message as string) : "Test Message";

    const db = admin.firestore(app);
    // NOTE: The unsafe cast on the next line is used to simplify the code to 1 line for this example ONLY
    const dataStorageState = (({db} as unknown) as OPA.IDataStorageState);

    const colRef = DataModel.MessageWithTimestampCollectionDescriptor.getTypedCollection(dataStorageState);
    const docRef = colRef.doc();
    const docId = docRef.id;

    const messageDoc = DataModel.createMessageWithTimestamp(docId, message);
    docRef.set(messageDoc);

    response.send(messageDoc);
    logger.info("saveMessageWithTimestampFromDataModelTyped(...) COMPLETED", {structuredData: true});
  }
);

export const saveMessageWithTimestampFromFunctions = onRequest(httpsOptions,
  (request, response) => {
    logger.info("saveMessageWithTimestampFromFunctions(...) ENTERED", {structuredData: true});
    const message = (request.query.message) ? (request.query.message as string) : "Test Message";
    const now = admin.firestore.Timestamp.now();

    const db = admin.firestore(app);
    const colRef = db.collection("Messages");
    const docRef = colRef.doc();
    const docId = docRef.id;

    const messageDoc = DataModel.createMessageWithTimestamp(docId, message, now);
    docRef.set(messageDoc);

    response.send(messageDoc);
    logger.info("saveMessageWithTimestampFromFunctions(...) COMPLETED", {structuredData: true});
  }
);

export const saveMessageWithTimestampFromFunctionsTyped = onRequest(httpsOptions,
  (request, response) => {
    logger.info("saveMessageWithTimestampFromFunctionsTyped(...) ENTERED", {structuredData: true});
    const message = (request.query.message) ? (request.query.message as string) : "Test Message";
    const now = admin.firestore.Timestamp.now();

    const db = admin.firestore(app);
    // NOTE: The unsafe cast on the next line is used to simplify the code to 1 line for this example ONLY
    const dataStorageState = (({db} as unknown) as OPA.IDataStorageState);

    const colRef = DataModel.MessageWithTimestampCollectionDescriptor.getTypedCollection(dataStorageState);
    const docRef = colRef.doc();
    const docId = docRef.id;

    const messageDoc = DataModel.createMessageWithTimestamp(docId, message, now);
    docRef.set(messageDoc);

    response.send(messageDoc);
    logger.info("saveMessageWithTimestampFromFunctionsTyped(...) COMPLETED", {structuredData: true});
  }
);
