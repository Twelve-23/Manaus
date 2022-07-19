const s3 = require('s3-async');
const fs = require('fs');
const parameters = require('./parameters');
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

async function downloadBucket(params){
  if(!parameters.validate(params, ['target','destination'])){
    return 'Failed!';
  }
  const items = await listItems({bucket:params.target});
  
  const dir = './'+params.destination;
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }
  for (const fileName of items) {
    const valdiationRes = await valdiateFileToDownload(dir + '/' + fileName.Key, fileName.LastModified);
    if(valdiationRes){
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

async function uploadBucket(params){
  if(!parameters.validate(params, ['bucket','target'])){
    return 'Failed!';
  }
  const items = await listItems({bucket:params.bucket});
  const itemArray = [];
  for (const fileName of items) {
    itemArray[fileName.Key] = fileName;
  }
  console.log('🚀 ~ file: cmd.js ~ line 80 ~ uploadBucket ~ itemArray', itemArray);


  if (fs.existsSync(params.target)) {
    fs.readdir(params.target, async (err, files) => {
      for (let file of files) {
        file = "'" + file + "'";
        console.log('🚀 ~ file: cmd.js ~ line 88 ~ fs.readdir ~ file', file);
        let valdiationRes = false;
        if(itemArray.includes(file)){
          valdiationRes = await valdiateFileToUpload(params.target + '/' + file, itemArray[file].LastModified);
        } else {
          sgfsdf;
          valdiationRes = true;
        }
        console.log('🚀 ~ file: cmd.js ~ line 92 ~ fs.readdirSync ~ valdiationRes', valdiationRes);
        if(valdiationRes){
          const resp = await s3.uploadFile(params.bucket, params.target + '/' + file);
          console.log('🚀 ~ file: cmd.js ~ line 95 ~ fs.readdirSync ~ resp', resp);
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
  if (fs.existsSync(localFilePath)) {
    const localFile = fs.statSync(localFilePath);
    const lastModifiedTime = localFile.mtime;
    if(serverModifiedTime > lastModifiedTime){
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
}

/*
validate file in the path.
Check whether to upload file or not
*/
async function valdiateFileToUpload(localFilePath, serverModifiedTime) {
  console.log('🚀 ~ file: cmd.js ~ line 132 ~ valdiateFileToUpload ~ serverModifiedTime', serverModifiedTime);
  const localFile = fs.statSync(localFilePath);
  const lastModifiedTime = localFile.mtime;
  console.log('🚀 ~ file: cmd.js ~ line 135 ~ valdiateFileToUpload ~ lastModifiedTime', lastModifiedTime);
  if(serverModifiedTime > lastModifiedTime){
    return false;
  } else {
    return true;
  }
}