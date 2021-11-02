const s3 = require('../s3');

module.exports = (bucket, data, fileName)=>{
  // call S3 to retrieve upload file to specified bucket
  let uploadParams = {Bucket: bucket, Key: '', Body: ''};
  // call S3 to retrieve upload file to specified bucket
  return new Promise((resolve, reject)=>{
    try{
      // Configure the file stream and obtain the upload parameters
      uploadParams.Body = data;
      const path = require('path');
      uploadParams.Key = path.basename(fileName);
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
