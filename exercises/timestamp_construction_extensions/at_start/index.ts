import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as DataModel from "../../data_model/src";

const app = admin.initializeApp();
const httpsOptions = {cors: false, maxInstances: 2, region: ["us-east1"]};

export const saveMessageWithDateFromDataModel = onRequest(httpsOptions,
  async (request, response) => {
    logger.info("saveMessageWithDateFromDataModel(...) ENTERED", {structuredData: true});
    const message = (request.query.message) ? (request.query.message as string) : "Test Message";

    const db = admin.firestore(app);
    const colRef = db.collection("Messages");
    const docRef = colRef.doc();
    const docId = docRef.id;

    const messageDoc = DataModel.createMessageWithDate(docId, message);
    await docRef.set(messageDoc);

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
    const colRef = db.collection("Messages");
    const docRef = colRef.doc();
    const docId = docRef.id;

    const messageDoc = DataModel.createMessageWithDate(docId, message, now);
    await docRef.set(messageDoc);

    response.send(messageDoc);
    logger.info("saveMessageWithDateFromFunctions(...) COMPLETED", {structuredData: true});
  }
);

export const saveMessageWithTimestampFromDataModel = onRequest(httpsOptions,
  async (request, response) => {
    logger.info("saveMessageWithTimestampFromDataModel(...) ENTERED", {structuredData: true});
    const message = (request.query.message) ? (request.query.message as string) : "Test Message";

    const db = admin.firestore(app);
    const colRef = db.collection("Messages");
    const docRef = colRef.doc();
    const docId = docRef.id;

    const messageDoc = DataModel.createMessageWithTimestamp(docId, message);
    await docRef.set(messageDoc);

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
    const colRef = db.collection("Messages");
    const docRef = colRef.doc();
    const docId = docRef.id;

    const messageDoc = DataModel.createMessageWithTimestamp(docId, message, now);
    await docRef.set(messageDoc);

    response.send(messageDoc);
    logger.info("saveMessageWithTimestampFromFunctions(...) COMPLETED", {structuredData: true});
  }
);
