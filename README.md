# S3 Async Wrapper & CLI

This module is an asynchronous wrapper for the [NodeJS AWS SDK](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-examples.html). It allows for the use of promises with some common (s3 related) synchronous functions provided by the AWS SDK. 

All functions provided can be used as a node module or through the custom command line interface. 

## Authentication
To use this you will need a file named `credentials` in `~/.aws/`.

This file should contain something like the following:
```
[default]
aws_access_key_id = <your_key_id>
aws_secret_access_key = <your_key>
region = us-west-2
```

## CLI Usage
```
node ns3 download BUCKET TARGET DESTINATION
node ns3 upload BUCKET TARGET
node ns3 listBuckets
node ns3 create BUCKET
node ns3 listItems BUCKET PREFIX(optional)
```

## Create Bucket
Creates a new bucket with the given name on S3. 

**Note: The name must be universally unique. The namespace is shared with ALL S3 users.**
### CLI
`node ns3 create BUCKET`
### Module
`create(bucket)`
### Params
* bucket - The name of the bucket to create.

## List Buckets
Return a list of all buckets associated with the given account and region. 
### CLI
`node ns3 listBuckets`
### Module
`list()`
### Params
* none

## Upload Item from File
Upload a file to the given bucket.
### CLI
`node ns3 upload BUCKET TARGET`
### Module
`uploadFile(bucket, target)`
### Params
* bucket -  The name of the bucket to upload to.
* target - The local path of the file to upload

## Upload Item from Buffer
Upload a "file" from a buffer.
### CLI
`NA`
### Module
`uploadData(bucket, data, fileName)`
### Params
* bucket -  The name of the bucket to upload to.
* buffer - The data to upload.
* fileName - The name the file should have on S3.

## List Items
Return a list of all items (objects) in the given bucket. 
### CLI
`node ns3 listItems BUCKET PREFIX(optional)`
### Module
`listItems(bucket, prefix)`
### Params
* bucket - The name of the bucket to list from.
* prefix - The path prefix to apply when looking for items (optional).

## Download Item
Downloads an item (object) to local storage.
### CLI
`node ns3 download BUCKET TARGET DESTINATION`
### Module
`download(bucket, target, destination)`
### Params
* bucket - The name of the bucket to download from.
* target - The name of the file (item/object) to download.
* destination - The local destination of the downloaded item.

