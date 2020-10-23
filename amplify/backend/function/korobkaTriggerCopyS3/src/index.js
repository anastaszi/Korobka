/* Amplify Params - DO NOT EDIT
	API_KOROBKA_GRAPHQLAPIENDPOINTOUTPUT
	API_KOROBKA_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
	STORAGE_SHTUKI_BUCKETNAME
Amplify Params - DO NOT EDIT */const AWS = require('aws-sdk')
const s3 = new AWS.S3();

exports.handler = async (event) => { /*
  if (event && event.Records && (event.Records[0].eventName === 'MODIFY')) {
    var action = event.Records[0].dynamodb;
    var newRecordName = action.NewImage.filename.S;
    var oldRecordName = action.OldImage.filename.S;
    var updatedFileName = (newRecordName !== oldRecordName);
    if (updatedFileName) {
      var path = action.NewImage.key.S;
      console.log("hello");

      return Promise.resolve('File updated?');

      //s3 copy to the same path with new name;
      //s3 delete old copy
    }

    return Promise.resolve(action);
  }*/
  var s3 = new AWS.S3();
  const srcBucket = "korobka48d121d45ebe456486a8adf23f6db64405605-master";
  const srcKey = "02.txt";

   try {
        const params = {
            Bucket: "korobka48d121d45ebe456486a8adf23f6db64405605-master",
            Key: "02.txt"
        };
        var origimage = await s3.getObject(params).promise();
        console.log(origimage);
        return (origimage)

    } catch (error) {
        console.log(error);
        return;
    }

  //return Promise.resolve(AWS.VERSION);
};
