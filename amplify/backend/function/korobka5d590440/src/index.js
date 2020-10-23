const AWS = require('aws-sdk')
const s3 = new AWS.S3();

exports.handler = async (event) => {
  console.log(event.Records[0])
  console.log(event.Records[0].eventName === 'REMOVE')

  if (event && event.Records && (event.Records[0].eventName === 'REMOVE')) {
    var action = event.Records[0].dynamodb;
    var recordFileName = action.OldImage.filename.S;
    var path = action.OldImage.key.S + "/" + recordFileName;
    console.log(path)
    console.log(recordFileName)
    console.log(action)

      var del_params = {
        Bucket: process.env.STORAGE_SHTUKI_BUCKETNAME,
        Key: path
      };

      try {
           await s3.deleteObject(del_params).promise();
           return ("File deleted!")

       } catch (error) {
           console.log(error);
           return;
       }
     }

  return Promise.resolve("Nothing to do here");
};
