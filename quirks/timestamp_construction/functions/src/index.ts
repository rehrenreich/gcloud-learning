import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as DataModel from "../../data_model/src";

export const saveMessageWithDateFromDataModel = onRequest({cors: false, region: ["us-east1"]},
  (request, response) => {
    logger.info("saveMessageWithDateFromDataModel(...) ENTERED", {structuredData: true});
    const message = (request.query.message) ? (request.query.message as string) : "Test Message";

    const app = admin.initializeApp();
    const db = admin.firestore(app);
    const colRef = db.collection("Messages");
    const docRef = colRef.doc();
    const docId = docRef.id;

    const messageDoc = DataModel.createMessageWithDate(docId, message);
    response.send(messageDoc);
    logger.info("saveMessageWithDateFromDataModel(...) COMPLETED", {structuredData: true});
  }
);

export const saveMessageWithDateFromFunctions = onRequest({cors: false, region: ["us-east1"]},
  (request, response) => {
    logger.info("saveMessageWithDateFromFunctions(...) ENTERED", {structuredData: true});
    const message = (request.query.message) ? (request.query.message as string) : "Test Message";
    const now = new Date();

    const app = admin.initializeApp();
    const db = admin.firestore(app);
    const colRef = db.collection("Messages");
    const docRef = colRef.doc();
    const docId = docRef.id;

    const messageDoc = DataModel.createMessageWithDate(docId, message, now);
    response.send(messageDoc);
    logger.info("saveMessageWithDateFromFunctions(...) COMPLETED", {structuredData: true});
  }
);

export const saveMessageWithTimestampFromDataModel = onRequest({cors: false, region: ["us-east1"]},
  (request, response) => {
    logger.info("saveMessageWithTimestampFromDataModel(...) ENTERED", {structuredData: true});
    const message = (request.query.message) ? (request.query.message as string) : "Test Message";

    const app = admin.initializeApp();
    const db = admin.firestore(app);
    const colRef = db.collection("Messages");
    const docRef = colRef.doc();
    const docId = docRef.id;

    const messageDoc = DataModel.createMessageWithTimestamp(docId, message);
    response.send(messageDoc);
    logger.info("saveMessageWithTimestampFromDataModel(...) COMPLETED", {structuredData: true});
  }
);

export const saveMessageWithTimestampFromFunctions = onRequest({cors: false, region: ["us-east1"]},
  (request, response) => {
    logger.info("saveMessageWithTimestampFromFunctions(...) ENTERED", {structuredData: true});
    const message = (request.query.message) ? (request.query.message as string) : "Test Message";
    const now = admin.firestore.Timestamp.now();

    const app = admin.initializeApp();
    const db = admin.firestore(app);
    const colRef = db.collection("Messages");
    const docRef = colRef.doc();
    const docId = docRef.id;

    const messageDoc = DataModel.createMessageWithTimestamp(docId, message, now);
    response.send(messageDoc);
    logger.info("saveMessageWithTimestampFromFunctions(...) COMPLETED", {structuredData: true});
  }
);
