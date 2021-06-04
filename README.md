# S3 Async Wrapper & CLI

This module is an asynchronous wrapper for the [NodeJS AWS SDK](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-examples.html). It allows for the use of promises with some common (s3 related) synchronous functions provided by the AWS SDK. 

All functions provided can be used as a node module or through the custom command line interface. 

## CLI Usage
```
node s3ncli download BUCKET TARGET DESTINATION
node s3ncli upload BUCKET TARGET
node s3ncli listBuckets
node s3ncli create BUCKET
node s3ncli listItems BUCKET PREFIX(optional)
```

## Create Bucket
Creates a new bucket with the given name on S3. 

**Note: The name must be universally unique. The namespace is shared with ALL S3 users.**
### CLI
`node s3ncli create BUCKET`
### Params
* bucket - The name of the bucket to create.

## List Buckets
Return a list of all buckets associated with the given account and region. 
### CLI
`node s3ncli listBuckets`
### Params
* none

## Upload Item
Upload a file to the given bucket.
### CLI
`node s3ncli upload BUCKET TARGET`
### Params
* bucket -  The name of the bucket to upload to.
* target - The local path of the file to upload

## List Items
Return a list of all items (objects) in the given bucket. 
### CLI
`node s3ncli listItems BUCKET PREFIX(optional)`
### Params
* bucket - The name of the bucket to list from.
* prefix - The path prefix to apply when looking for items (optional).

## Download Item
Downloads an item (object) to local storage.
### CLI
`node s3ncli download BUCKET TARGET DESTINATION`
### Params
* bucket - The name of the bucket to download from.
* target - The name of the file (item/object) to download.
* destination - The local destination of the downloaded item.

