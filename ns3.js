/*
Command line interface for the async AWS wrapper

Mathieu Dombrock 2021

Usage:

node ns3 download BUCKET TARGET DESTINATION
node ns3 upload BUCKET TARGET
node ns3 listBuckets
node ns3 create BUCKET
node ns3 listItems BUCKET PREFIX(optional)

*/
const fs = require('fs');

const {download} = require('s3-async');
const {uploadFile} = require('s3-async');
const {listBuckets} = require('s3-async');
const {create} = require('s3-async');
const {listItems} = require('s3-async');

const helpText = `
node ns3 download BUCKET TARGET DESTINATION
node ns3 upload BUCKET TARGET
node ns3 listBuckets
node ns3 create BUCKET
node ns3 listItems BUCKET PREFIX(optional)
`;

async function run(){
  const flag = process.argv[2];
  let argOff = 0;// arg offset
  let outputFile = false;
  if(flag){
    if(flag === '-o'){
      outputFile = true;
      argOff = 1;
    }
  }
  const args = [
    process.argv[0],
    process.argv[1],
    process.argv[2+argOff],
    process.argv[3+argOff],
    process.argv[4+argOff],
    process.argv[5+argOff],
  ];
  const cmd = args[2];
  let res = "";
  switch(cmd){
    // use of {} pm swotcj provides block level var scope
    case 'download':{
      if(!isValid(5+argOff)){
        break;
      }
      console.log('Downloading file');
      const bucket = args[3];
      const key = args[4];
      const destination = args[5];
      res = await download(bucket, key, destination);
      break;
    }
    case 'upload':{
      if(!isValid(4+argOff)){
        break;
      }
      console.log('Uploading file');
      const bucket = args[3];
      const target = args[4];
      res = await uploadFile(bucket, target);
      break;
    }
    case 'listItems':{
      if(!isValid(3+argOff)){// arg 4 is optional
        break;
      }
      const bucket = args[3];
      const prefix = args[4];
      res = await listItems(bucket, prefix);
      break;
    }
    case 'listBuckets':{
      res = await listBuckets();
      break;
    }
    case 'create':{
      if(!isValid(3+argOff)){
        break;
      }
      console.log('Creating Bucket');
      const bucket = args[3];
      res = await create();
      break;
    }
    case 'help':{
      console.log(helpText);
      break;
    }
    default:{
      console.log('Undefined Command: '+args[2]);
      console.log(helpText);
    }
  }
  console.log(res);
  if(outputFile){
    fs.writeFileSync(__dirname+'/output.txt', JSON.stringify(res,null,2));
    console.log('Saved output to output.txt');
  }
}
run();

function isValid(expected){
  for(let i = 2; i<=expected;i++){
    if(process.argv[i] === undefined || process.argv[i]===''){
      console.log('Missing arg '+i);
      return false;
    }
  }
  return true;
}