module.exports = {
  find,
  validate
};

const paramList = [
  'bucket',
  'output',
  'key',
  'destination',
  'target'
];
const paramAlias = {
  'b':'bucket',
  'o':'output'
};

function find(argv){
  // takes argv for portability
  let found = {};
  for(let arg of Object.keys(argv)){
    if(paramList.includes(arg)){
      found[paramList[paramList.indexOf(arg)]] = argv[arg];
    }
    else if(paramAlias[arg]){
      found[paramAlias[arg]] = argv[arg];
    }
    else if(arg !== '_' && arg !== '$0'){//Yargs hack
      console.log('Unknown Parameter: '+arg);
    }
  }
  return found;
}

function validate(params, checkParams){
  let missing = [];
  for(let cParam of checkParams){
    if(!params[cParam]){
      missing.push(cParam);
    }
  }
  if(missing.length>0){
    console.log('MISSING PARAMERTERS!');
    console.log(missing);
    return false;
  }
  return true;
}