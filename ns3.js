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
  const flag = process.argv[2];
  let argOff = 0;// arg offset
  let outputFile = false;
  if(flag){
    if(flag === '-o'){
      outputFile = true;
      argOff = 1;
    }
  }
  const cmd = process.argv[2+argOff];
  let res = "";

  switch(cmd){
    case 'download':
      if(!isValid(5+argOff)){
        break;
      }
      console.log('Downloading file');
      res = await download(process.argv[3+argOff], process.argv[4+argOff], process.argv[5+argOff]);
      break;
    case 'upload':
      if(!isValid(4+argOff)){
        break;
      }
      console.log('Uploading file');
      res = await uploadFile(process.argv[3+argOff], process.argv[4+argOff]);
      break;
    case 'listItems':
      if(!isValid(3+argOff)){// arg 4 is optional
        break;
      }
      res = await listItems(process.argv[3+argOff], process.argv[4+argOff]);
      break;
    case 'listBuckets':
      res = await listBuckets();
      break;
    case 'create':
      if(!isValid(3+argOff)){
        break;
      }
      console.log('Creating Bucket');
      res = await create(process.argv[3+argOff]);
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