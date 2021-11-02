const s3 = require('../s3');

module.exports = async (bucket, prefix)=>{
  const params = {
    Bucket: bucket, /* required */
    Prefix: prefix  
  };
  let grabbedData = await grab(params);
  let out = grabbedData['Contents'];
  while(grabbedData['NextContinuationToken']){
    params['ContinuationToken'] = grabbedData['NextContinuationToken'];
    grabbedData = await grab(params);
    out.push(...grabbedData['Contents']);
  }
  return out;
}

function grab(params){
  return new Promise((resolve, reject)=>{
    try{
      s3.listObjectsV2(params, function(err, data) {
        if (err) {
          console.log(err, err.stack); // an error occurred
          reject(err);
        }
        else {
          resolve(data);
        }
      });
    }catch(err){
      reject(err);
    }
  });
}