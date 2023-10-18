import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as DataModel from "../../data_model/src";

const app = admin.initializeApp();
const httpsOptions = {cors: false, maxInstances: 2, region: ["us-east1"]};

type CollectionReference = admin.firestore.CollectionReference<admin.firestore.DocumentData>;
type DocumentReference = admin.firestore.DocumentReference<admin.firestore.DocumentData>;

export const saveMessageWithDateFromDataModel = onRequest(httpsOptions,
  async (request, response) => {
    logger.info("saveMessageWithDateFromDataModel(...) ENTERED", {structuredData: true});
    const message = (request.query.message) ? (request.query.message as string) : "Test Message";

    const db = admin.firestore(app);
    const colRef: CollectionReference = db.collection("Messages");
    const docRef: DocumentReference = (request.query.id) ? colRef.doc(request.query.id as string) : colRef.doc();
    const docId = docRef.id;
    const docSnap = await docRef.get();
    const docAlreadyExists = docSnap.exists;

    let messageDoc: DataModel.IMessageWithDate | DataModel.IMessageWithDatePartial;
    if (docAlreadyExists) {
      const now = new Date();
      messageDoc = {
        message: message + " on " + now.toUTCString(),
        datesOfUpdates: admin.firestore.FieldValue.arrayUnion(now),
      };
      await docRef.set(messageDoc, {merge: true});
    } else {
      messageDoc = DataModel.createMessageWithDate(docId, message);
      await colRef.add(messageDoc);
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
    const colRef: CollectionReference = db.collection("Messages");
    const docRef: DocumentReference = (request.query.id) ? colRef.doc(request.query.id as string) : colRef.doc();
    const docId = docRef.id;
    const docSnap = await docRef.get();
    const docAlreadyExists = docSnap.exists;

    let messageDoc: DataModel.IMessageWithDate | DataModel.IMessageWithDatePartial;
    if (docAlreadyExists) {
      messageDoc = {
        message: message + " on " + now.toUTCString(),
        datesOfUpdates: admin.firestore.FieldValue.arrayUnion(now),
      };
      await docRef.set(messageDoc, {merge: true});
    } else {
      messageDoc = DataModel.createMessageWithDate(docId, message);
      await colRef.add(messageDoc);
    }

    response.send(messageDoc);
    logger.info("saveMessageWithDateFromFunctions(...) COMPLETED", {structuredData: true});
  }
);

export const saveMessageWithTimestampFromDataModel = onRequest(httpsOptions,
  async (request, response) => {
    logger.info("saveMessageWithTimestampFromDataModel(...) ENTERED", {structuredData: true});
    const message = (request.query.message) ? (request.query.message as string) : "Test Message";

    const db = admin.firestore(app);
    const colRef: CollectionReference = db.collection("Messages");
    const docRef: DocumentReference = (request.query.id) ? colRef.doc(request.query.id as string) : colRef.doc();
    const docId = docRef.id;
    const docSnap = await docRef.get();
    const docAlreadyExists = docSnap.exists;

    let messageDoc: DataModel.IMessageWithTimestamp | DataModel.IMessageWithTimestampPartial;
    if (docAlreadyExists) {
      const now = admin.firestore.Timestamp.now();
      messageDoc = {
        message: message + " on " + now.toDate().toUTCString(),
        datesOfUpdates: admin.firestore.FieldValue.arrayUnion(now),
      };
      await docRef.set(messageDoc, {merge: true});
    } else {
      messageDoc = DataModel.createMessageWithTimestamp(docId, message);
      await colRef.add(messageDoc);
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
    const colRef: CollectionReference = db.collection("Messages");
    const docRef: DocumentReference = (request.query.id) ? colRef.doc(request.query.id as string) : colRef.doc();
    const docId = docRef.id;
    const docSnap = await docRef.get();
    const docAlreadyExists = docSnap.exists;

    let messageDoc: DataModel.IMessageWithTimestamp | DataModel.IMessageWithTimestampPartial;
    if (docAlreadyExists) {
      messageDoc = {
        message: message + " on " + now.toDate().toUTCString(),
        datesOfUpdates: admin.firestore.FieldValue.arrayUnion(now),
      };
      await docRef.set(messageDoc, {merge: true});
    } else {
      messageDoc = DataModel.createMessageWithTimestamp(docId, message);
      await colRef.add(messageDoc);
    }

    response.send(messageDoc);
    logger.info("saveMessageWithTimestampFromFunctions(...) COMPLETED", {structuredData: true});
  }
);
