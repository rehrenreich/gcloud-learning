# [GCloud Learning](https://github.com/rehrenreich/gcloud-learning)

This repository contains lessons, tips, tricks, and quirks I would like to share based on my past experience using Firebase and other Google Cloud products.

Much of this learning has come through my development efforts for the [Open Personal Archive™](https://github.com/vkehren/open-personal-archive) project, of which I am the main contributor. Please note, the organization and structure of the Open Personal Archive™ codebase demonstrates my general approach to building applications using enterprise application architecture (aka tiered architecture), but specifically applied to the products and technologies offered through the Google Cloud.

Interesting question... What is the difference between a "layer" and a "tier" in software architecture?

Thanks to the guidance and advice of many past mentors, I offer you this answer:
1) A "tier" is a grouping of one or more "layers (i.e. a "tier" can contain multiple "layers", but not vice-versa).
2) A "layer" denotes a "package" or "assembly" boundary, while a "tier" denotes a "process" boundary (and often, but not necessarily, a "machine" boundary).
3) Across "tiers", there may be a duplex channel of communication, but within a tier, the imports of code across layers should be strictly hierarchical (i.e. there should NOT be any cyclic dependencies between layers, and organizing your code into separate packages helps to enforce this).

In a Microsoft .NET enterprise application, your "Data Tier" might be a SQL Server database, your "Application Tier" might be a WCF application, and your "Presentation Tier" might be a WPF application. Inside your WCF application, you might have different layers, such as Data Access, Business Logic, and Services.

In [Open Personal Archive™](https://github.com/vkehren/open-personal-archive), the "Data Tier" is a Firestore database, the "Application Tier" is a set of Cloud Functions, and the "Presentation Tier" is a website. Inside the "Application Tier", the code is organized into packages by layer, with the layers being "base" (which is intended to be useable "off-the-shelf" for any other project you develop), "data model", "domain logic", and "functions".

Personally, I really like the Google Cloud suite of products and I am very happy to share my own perspectives on using them, so I hope you enjoy reviewing the code that I put in this repository.

Thank you and good luck!

**_Ryan Ehrenreich_**

Copyright © 2023 Ryan Ehrenreich