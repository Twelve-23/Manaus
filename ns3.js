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

const download = require('./download');
const uploadFile = require('./uploadFile');
const listBuckets = require('./listBuckets');
const create = require('./create');
const listItems = require('./listItems');

const helpText = `
node ns3 download BUCKET TARGET DESTINATION
node ns3 upload BUCKET TARGET
node ns3 listBuckets
node ns3 create BUCKET
node ns3 listItems BUCKET PREFIX(optional)
`;

async function run(){
  const flag = ;
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
  const cmd = process.argv[2+argOff];
  let res = "";
  switch(cmd){
    case 'download':
      if(!isValid(5+argOff)){
        break;
      }
      console.log('Downloading file');
      const bucket = process.argv[3+argOff];
      const key = process.argv[4+argOff];
      const destination = process.argv[5+argOff];
      res = await download(bucket, key, destination);
      break;
    case 'upload':
      if(!isValid(4+argOff)){
        break;
      }
      console.log('Uploading file');
      const bucket = process.argv[3+argOff];
      const target = process.argv[4+argOff];
      res = await uploadFile(bucket, target);
      break;
    case 'listItems':
      if(!isValid(3+argOff)){// arg 4 is optional
        break;
      }
      const bucket = process.argv[3+argOff];
      const prefix = process.argv[4+argOff];
      res = await listItems(bucket, prefix);
      break;
    case 'listBuckets':
      res = await listBuckets();
      break;
    case 'create':
      if(!isValid(3+argOff)){
        break;
      }
      console.log('Creating Bucket');
      const bucket = process.argv[3+argOff];
      res = await create();
      break;
    case 'help':
      console.log(helpText);
      break;
    default:
      console.log('Undefined Command: '+process.argv[2+argOff]);
      console.log(helpText);
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