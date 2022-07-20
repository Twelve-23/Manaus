const s3 = require('s3-async');
const fs = require('fs');
const parameters = require('./parameters');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
module.exports = {
  listBuckets,
  listItems,
  createBucket,
  download,
  downloadBucket,
  upload,
  uploadBucket
};

async function listBuckets(params){
  return await s3.listBuckets();
}
async function listItems(params){
  if(!parameters.validate(params, ['bucket'])){
    return 'Failed!';
  }
  if(params.prefix){
    return await s3.listItems(params.bucket, params.prefix);
  }
  return await s3.listItems(params.bucket);
}

async function createBucket(params){
  if(!parameters.validate(params, ['bucket'])){
    return 'Failed!';
  }
  console.log('Creating a new bucket: '+params.bucket);
  return await s3.create(params.bucket)
}

async function download(params){
  if(!parameters.validate(params, ['bucket','key'])){
    return 'Failed!';
  }
  if(params.key === '_latest_'){
    const items = await listItems({bucket:params.bucket});
    const itemsSorted = items.sort((a, b) => new Date(b['LastModified']) - new Date(a['LastModified']))
   params.key = itemsSorted[0]['Key'];
  }
  return await s3.download(params.bucket, params.key, params.destination ? params.destination : './'+params.key);
}

//Download all items from the bucket to a local directory
async function downloadBucket(params){
  if(!parameters.validate(params, ['target','destination'])){
    return 'Failed!';
  }
  const items = await listItems({bucket:params.target});
  
  //Create directory in local if not there
  const dir = './'+params.destination;
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }
  //For each file from listed items of bucket
  for (const fileName of items) {
    //Validate whether file to be downloaded upon modified time params
    const valdiationRes = await valdiateFileToDownload(dir + '/' + fileName.Key, fileName.LastModified);
    if(valdiationRes){
      //Download the file
      const resp = await s3.download(params.target, fileName.Key, dir + '/' + fileName.Key);
    }
  }
  return "Download Completed";
}

async function upload(params){
  if(!parameters.validate(params, ['bucket','target'])){
    return 'Failed!';
  }
  return await s3.uploadFile(params.bucket, params.target);
}

//Upload all files from a local directory to S3 bucket
async function uploadBucket(params){
  if(!parameters.validate(params, ['bucket','target'])){
    return 'Failed!';
  }
  const items = await listItems({bucket:params.bucket});
  //Converting to array for easy fetching
  const itemArray = [];
  for (const fileName of items) {
    itemArray[fileName.Key] = fileName;
  }

  //Check if the path exists
  if (fs.existsSync(params.target)) {
    //Reading the directory file by file
    fs.readdir(params.target, async (err, files) => {
      for (let file of files) {
        let valdiationRes = false;
        //Check if the file is there on S3
        if(Object.keys(itemArray).includes(file)){
          //Validate to upload depending upon update time and ETags
          valdiationRes = await valdiateFileToUpload(params.target + '/' + file, itemArray[file].LastModified, itemArray[file].ETag);
        } else {
          //File is not on S3, so upload it
          valdiationRes = true;
        }
        //Check for validation result
        if(valdiationRes){
          const resp = await s3.uploadFile(params.bucket, params.target + '/' + file);
        }  
      }
    });
  }
  return "Upload completed";
}

/*
validate file in the path.
Check whether to download file or not
*/
async function valdiateFileToDownload(localFilePath, serverModifiedTime) {
  //Converting server time to UTC
  const serverModifiedTimeDayJs = dayjs(serverModifiedTime).utc().format();
  //Check if the file exists
  if (fs.existsSync(localFilePath)) {
    const localFile = fs.statSync(localFilePath);
    //Fetching the last modified time
    const lastModifiedTime = localFile.mtime;
    //Converting last modified time of file in local to UTC
    const lastModifiedTimeDayJs = dayjs(lastModifiedTime).utc().format();
    if(serverModifiedTimeDayJs > lastModifiedTimeDayJs){
      // server has the latest file, so download it
      return true;
    } else {
      return false;
    }
  } else {
    //File is not there in local, so can be downloaded
    return true;
  }
}

/*
validate file in the path.
Check whether to upload file or not
*/
async function valdiateFileToUpload(localFilePath, serverModifiedTime, ETag) {
  //Converting server time to UTC
  const serverModifiedTimeDayJs = dayjs(serverModifiedTime).utc().format();
  const localFile = fs.statSync(localFilePath);
  const lastModifiedTime = localFile.mtime;
  //Converting last modified time of file in local to UTC
  const lastModifiedTimeDayJs = dayjs(lastModifiedTime).utc().format();
  if(serverModifiedTimeDayJs > lastModifiedTimeDayJs){
    // server has the latest file, so no need to upload
    return false;
  } else {
    //Compare Etags
    const match = s3.compareETags(localFilePath, ETag);
    //Upload only if match is false
    if(!match){
      return true;
    } else {
      return false;
    }
  }
}