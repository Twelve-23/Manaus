const s3 = require('../s3');

module.exports = (bucket)=>{
  // Create the parameters for calling createBucket
  const bucketParams = {
    Bucket : bucket
  };
  return new Promise((resolve, reject)=>{
    try{
      // call S3 to create the bucket
      s3.createBucket(bucketParams, function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data.Location);
        }
      });
    }catch(err){
      reject(err);
    }
  });
}

