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
  switch(process.argv[2]){
    case 'download':
      if(!isValid(5)){
        break;
      }
      console.log('Downloading file');
      await download(process.argv[3], process.argv[4], process.argv[5]);
      break;
    case 'upload':
      if(!isValid(4)){
        break;
      }
      console.log('Uploading file');
      await uploadFile(process.argv[3], process.argv[4]);
      break;
    case 'listItems':
      if(!isValid(3)){// arg 4 is optional
        break;
      }
      await listItems(process.argv[3], process.argv[4]);
      break;
    case 'listBuckets':
      const listing = await listBuckets();
      break;
    case 'create':
      if(!isValid(3)){
        break;
      }
      console.log('Creating Bucket');
      await create(process.argv[3]);
      break;
    case 'help':
      console.log(helpText);
      break;
    default:
      console.log('Undefined Command: '+process.argv[2]);
      console.log(helpText);
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