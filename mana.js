#!/usr/bin/env node
/*
Command line interface for the async AWS wrapper

Mathieu Dombrock 2021

Usage:

node mana download BUCKET TARGET DESTINATION
node mana upload BUCKET TARGET
node mana listBuckets
node mana create BUCKET
node mana listItems BUCKET PREFIX(optional)
node mana downloadBucket TARGET DESTINATION
node mana uploadBucket BUCKET TARGET

*/
const fs = require('fs');

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv))
.command('listBuckets','List all buckets', (yargs)=>{})
.command('listItems [bucket] [*prefix]','List all items in the given bucket', (yargs)=>{})
.command('create [bucket]','Create a new bucket with the given name', (yargs)=>{})
.command('download [bucket] [key] [destination]','Download the item with the given key from to the given destination', (yargs)=>{})
.command('downloadBucket [target] [destination]','Download all files from bucket with the name target from to the given destination', (yargs)=>{})
.command('upload [bucket] [target]','Upload the target item to the given bucket', (yargs)=>{})
.command('uploadBucket [bucket] [target]','Upload all files from the target directory to the given bucket', (yargs)=>{})
.option('output', {
  alias: 'o',
  type: 'string',
  description: 'Log full output to the given file'
})
.parse();

let config;
try{
  config  = require('./config.json');
}catch(err){
  //
}


const parameters = require('./parameters');

const cmd = require('./cmd');

const cmdMap = {
  'download':cmd.download,
  'downloadBucket':cmd.downloadBucket,
  'listBuckets':cmd.listBuckets,
  'listItems':cmd.listItems,
  'create':cmd.createBucket,
  'upload':cmd.upload,
  'uploadBucket':cmd.uploadBucket,
  '?':cmd.help
};

const homedir = require('os').homedir(); 

// Settings
const pConfig = {
  sBucket: config ? config.static_bucket : null,
  outputToFile: config ? config.output_to_file : false,
  outputFile: config ? homedir + '/' + config.output_file : 'output-generic.txt'
};

//
async function run(){
  const cmd = process.argv[2];
  const params = parameters.find(argv);
  // Handle params
  if(params['output']){
    pConfig.outputToFile = true;
    pConfig.outputFile = argv.output;
  }
  if(pConfig.sBucket && !params.bucket){
    params.bucket = pConfig.sBucket;
    console.log('Using defualt bucket...');
  }
  // Run command
  if(cmdMap[cmd]){
    const res = await cmdMap[cmd](params);
    console.log("response", res);
    if(pConfig.outputToFile){
      fs.writeFileSync(pConfig.outputFile, JSON.stringify(res,null,2));
    }
  }else{
    console.log('UNKNOWN COMMAND: '+cmd);
    console.log('Use --help for commands list')
  }
}
run();

