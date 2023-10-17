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

Copyright © 2023 Ryan Ehrenreich