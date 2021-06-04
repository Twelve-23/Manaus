// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'us-west-2'});

// Create S3 service object
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

module.exports = s3;