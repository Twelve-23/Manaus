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

const config  = require('./config.json');

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
let argOffset = 0;// arg offset
async function run(){
  argOffset = 0;
  // Config
  const sBucket = config ? config.static_bucket : null;
  let outputToFile = config ? config.output_to_file : false;
  const outputFile = config ? config.output_file : 'output-generic.txt';
  // Flags
  const flag = args(2);
  if(flag){
    if(flag === '-o'){
      outputToFile = true;
      argOffset = 1;
    }
  }
  
  const cmd = args(2);
  const bucket = sBucket ? sBucket : args(3);
  let res = "";
  switch(cmd){
    // use of {} pm swotcj provides block level var scope
    case 'download':{
      checkSBucket()
      if(!isValid(5)){
        break;
      }
      console.log('Downloading file');
      const key = args(4);
      const destination = args(5);
      res = await download(bucket, key, destination);
      break;
    }
    case 'upload':{
      checkSBucket()
      if(!isValid(4)){
        break;
      }
      console.log('Uploading file');
      const target = args(4);
      res = await uploadFile(bucket, target);
      break;
    }
    case 'listItems':{
      checkSBucket()
      if(!isValid(3)){// arg 4 is optional
        break;
      }
      const prefix = args(4);
      res = await listItems(bucket, prefix);
      break;
    }
    case 'listBuckets':{
      res = await listBuckets();
      break;
    }
    case 'create':{
      if(!isValid(3)){
        break;
      }
      console.log('Creating Bucket');
      const newBucket = args(3);
      res = await create(newBucket);
      break;
    }
    case 'help':{
      res = helpText;
      break;
    }
    default:{
      res = 'Undefined Command: '+args(2);
      res += helpText;
    }
  }
  console.log(res);
  if(outputToFile){
    fs.writeFileSync(__dirname+'/'+outputFile, JSON.stringify(res,null,2));
    console.log('Saved output to output.txt');
  }
}
run();

function args(index){
  const argsList = [
    process.argv[0],
    process.argv[1],
    process.argv[2+argOffset],
    process.argv[3+argOffset],
    process.argv[4+argOffset],
    process.argv[5+argOffset],
  ];
  return argsList[index];
}

function isValid(expected){
  expected += argOffset;
  for(let i = 2; i<=expected;i++){
    if(process.argv[i] === undefined || process.argv[i]===''){
      console.log('Missing arg '+i);
      return false;
    }
  }
  return true;
}

function checkSBucket(){
  if(sBucket){
    // If we are using a static bucket we do not need the bucket arg
    argOffset += -1;
  }
}