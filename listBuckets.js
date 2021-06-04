const s3 = require('./s3');

// Call S3 to list the buckets
module.exports = ()=>{
  return new Promise((resolve, reject)=>{
    try{
      s3.listBuckets(function(err, data) {
        if (err) {
          console.log("Error", err);
          reject(err);
        } else {
          console.log("Success", data.Buckets);
          resolve(data.Buckets);
        }
      });
    }catch(err){
      reject(err);
    }
  });
}
