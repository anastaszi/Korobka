exports.handler = event => {
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
    return Promise.resolve('Filename stayed the same!');
  }

  return Promise.resolve('No edit were made!');
};
