const s3 = require('s3-async');
const parameters = require('./parameters');
module.exports = {
  listBuckets,
  listItems,
  createBucket,
  download,
  upload,
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

async function upload(params){
  if(!parameters.validate(params, ['bucket','target'])){
    return 'Failed!';
  }
  return await s3.uploadFile(params.bucket, params.target);
}