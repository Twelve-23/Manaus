const s3 = require('./s3');

module.exports = (bucket, prefix)=>{
  const params = {
    Bucket: bucket, /* required */
    Prefix: prefix  
  };
  return new Promise((resolve, reject)=>{
    try{
      s3.listObjectsV2(params, function(err, data) {
        if (err) {
          console.log(err, err.stack); // an error occurred
          reject(err);
        }
        else {
          console.log(data); // successful response
          resolve(data);
        }
      });
    }catch(err){
      reject(err);
    }
  });
  
}
