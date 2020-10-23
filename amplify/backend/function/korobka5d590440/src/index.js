const AWS = require('aws-sdk')
const s3 = new AWS.S3();

exports.handler = async (event) => {
  console.log(event.Records[0])
  console.log(event.Records[0].eventName)
  /*
  if (event && event.Records && (event.Records[0].eventName === 'MODIFY')) {
    var action = event.Records[0].dynamodb;
    var newRecordName = action.NewImage.filename.S;
    var oldRecordName = action.OldImage.filename.S;
    var updatedFileName = (newRecordName !== oldRecordName);
    if (updatedFileName) {
      const path = action.NewImage.key.S;
      const oldKey = oldRecordName;
      const newKey = newRecordName;
      const newPath = path +  "/" + newKey;
      const oldPath = path + "/" + oldKey;
      const copySrc = process.env.STORAGE_SHTUKI_BUCKETNAME + "/" + path + "/" + oldKey;


      var copy_params = {
        Bucket: process.env.STORAGE_SHTUKI_BUCKETNAME,
        CopySource: encodeURI(copySrc),
        Key: newPath
      };

      var del_params = {
        Bucket: process.env.STORAGE_SHTUKI_BUCKETNAME,
        Key: oldPath
      };

      try {
           await s3.copyObject(copy_params).promise();
           await s3.deleteObject(del_params).promise();
           return ("File coppied!")

       } catch (error) {
           console.log(error);
           return;
       }
     }
  }
*/

  return Promise.resolve("Just started");
};
