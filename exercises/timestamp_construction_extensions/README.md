# [GCloud Learning - Exercises: Timestamp Construction Extensions](https://github.com/rehrenreich/gcloud-learning/tree/main/exercises/timestamp_construction_extensions)

Before beginning the exercises that follow, you should first complete the steps listed in the README in the [Timestamp Construction Quirk directory](https://github.com/rehrenreich/gcloud-learning/tree/main/quirks/timestamp_construction).

After you have done so, save whatever edits you made to the files in that codebase by commiting them to a branch (if you are using Git) or adding them to a zip file. Then revert your source code files for that project to the original state that they were in when you downloaded or cloned from the "GCloud Learning" GitHub repository.

Next, add the four "await" operators and four "async" keywords that should exist the "index.ts" file in the "functions" package. Your two Document Type files and your Firebase HTTP Functions file (namely, "index.ts" in the "functions" package) should resemble the three files [here](https://github.com/rehrenreich/gcloud-learning/tree/main/exercises/timestamp_construction_extensions/at_start)).

Once that it is so, you are ready to begin implementing the following extensions.

## Extension 1) Add an "id" value to the HTTP Function query string

Currently, each of the four Firebase HTTP Functions exported from the "functions" package contain a line of code to get a new Document reference from the Firestore Collection reference:

```
const docRef = colRef.doc();
```

In order to use the "id" value from the query string, if such a value exists, those lines of code should be changed to use the "id" value, if it is present, to obtain a reference to an existing Document, and otherwise to create a new Document reference as the code does now.

After implementing this change, run "firebase deploy --only functions" to redeploy the Firebase HTTP Functions.

Next, record the existing number of Documents currently present in the "Messages" Collection in your Firestore database. You can even write a query to obtain this count, if you desire.

Next, in your browser tabs where you run the HTTP Functions, click the the address bar to edit the current URL. Then append "?id=[THE_ID_VALUE_DISPLAYED_IN_THE_RESULT_OF_YOUR_PREVIOUS_CALL]" to the query string in the address bar. For example, in the results from your prior run of "saveMessageWithTimestampFromDataModel", copy the "id" value in the JSON data that is displayed in your browser tab and, after you add "?id=" to the end of the string in the address bar, paste that value there, as well.

Now, re-run your function and check that the number of Documents in the "Messages" Collection is the same as it was before you re-ran your function.

If you are confused, if your code did not work as described, or if you just want to see my solution, you can see my code for this extension [here](https://github.com/rehrenreich/gcloud-learning/tree/main/exercises/timestamp_construction_extensions/extension_01).

## Extension 2) Add arrays named "datesOfUpdates" to IMessageWithDate and IMessageWithTimestamp

Currently, each of the two Document Types (i.e. IMessageWithDate and IMessageWithTimestamp) that we store in the "Messages" Collection contain three properties:

```
    readonly id: string;
    readonly message: string;
    readonly dateOfCreation: Date; // or firestore.Timestamp for IMessageWithTimestamp
```

and the construction code for instances of those Document Types contains three initalizers:

```
    id,
    message,
    dateOfCreation: now,
```

To the first list, please add a fourth property named "datesOfUpdates" that is of type "Array&lt;Date&gt;" (or "Array&lt;firestore.Timestamp&gt;" for IMessageWithTimestamp).

After you do so, you should see your IDE (I use Visual Studio Code) complain that you are no longer initializing the complete set of properties in the construction code.

To resolve this, add a fourth property initializer that sets the "datesOfUpdates" array to an array containing only the "now" value.

Next, run "firebase deploy --only functions" to redeploy the Firebase HTTP Functions. Your functions should redeploy correctly.

Finally, re-run each function by refreshing the corresponding browser pages. After doing so, in both the Firestore database and the browers pages, you should see an array named "datesOfUpdates" that ONLY ever contains one element (i.e. an element with the same value as "dateOfCreation", but inside of an array). 

Moreover, every time you refresh the tab, the entire contents of the "datesOfUpdates" array should be overritten and the "dateOfCreation" should be reset to the newest possible value. This is because your code now maintains the "id" value across calls, but the entire document is actually being overritten on every call. Obviously, this behavior is not ideal, but we will fix it in the subsequent extensions below.

If you are confused, if your code did not work as described, or if you just want to see my solution, you can see my code for this extension [here](https://github.com/rehrenreich/gcloud-learning/tree/main/exercises/timestamp_construction_extensions/extension_02).

## Extension 3) Use firestore.FieldValue.arrayUnion to append values to "datesOfUpdates"

In order to resolve the issue where the entire "datesOfUpdates" array is being overritten on each call, we will use FieldValues to solve this. FieldValues are basically objects that signal to the Firestore serializer to do some type of partial update from within the Data Tier (inside the Google code for Firestore itself).

So for our "datesOfUpdates" properties in our Document Types, for the type "Array&lt;Date&gt;", change this to "Array&lt;Date&gt; | firestore.FieldValue", and for the type "Array&lt;firestore.Timestamp&gt;" change this to "Array&lt;firestore.Timestamp&gt; | firestore.FieldValue". Doing so signals to the TypeScript compiler that the value that the "datesOfUpdates" property can be assigned to a value that is EITHER an array of dates OR a FieldValue.

Next, in your initializers for the "datesOfUpdates" properties, instead of setting these properties to arrays containing the "now" value, instead set these properties to "firestore.FieldValue.arrayUnion(now)".

Next, we have one more step that we must implement in order for the FieldValues to have the effect that we desire. Namely, we must enable our calls to "set(...)" to merge the new data into the old data. To accomplish, pass {merge: true} as the second argument to the set function.

Next, run "firebase deploy --only functions" to redeploy the Firebase HTTP Functions. Your functions should redeploy correctly.

Finally, re-run each function by refreshing the corresponding browser pages. After doing so, you should see that the "dateOfCreation" property is still being overritten (because we have not fixed that issue yet) and you should see what appears to be the same behavior for the "datesOfUpdates" property. But if you go to the Cloud Console for Firestore and look at the actual data that is stored, you will see that "datesOfUpdates" now contains an ever-growing list of date values, with a new date value added each time you re-run the corresponding HTTP Function.

If you are confused, if your code did not work as described, or if you just want to see my solution, you can see my code for this extension [here](https://github.com/rehrenreich/gcloud-learning/tree/main/exercises/timestamp_construction_extensions/extension_03).

## Extension 4) Use "delete" operator to remove properties from object that will be passed to "set"

The remainder to the extensions in this README address ways to ONLY update the property values in the database that we actually want to change. To be specific, for the remaining extensions, let us assume that our requirements have changed and that we want the "message" field to be updateable, but we do not want "id" or "dateOfCreation" fields to be updateable.

The first option for doing so is in my view the most brute-force and the least desirable.

Before getting to better options, please try to use the "delete" operator (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete) to remove the properties from the constructed object prior to calling "set" that we do not wish to change when the Document already exists in the database (i.e. call "delete" on "id" and "dateOfCreation" prior to caling "set" if a Document corresponding to the "id" already exists in the database).

For this Extension, please re-deploy your code and check that your solution works.

If you are confused, if your code did not work as described, or if you just want to see my solution, you can see my code for this extension [here](https://github.com/rehrenreich/gcloud-learning/tree/main/exercises/timestamp_construction_extensions/extension_04).

## Extension 5) Pass object created inline with only the desired properties to "set"

In this extension, we will start to explore more graceful options than brute-force deleting fields from a typed object (which is, in my view, almost never a good way to solve a problem).

Please try to create an the "object initializer" syntax (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer) to create an new object containing only the properties that we wish to be updateable. After you do so, if you look at the type of your new object, you will see that the TypeScript compiler gives it a type which is composed of the property values that it contains, which is, in my opinion, a nice feature of TypeScript.

Also, since we are now using two different object to perform Firestore database updates depending on whether a corresponding Document already exists, please use "add" when you are passing the object that does not already exist, and please use set when you are passing the object that already exists.

For this Extension, please re-deploy your code and check that your solution works.

If you are confused, if your code did not work as described, or if you just want to see my solution, you can see my code for this extension [here](https://github.com/rehrenreich/gcloud-learning/tree/main/exercises/timestamp_construction_extensions/extension_05).

## Extension 6) Same as Extension 5, but replace "set" with "update"

In this extension, you will use the code for the previous extension, but as you have already separated calls that produce new Documents in the Firestore database from calls that perform updates on Documents that already exist in the Firestore database, now is a great opportunity to use "update" instead of "set" to perform the updates, so please do that.

Do any new challenges arise? If so, figure out how to solve them.

For this Extension, please re-deploy your code and check that your solution works.

If you are confused, if your code did not work as described, or if you just want to see my solution, you can see my code for this extension [here](https://github.com/rehrenreich/gcloud-learning/tree/main/exercises/timestamp_construction_extensions/extension_06).

## Extension 7) Use separate interface type for "complete" object and "partial update" object

To me, it was nice of TypeScript to provide some auto-generated type for the update object that we created in the prior two extensions, but the TypeScript compiler cannot read your mind, so often, it is preferrable to explicitly define an interface type yourself, rather than depending on the TypeScript compiler to do so.

So I ask that you apply the guidance I have shared [here](https://github.com/rehrenreich/gcloud-learning/tree/main/tips/document_design) to define two separate interfaces, one for reading or writing the complete Document, and one for performing partial updates.

For this Extension, please re-deploy your code and check that your solution works.

If you are confused, if your code did not work as described, or if you just want to see my solution, you can see my code for this extension [here](https://github.com/rehrenreich/gcloud-learning/tree/main/exercises/timestamp_construction_extensions/extension_07).

## Extension 8) Same as Extension 7, but replace "set" with "update"

Similar to Extension 6, in this extension, you will use the code for the previous extension, but use "update" instead of "set" to perform the updates, so please do that.

If any new challenges did arise in Extension 6, please consider whether there is a more graceful way you can address them in this Extension, and if you think of a way, please try to implement it in your solution to this Extension.

For this Extension, please re-deploy your code and check that your solution works.

If you are confused, if your code did not work as described, or if you just want to see my solution, you can see my code for this extension [here](https://github.com/rehrenreich/gcloud-learning/tree/main/exercises/timestamp_construction_extensions/extension_08).

## Extension 9) Now do the "Extra Challenge 4 (for Later)" that I mentioned in the Timestamp Construction Exercise

Now that you have developed your expertise in "add", "merge", and "set", you are ready to perform that extra challenge that I mentioned earlier, if you so desire.

If you wish, as a refresher, please re-read that extra challege at the end of the [Timestamp Construction README](https://github.com/rehrenreich/gcloud-learning/tree/main/quirks/timestamp_construction).

Copyright © 2023 Ryan Ehrenreich