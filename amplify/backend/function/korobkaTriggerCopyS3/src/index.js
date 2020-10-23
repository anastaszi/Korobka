
const AWS = require('aws-sdk')
const s3 = new AWS.S3();

exports.handler = async (event) => {
  if (event && event.Records && (event.Records[0].eventName === 'MODIFY')) {
    var action = event.Records[0].dynamodb;
    var newRecordName = action.NewImage.filename.S;
    var oldRecordName = action.OldImage.filename.S;
    var updatedFileName = (newRecordName !== oldRecordName);
    if (updatedFileName) {
      const path = action.NewImage.key.S;
      const srcBucket = process.env.STORAGE_SHTUKI_BUCKETNAME + "/" + path;
      const srcKey = oldRecordName;
      const newKey = newRecordName;
      const copySrc = srcBucket + "/" + srcKey;
      const desctBucket = srcBucket;

      var params = {
         Bucket: desctBucket,
         CopySource: copySrc,
         Key: newKey
      };

      try {
           await s3.copyObject(params).promise();
           return ("File coppied!")

       } catch (error) {
           console.log(error);
           return;
       }
     }
  }


  return Promise.resolve("No modification");
};
