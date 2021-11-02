/*
Async wrapper for s3 related aws-sdk functions
Mathieu Dombrock 2021
*/

module.exports = {
  create: require('./core-tools/create'),
  download: require('./core-tools/download'),
  listBuckets: require('./core-tools/listBuckets'),
  uploadFile: require('./core-tools/uploadFile'),
  uploadData: require('./core-tools/uploadData'),
  listItems: require('./core-tools/listItems'),
}
