# [GCloud Learning - Quirks: Timestamp Construction](https://github.com/rehrenreich/gcloud-learning/tree/main/quirks/timestamp_construction)

NOTE: In the process of deploying the following example, you will familiarize yourself with the Web UIs for [Firebase](https://console.firebase.google.com/u/0/), [Cloud Functions](https://console.cloud.google.com/functions/), [Cloud Run](https://console.cloud.google.com/run/), [Firestore](https://console.cloud.google.com/firestore/), and [Logs Explorer](https://console.cloud.google.com/logs/).

The example I provide here covers a specific case of a wider issue that developers should be aware of, in case they encounter an error message such as:

```
    "Error: Value for argument \"data\" is not a valid Firestore document. Detected an object of type \"Timestamp\" that doesn't match the expected instance (found in field \"fieldName\"). Please ensure that the Firestore types you are using are from the same NPM package.
```

In Firebase, there are multiple packages that you may need to import into your codebase that export the same underlying components. For example, "firebase-admin" and "@google-cloud/firestore" both export "Timestamp" via "admin.firestore.Timestamp" and "firestore.Timestamp", respectively. Similarly, both export FieldValue types such as "arrayUnion" and "arrayRemove", as well. All such components may be susceptible to the following problem.

In situations where components are exported multiple times, it is possible that you may be using different versions of the same components at the same time in different parts of your code. If this happens, your code may compile and deploy correctly, but will generate an error at runtime. And unless you are aware of the issue, encountering this error may be confusing and time consuming. So it is better to be forewarned that this issue exists ahead of time, so that you can easily identify and resolve this issue if you encounter it.

To demonstrate this issue, I have created a small codebase that can be used to easily reproduce this issue. It is comprised of a simple data model that the Firebase HTTP Functions use to record messages sent to the server in a data structure that contains fields for "id", "message", and "dateOfCreation". I provide two flavors of this data structure, one that uses JavaScript Dates and one that uses Firestore Timestamps. Also, for each flavor, I provide two ways of constructing the "now" date-time values, one where the "now" value is generated in a Firebase HTTP Function in the "functions" package, and one where the "now" value is generated in a factory function in the "data_model" package using a "Now Provider" object from the [Open Personal Archive™ base library](https://github.com/vkehren/open-personal-archive/tree/main/code/base) (which I include for that purpose, as well as to help with extensions to the example that I will post here later).

So this example deploys four (4) total Firebase HTTP Functions:
  1) Function where... Date stores date-time, "now" constructed in "data_model" using "firestore"
  2) Function where... Date stores date-time, "now" constructed in "functions" using "admin"
  3) Function where... Timestamp stores date-time, "now" constructed in "data_model" using "firestore"
  4) Function where... Timestamp stores date-time, "now" constructed in "functions" using "admin"

After explaining how to deploy these HTTP Functions, I will ask that you run these functions as constructed, observe the result, then make a small change, redploy these functions, and observe the difference in the resulting output.

But before you can run these functions, we must make sure that you are properly setup to do so...

## Step 1) Download Project Locally

You will need to download the contents of the current folder to a folder on your computer. For ease of access, you may just want to grab the [zip file containing the entire GCloud Learning GitHub repository](see https://github.com/rehrenreich/gcloud-learning/archive/refs/heads/main.zip) or clone the GCloud Learning GitHub repository locally.

After you have the contents of this folder locally available on your computer, you will need to:
  1) Navigate to the "base" folder in a command prompt and run "npm install",
  2) Navigate to the "data_model" folder in a command prompt and run "npm install",
  3) Navigate to the "functions" folder in a command prompt and run "npm install", and
  4) Run "npm run build" in the "functions" folder to verify that this codebase builds properly.

## Step 2) Create a Firebase Project to Host the HTTP Functions

I advise you to create an entirely new Firebase project by navigating to https://console.firebase.google.com/u/0/ and creating a new project specifically for deploying and hosting this example.

Once you have created your project, I recommend clicking the "Modify" button next to your current plan (probably "Spark") in the left navigation bar. I then recommend upgrading to the "Blaze" plan by selecting or creating a billing account, as this will be necessary to deploy Firebase Functions.

Next, I recommend clicking the "Firestore Database" link under the "Build" navigation group in the left navigation bar. Once you have done so, I recommend using the wizard to create your Firestore database. When prompted to choose a region for your Firestore database, I recommend choosing a region that supports 2nd Gen Firebase Functions within the Tier 1 pricing tier (see https://firebase.google.com/docs/functions/locations).

By choosing the region upfront, it is easier to ensure that your Firestore database and Firebase HTTP Functions are hosted in the same region, so as to minimize latency when reading from the database.

After you have created your Firestore database, I recommend navigating to [Google Cloud Console for Firestore](https://console.cloud.google.com/firestore/) and familiarizing yourself with the extended tools offered there.

## Step 3) Deploy and Configure the Firebase HTTP Functions

First, make sure you have installed Firebase Tools using the global option (i.e. "npm install -g firebase-tools"). Once you have done so, run "firebase login" to allow Firebase Tools to update your project. Also, if you already had Firebase Tools installed, you will probably need to run "firebase use [YOUR_PROJECT_NAME]" to set the correct current project.

Next, from the root directory for this project (i.e. "timestamp_construction"), run "firebase deploy --only functions" and verify that all four functions have deployed properly (the script will clearly state whether it has encountered errors). If there are any errors during deployment, in the process of running this command, Firebase Tools will save a debug log locally in the directory from which the deploy command was run.

If there are any errors in deployment, I recommend reviewing the [Google Cloud Console for Logs Explorer](https://console.cloud.google.com/logs/) and checking if the automatic logging functionality has recorded any useful information.

Also, if there were errors, I recommend deleting the errant Firebase Functions via the [Google Cloud Console for Cloud Functions](https://console.cloud.google.com/functions/) before attempting to redeploy them.

Once you have resolved any issues and deployed the four Firebase HTTP Functions properly, you will need to go to the [Google Cloud Console for Cloud Functions](https://console.cloud.google.com/functions/) and the [Google Cloud Console for Cloud Run](https://console.cloud.google.com/run/) and grant "allUsers" the "invoker" permission so that these functions can be invoked from a browser tab.

## Step 4) Run the Firebase HTTP Functions

From the [Google Cloud Console for Cloud Functions](https://console.cloud.google.com/functions/), you can click on a specific function in the list to access the screen that gives you the link to invoke that function. Use these links to invoke all four Firebase HTTP Functions.

What do you see?

You should see that each function runs successfully and returns to you the JSON object that was stored in the Firestore database.

Also, if you open the [Google Cloud Console for Firestore](https://console.cloud.google.com/firestore/), you should see that JSON objects were added to the "Messages" collection in the Firestore database.

## Step 5) Create and Observe the Error

To create "The Error", add the following line at the start of the "dependencies" section of the "package.json" file in the "functions" folder:
"@google-cloud/firestore": "^7.0.0",

Once you have done so and saved the file, you must run "npm install" to download that dependency. Alternately, it should work in one step to run "npm install @google-cloud/firestore@7.0.0", but I prefer to install the dependency the former way.

Next, you must redeploy the Firebase HTTP Functions from the root directory for this project by running "firebase deploy --only functions". But before doing so, I recommend deleting the "lib" folder in the "functions" folder, as it will already contain your prior build output. Deleting the "lib" folder should not be necessary, but I prefer to delete it anyway.

After the Firebase HTTP Functions redeploy successfully, you must next re-invoke each of the four functions and observe the result.

One of the functions should fail with a very non-specific error message (such as "Internal Server Error"), and the other three should run successfully.

After you observe one of the functions fail, visit the [Google Cloud Console for Logs Explorer](https://console.cloud.google.com/logs/) and observe what useful information the log has for you to review. Spoiler alert, you should see a clear error message stating "The Error" that I mentioned at the start of this file.

At this point, you should realize that the Google Cloud Console for Logs Explorer is the best friend a Google Cloud developer will ever have. Without even doing anything on your side, this tool gives you tons of useful usage and debugging information. What a great friend!

## Step 5) Reflect and Design

As a final step, I recommend spending on the order of 15 to 30 minutes thinking about why this problem happened and what you can do in a real codebase to prevent it from happening to you.

Specifically, challenge yourself to think of 3 to 5 ways of either preventing this issue from happening or solving it when it does happen.

As for my perspective, if you read the root [README](https://github.com/rehrenreich/gcloud-learning), you know that I value "tiers" and "layers". To me, they are critical to building software that ACTUALLY WORKS (which is the GOAL)!

So you can see some of my thoughts on this matter in the code at [Open Personal Archive™](https://github.com/vkehren/open-personal-archive) if you wish.


Copyright © 2023 Ryan Ehrenreich