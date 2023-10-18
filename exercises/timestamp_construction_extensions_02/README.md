# [GCloud Learning - Exercises: Timestamp Construction Extensions, Part 2](https://github.com/rehrenreich/gcloud-learning/tree/main/exercises/timestamp_construction_extensions_02)

The exercises that follow assume you have completed both the [Timestamp Construction Quirk](https://github.com/rehrenreich/gcloud-learning/tree/main/quirks/timestamp_construction) and [Timestamp Construction Extensions, Part 1](https://github.com/rehrenreich/gcloud-learning/tree/main/exercises/timestamp_construction_extensions) exercises. If you have not completed those exercises, please do so before continuing.

You probably noticed that the first set of extensions focused on the Document. It addressed matters such as how to design the interface for a Document Type and how to create and update a Document stored in a Firestore database. That is why those extensions are in Part 1.

Part 2 focuses on the Collection that contains the Documents. So lets proceed with this topic now.

## Extension 1) Create a type alias for the type of the Collection reference

Currently, each of the four Firebase HTTP Functions exported from the "functions" package contain a line of code that obtains a reference to the "Messages" Collection:

```
const colRef = db.collection("Messages");
```

Since this is TypeScript, that "colRef" constant has a type. It is the type of the return value of the "collection" function on the "db" object. Figure out what the type of "colRef" is, then at the top of your "index.ts" file, add a type alias (see https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-aliases) named "CollectionReference".

Then in each HTTP Function, where you declare the "colRef" variable, explicitly specify the type as your type alias from above, namely "CollectionReference".

Now do the same set of steps for the lines of code that starts with "const docRef". Create a type alias named "DocumentReference" and explicitly declare "docRef" as of type "DocumentReference".

Now look at the type definitions exported by the "firebase-admin" package for the types to which your "CollectionReference" and "DocumentReference" aliases refer. Notice that both types refer to classes that contain a "path" string, an "id" string (i.e. the "step" in the "path"), and a "parent" reference, where a CollectionReference has a parent that is a DocumentReference or null and a DocumentReference has a parent that is definitely a CollectionReference.

There is something going on here that is very powerful and a big deal. It is why Firestore is actually superior to all other Document Databases... Because Firestore is not actually a Document Database... It was just made to look that way... It is actually a system for "addressing information" (or "addressing information™" assuming nobody has done the "™" already)... Which is what BigTable is... And without knowing the implementation details of Firestore, I know that Firestore is built on top of BigTable and exports data in the BigTable file format.

Many Document Database programmers do not take the perspective of "addressing information™", they just look at their work as creating Documents and storing them in Collections. And for them, so long as a Document Database does that, they perceive it as "in the same class of products" as all other Document Databases, and then they feel justified in choosing their specific Document Database to use by some smaller competitive difference in feature set.

But BigTable fundamentally stores data is cells addressed by a tuple of {row-key, column-identifier, timestamp} (see https://cloud.google.com/bigtable/docs/overview#storage-model), where the "column-identifier" is a combination of the "column family" and the "column qualifier". The traditional example of a "row-key" for web search is a Reverse Domain Name Notation (RDNN) URL (see https://en.wikipedia.org/wiki/Reverse_domain_name_notation), such that the URL contents go from least-specific to most-specific (e.g. "com.google.cloud"). For such an example, you could store a crawled web page and data relevant to it in the row for that page's RDNN URL. This is an example of "addressing information™".

In a different Document Database other than Firestore, a programmer might think of storing a "Message" Document with ID value "XYZ" as putting this "XYZ" Document inside the "Messages" Collection. In Firestore, a programmer might think the same thing. But a more powerful way of thinking about this is that you are addressing that Document (aka that information) at address "[MY_FIRESTORE_DB_ROOT]/Messages/XYZ", such that the JSON object for the Document exists at the cell at {row-key: "[MY_FIRESTORE_DB_ROOT]/Messages/XYZ", column-identifier: "document", timestamp: now} (or maybe the JSON object is broken-out into multiple columns based on its properties, but we do not care about this implementation detail).

Why is this a more powerful way of thinking?

Well, all Document Databases have a maximum size limit for how much data they can store in an individual Document. Beyond this limit, developers have some EXTREMELY HACKY tricks for splitting a single "conceptual document" across multiple "actually stored documents". And Firestore has one of the smallest maximum size limits of all Document Databases, so if you think in terms of "storing documents in collections", by using Firestore, you are using one of the worst Document Databases available.

But as I said, Firestore is the BEST Document Database available... Because it is not a Document Database... Because we are "addressing information™" instead of "storing documents"... So when you and I encounter such a problem where our Document is growing close to the maximum size limit, we figure out what design decision led to these massively inflating document sizes... And then if it is a "real data issue" (i.e. not a "storing files as data" issue)... Then we start breaking our document data up into sub-documents in a sensible, well-designed manner, where we address the sub-documents using paths of the form "[MY_FIRESTORE_DB_ROOT]/Messages/XYZ/MessageParts/123". THIS IS NOT HACKY... THIS IS GOOD DESIGN!

If you experience this, then you will have a CollectionReference for "MessageParts" that has the id "MessageParts", the path "/Messages/XYZ/MessageParts" and has a parent DocumentReference of "XYZ".

So if we encounter this issue, we do not worry... We just "address information" as nested under other information by creating sub-documents. But all of our sub-documents will descend from a single root document, so our conceptual model will still maintain fidelity with the way we actually store the information... Which is far superior to trying to hack-out multiple documents in the same collection that contain all the information that should be in a single document.

I hope this convinces you that Firestore is the best Document Database to use! So if Google Cloud ever charges you any money (which in my experience, is unlikely, at least during development), just consider that money well spent!

If you are confused, if your code did not work as described, or if you just want to see my solution, you can see my code for this extension [here](https://github.com/rehrenreich/gcloud-learning/tree/main/exercises/timestamp_construction_extensions_02/extension_01).

Copyright © 2023 Ryan Ehrenreich