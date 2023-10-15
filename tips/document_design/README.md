# [GCloud Learning: Document Design](https://github.com/rehrenreich/gcloud-learning/tips/document_design)

NOTE: Personally, I prefer using TypeScript when implementing Application Tier code in the Google Cloud, so any code below is in TypeScript.

When I design a Document Type to store in a Firestore database, I use at least two different interfaces. First, I specify the interface for the actual Document Type (e.g. "User") that I read from the Firestore database.

The Document Type interface should:
1) ALWAYS include a read-only "id" property that contains the ID used to obtain the Firestore document reference (i.e. the document at "/Users/{id}" should contain an "id" property set to the value of "{id}")
2) ALWAYS contain a read-only "dateOfCreation" property that contains the Timestamp at which the document was constructed
3) ALWAYS mark any other properties that should not change as "readonly"
4) USUALLY prefer nullable properties to optional properties (e.g. "myProp1: string | null" )
5) RARELY or NEVER contain optional properties (e.g. "myProp2?: string")

```
    export interface IUser {
      readonly id: string;
      readonly dateOfCreation: firestore.Timestamp;
      // ... other properties
      myProp1: string | null;
      // but NOT "myProp2?: string;"
      myProp3: Array<string>;
    }
```

Specifically, as to points #4 and #5, Firestore is really good at querying on properties that ACTUALLY EXIST in all of your documents in the corresponding Firestore collection. But I have encountered situations in the past where the absence of any value (even just "null") in some documents makes querying a Firestore collection much more cumbersome.

For each Document Type interface, I also implement at least one factory function that takes the arguments necessary to construct a document of the corresponding type and returns the constructed document (a plain JS object containing the properties specified in the Document Type interface).

With that said, for each Document Type that I intend to be updateable (which is most of them), I also specify a Partial Update Type interface. I use the Partial Update Type to create the objects that I use to update ONLY the information that has ACTUALLY changed for the corresponding document, using "collectionRef.set(partialObj, {merge: true})" or "collectionRef.update(partialObj)" to store the updated property values.

The Partial Update Type interface should:
1) NEVER contain properties that are "readonly" on the Document Type interface.
2) USUALLY specify properties as optional (again, using "?" after the property name)
3) RARELY specify properties as required (e.g. "dateOfLatestUpdate" is one of few fields that I require for each update)
4) ALMOST ALWAYS use the same type for the property as the corresponding property in the Document Type interface

On occasion, point #4 must be violated, and such occasions usually are because it is advantageous to use firestore.FieldValue objects (i.e. arrayRemove, arrayUnion, delete, increment, serverTimestamp) to perform an update on ONLY the data that ACTUALLY changed. Specifically, I prefer to use "arrayRemove" and "arrayUnion" to update elements of an array rather than setting the value of the entire array (which risks overwriting concurrent changes).

```
    export interface IUserPartial {
      // ... other properties
      dateOfLatestUpdate: firestore.Timestamp;
      myProp1?: string | null;
      myProp3?: Array<string> | firestore.FieldValue;
    }
```