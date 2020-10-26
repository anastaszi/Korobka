# Korobka Storage Overview

You can find it live: [korobka.anastaszi.com](https://korobka.anastaszi.com/)

Video: https://www.youtube.com/watch?v=W6DsQzFFvGA


## Functionality

### User Registration
![registration](https://githubdataazimina.s3-us-west-2.amazonaws.com/user_registration.png)

### Actions
User can browse through already uploaded files, download them, edit, and delete
![actions](https://githubdataazimina.s3-us-west-2.amazonaws.com/actions.png)

### Update
User can update filename, description and file version
![update](https://githubdataazimina.s3-us-west-2.amazonaws.com/update.png)

### Admin Panel
Admin can see all files and delete them.
![admin](https://githubdataazimina.s3-us-west-2.amazonaws.com/admin.png)


## Development

The project is done using only AWS resources:
- Amplify
- Cognito
- Route53
- Lambda
- DynamoDb
- GraphQl API

![Diagram](https://githubdataazimina.s3-us-west-2.amazonaws.com/diagram.jpg)

Most of the resources were created by using Amplify Cli \ 
(it automatically creates CloudFormation template that can be modified later)
```
amplify init
amplify auth (cognito)
amplify storage (s3)
amplify api (graphql and dynamodb)
amplify function (lambda)
```
S3 settings (Lifecycle management and Acceleration Configuration) were modified in [CloudFormation template](https://github.com/anastaszi/Korobka/blob/master/amplify/backend/storage/shtuki/s3-cloudformation-template.json):
```
"AccelerateConfiguration" : {
  "AccelerationStatus" : "Enabled"
},
"LifecycleConfiguration": {
   "Rules": [
   {
    "Id": "GlacierRule",
    "Status": "Enabled",
    "ExpirationInDays": "730",
    "Transitions": [
     {
      "TransitionInDays": "75",
      "StorageClass": "STANDARD_IA"},
     {
      "TransitionInDays": "365",
      "StorageClass": "GLACIER"
     }
    ]
   }
  ]
}
```
Cognito Admin group was also created with [CloudFormation template](https://github.com/anastaszi/Korobka/blob/master/amplify/backend/auth/korobka9db7badd/korobka9db7badd-cloudformation-template.yml)
```
  # BEGIN USER GROUPS RESOURCES

  UserPoolGroupAdmins:
    Type: 'AWS::Cognito::UserPoolGroup'
    Properties:
      GroupName: Admins
      UserPoolId: !Ref UserPool
```

As well as custom fields like first and last names:
```
  Schema:
    ... 
    -
      Name: custom:firstname
      AttributeDataType: String
      Required: false
      Mutable: true
    -
      Name: custom:lastname
      AttributeDataType: String
      Required: false
      Mutable: true
```
Continuous Deployment with GitHub
![app info](https://githubdataazimina.s3-us-west-2.amazonaws.com/cd.png)
