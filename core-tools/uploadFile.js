const fs = require('fs');
const s3 = require('../s3');


module.exports = (bucket, target)=>{
  // call S3 to retrieve upload file to specified bucket
  let uploadParams = {Bucket: bucket, Key: '', Body: ''};
  const file = target;
  // call S3 to retrieve upload file to specified bucket
  return new Promise((resolve, reject)=>{
    try{
      // Configure the file stream and obtain the upload parameters
      const fileStream = fs.createReadStream(file);
      fileStream.on('error', function(err) {
        reject(err);
      });
      uploadParams.Body = fileStream;
      const path = require('path');
      uploadParams.Key = path.basename(file);
      s3.upload (uploadParams, function (err, data) {
        if (err) {
          reject(err);
        } if (data) {
          resolve(data.Location);
        }
      });
    }catch(err){
      reject(err);
    }
  });
}
