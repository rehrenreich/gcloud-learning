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

## Extension 2) Create a new HTTP Function that returns all existing Messages

Now it is time to implement a new HTTP Function to read all the existing Messages, so that we no longer need to use the Firestore WebUI to see what data exists in our Firestore database. Please implement this HTTP Function and name it "readMessages".

But before you do so, please note that I request that you structure the return value as an object that contains two properties: 1) the "messages" property that is set to an array containing all extisting Messages and 2) the "dateOfQuery" property that is set to the date-time when the reading of data actually took place.

The reason for including the "dateOfQuery" property is so that if you refresh this HTTP Function but no Messages have been added since your last query, there is still a value (i.e. "dateOfQuery") that changes in the result.

If you are confused, if your code did not work as described, or if you just want to see my solution, you can see my code for this extension [here](https://github.com/rehrenreich/gcloud-learning/tree/main/exercises/timestamp_construction_extensions_02/extension_02).

## Extension 3) Use an Open Personal Archive™ CollectionDescriptor to get typed Message Documents

Before you start this exercise, I am assuming you are using an Integrated Development Environment (IDE) that supports Intelligent Code Completion (see https://en.wikipedia.org/wiki/Intelligent_code_completion), such as IntelliSense in Visual Studio Code.

In your "readMessages" HTTP function, just before you return your messages that you read, access the element in the messages array at index 0, and then type "." after it. I expect you see nothing, but what you want to see is the list of properties for MessageWithDate and/or MessageWithTimestamp.

To make this actually happen, we will use one of the primary features provided by the Open Personal Archive™ (OPA) "base" package, namely the CollectionDescriptor. The CollectionDescriptor is a class that I wrote using generics (see https://www.typescriptlang.org/docs/handbook/2/generics.html) to automate most of the boilerplate code that one might write for accessing data in a Firestore Collection, as this code is very repetitive and actually repeating it over and over again makes your codebase less maintainable.

In order for you to use the OPA CollectionDescriptor, I am going to tell you precisely the code that you need to add use it. At the top of your file, on the line just before you declare your "CollectionReference" and "DocumentReference" type aliases, please add the following code:

```
type MessageDocument = DataModel.IMessageWithDate | DataModel.IMessageWithTimestamp;
type MessageQuerySet = OPA.QuerySet<MessageDocument>;
type MessageConstructor = OPA.DefaultFunc<MessageDocument>;
const messagesColDesc = new OPA.CollectionDescriptor<MessageDocument, MessageQuerySet, MessageConstructor>("Message", "Messages", false, (cd) => new OPA.QuerySet<MessageDocument>(cd));
```

What does this code mean?

On the first line, we declare a type alias named "MessageDocument" that can be either an IMessageWithDate or an IMessageWithTimestamp. On the second line, we declare a type alias for our OPA QuerySet for documents of type "MessageDocument" (I will explain the QuerySet in the next extension, so please be patient). On the third line, I use a type alias to circumvent a contruction requirement of the CollectionDescriptor, so just ignore this for now. On the fourth line, I instantiate a new CollectionDescriptor corresponding to our "Messages" Collection in our Firestore database.

Now, update your existing "CollectionReference" and "DocumentReference" type aliases to the following code:

```
type CollectionReference = admin.firestore.CollectionReference<MessageDocument>;
type DocumentReference = admin.firestore.DocumentReference<MessageDocument>;
```

What does this code mean?

The only change made here is replaceing "admin.firestore.DocumentData" with "MessageDocument" for the generic type parameter (i.e. the text between the "&lt;" and "&gt;" characters). So before, we were using the standard Firestore "DocumentData" to fill the generic type parameter, but now we are using our type alias "MessageDocument" (which is really just shorthand for using "DataModel.IMessageWithDate | DataModel.IMessageWithTimestamp").

In a second, you will see why this is important... But first, I need you to update the line of code in each HTTP Function where you declare your "colRef" constant to replace

```
const colRef: CollectionReference = db.collection("Messages");
```

with

```
const ds = (({db} as unknown) as OPA.IDataStorageState);
const colRefTyped: CollectionReference = messagesColDesc.getTypedCollection(ds);
```

What does this code mean?

Well, the first line is a shortcut to circumvent a longer block of code I would actually use so that we can simplify the code for this specific example. The second line uses the "Messages" CollectionDescriptor to get a strongly typed CollectionReference, which is very important. If you are interested you can look at the OPA "base" package code to see how I do this, but that is not mandatory.

Why is getting a strongly typed CollectionReference very important?

Let's revisit that first step I asked you to do. In your "readMessages" HTTP function, just before you return your messages that you read, access the element in the messages array at index 0, and then type "." after it. Now you should see what you wanted to see, the list of properties for MessageWithDate and/or MessageWithTimestamp.

This alone is very important, but let's see what else we can get out of the CollectionDescriptor in the next extension.

If you are confused, if your code did not work as described, or if you just want to see my solution, you can see my code for this extension [here](https://github.com/rehrenreich/gcloud-learning/tree/main/exercises/timestamp_construction_extensions_02/extension_03).

## Extension 4) Use an Open Personal Archive™ CollectionDescriptor and QuerySet to automate query code

If you look at how to construct queries to a Firestore database, the Firestore client library that we are programming for basically implements the "Query Object" design pattern (see https://martinfowler.com/eaaCatalog/queryObject.html). You dynamically apply query operators to fields, providing the values relevant to your query when necessary.

As a result, often the query code that you use to read data from one Collection is substantially similar or identical to the query code that you use to read data from another Collection. This is exactly the type of situation where generics are useful for automating repetitive code.

We could create a bunch of helper functions to automate common query code. Then we could implement the "Repository" design pattern (see https://martinfowler.com/eaaCatalog/repository.html) on top of each Firestore Collection (i.e. one Repository class per Collection) to abstract away the implementation details that are specific to the Firestore database. Then our query code would be encapsulated (or hidden) behind the "Repository" in the view of downward-calling code (aka client code, for example, a function trying to do something useful, such as read and return Messages).

But I prefer an even better approach... The CollectionDescriptor plus the QuerySet together are the generic implementation of the "Repository" design pattern... I implement them once, and re-use them over and over again by writing code similar to the few lines of code that I instructed you to add in the last extension.

To be clear, I put ALL of my Firestore query code within clearly named functions within the QuerySet base class, or withing Document-specific sub-classes of QuerySet when necessary (_there is only one place in the whole OPA codebase where this rule is broken, and addressing that is one of the future tasks that I plan to delegate to you_).

Why do this?

Well, for the downward-calling code (aka client code) that accesses information stored within our system, we want that code to use the "Repository" pattern so that code is unaware of the implementation details of which type of database we are actually using. Could be Firestore, could be MongoDB, could be SQL Server. With few exceptions, the client code does not need to know (_and with some effort, those few exceptions can be abstracted away, it is just not worth doing so until the need actually arises_).

Behind the "Repository" design pattern is the "Storage Strategy" design pattern, which does the database-vendor-specific work necessary to actually access information. Currently, I do not implement the "Storage Strategy" design pattern explicitly because I really want to use Firestore as the database and have no requirement to support another type of database.

But if for some reason a requirement arose to support another database vendor, I would 1) define an IOpaStorageStrategy&lt;DocType&gt;, 2) move the existing Firestore data access code into an OpaFirestoreStorageStrategy&lt;DocType&gt; class, 3) implement a OpaOtherVendorStorageStrategy&lt;DocType&gt; for the other database vendor, and 4) configure the CollectionDescriptor and QuerySet to use an instance of IOpaStorageStrategy&lt;DocType&gt; to perform data access.

I do not expect you to understand fully what this all means now... I just want you to be aware that I implemented this code this way for very specific reasons.

All I want you to understand right now is that because I already implemented a generic CollectionDescriptor and QuerySet, you can now replace your code to query to the "Messages" Collection in your "readMessages" function with the following line of code:

```
const messageDocs = await messagesColDesc.queries.getAll(ds);
```

I personally see this better design, faster to implement, easier to maintain, less likely to cause bugs, easier to test... All around better than writing the same general Firestore query code over and over again throughout the codebase.

If you are confused, if your code did not work as described, or if you just want to see my solution, you can see my code for this extension [here](https://github.com/rehrenreich/gcloud-learning/tree/main/exercises/timestamp_construction_extensions_02/extension_04).

## Extension 5) Replace IMessageWithDate and IMessageWithTimestamp with generic IMessage<T>

Now that we know a little about generics, we are going to use generics to replace our two "MessageWith..." files and their contents with a single "Message" file that contains generic interfaces and functions that maintain THE EXACT SAME SET OF FUNCTIONALITY as our two files currently provide.

So go try to do this and come back here if you have any problems...

And now you are back here, great!

In truth, I do not expect you to be able to do this extension. If you can, you are ahead of the curve, but if not, do not worry!

Instead, I wanted you to TRY to do this extension so that you realize some of the complications that arise when using generics, especially in a non-reified type system (a type system that is not accessible at run-time, only at compile-time, because TypeScript is transpiled into JavaScript and actually excuted as JavaScript).

If we were programming in C# in .NET (Microsoft technology), we would have all our declared types accessible via Reflection at run-time and could just check what type something is as the code actually executes. But since we are programming in TypeScript (actually, also Microsoft technology), we must resort to "tricks" to access type-ish information at run-time.

_(As an aside, many developers look down on or distrust Microsoft... But I take a different perspective... I don't really trust ANY company, so to me Microsoft is no more or less trustworthy than any other... But I am incredibly appreciative of Microsoft technology, just as I am incredibly appreciative of Google technology.)_

So if you tried, but were not quite able to implement this extension, please look at my solution, try to understand it, and try to write something like it yourself. But do not just copy it, try to actually understand it.

And once you are ready, deploy it!

Then call your four original HTTP Functions WITHOUT passing a value for the "id" parameter, as we want them to construct new objects.

If you are confused, if your code did not work as described, or if you just want to see my solution, you can see my code for this extension [here](https://github.com/rehrenreich/gcloud-learning/tree/main/exercises/timestamp_construction_extensions_02/extension_05).

Copyright © 2023 Ryan Ehrenreich