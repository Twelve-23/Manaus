const s3 = require('../s3');

module.exports = (bucket, key, destination)=>{
  const params = {Bucket: bucket, Key: key};
  const file = require('fs').createWriteStream(destination);
  return new Promise((resolve, reject)=>{
    try{
      s3.getObject(params).createReadStream().pipe(file);
      resolve("Sucess!");
    }catch(err){
      console.log(err);
      reject(err);
    }
  });
  
}
