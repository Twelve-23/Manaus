/*
Async wrapper for s3 related aws-sdk functions
Mathieu Dombrock 2021
*/

module.exports = {
  create: require('./create'),
  download: require('./download'),
  listBuckets: require('./listBuckets'),
  uploadFile: require('./uploadFile'),
  uploadBuffer: require('./uploadBuffer'),
  listItems: require('./listItems'),
}
