# [GCloud Learning - Exercises: Timestamp Construction Extensions](https://github.com/rehrenreich/gcloud-learning/tree/main/exercises/timestamp_construction_extensions)

Before beginning the exercises that follow, you should first complete the steps listed in the README in the [Timestamp Construction Quirk directory](https://github.com/rehrenreich/gcloud-learning/tree/main/quirks/timestamp_construction).

After you have done so, DELETE the line in the "package.json" file for the "functions" package that you previously added to cause "The Error" that this codebase is intended to highlight.

Now you are ready to begin the following extensions based on the codebase for that quirk.

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

Copyright © 2023 Ryan Ehrenreich