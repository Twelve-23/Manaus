# Manaus

A command line utility written in NodeJS to simplify the process of working with data on Amazon S3 Buckets.

Uses [S3-Async](https://github.com/matdombrock/S3_Async)

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
mana download BUCKET TARGET DESTINATION
mana upload BUCKET TARGET
mana listBuckets
mana create BUCKET
mana listItems BUCKET PREFIX(optional)
mana help
```

## Optional Flags

### Output to file
You can save your non-trunicated output to `output.txt` with the `-o` flag. It can be used like this:
`node ns3 -o listItems bucketname`

## Create Bucket
Creates a new bucket with the given name on S3. 

**Note: The name must be universally unique. The namespace is shared with ALL S3 users.**
### CLI
`node ns3 create BUCKET`
### Params
* bucket - The name of the bucket to create.

## List Buckets
Return a list of all buckets associated with the given account and region. 
### CLI
`node ns3 listBuckets`
### Params
* none

## Upload Item from File
Upload a file to the given bucket.
### CLI
`node ns3 upload BUCKET TARGET`
### Params
* bucket -  The name of the bucket to upload to.
* target - The local path of the file to upload

## Upload Item from Buffer
Upload a "file" from a buffer.
### CLI
`NA`
### Params
* bucket -  The name of the bucket to upload to.
* buffer - The data to upload.
* fileName - The name the file should have on S3.

## List Items
Return a list of all items (objects) in the given bucket. 
### CLI
`node ns3 listItems BUCKET PREFIX(optional)`
### Params
* bucket - The name of the bucket to list from.
* prefix - The path prefix to apply when looking for items (optional).

## Download Item
Downloads an item (object) to local storage.
### CLI
`node ns3 download BUCKET TARGET DESTINATION`
### Params
* bucket - The name of the bucket to download from.
* target - The name of the file (item/object) to download.
* destination - The local destination of the downloaded item.

---

---
## /mɑːˈnaʊs/

> Manaus (/mɑːˈnaʊs/; Portuguese: [mɐˈnaws, mɐˈnawʃ, maˈnaws]) is the capital and largest city of the Brazilian state of Amazonas. It is the seventh-largest city in Brazil, with an estimated 2020 population of 2,219,580 distributed over a land area of about 11,401 km2 (4,402 sq mi). Located at the east center of the state, the city is the center of the Manaus metropolitan area and the largest metropolitan area in the North Region of Brazil by urban landmass. It is situated near the confluence of the Negro and Solimões rivers.