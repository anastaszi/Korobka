/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createItem = /* GraphQL */ `
  mutation CreateItem(
    $input: CreateItemInput!
    $condition: ModelItemConditionInput
  ) {
    createItem(input: $input, condition: $condition) {
      id
      filename
      description
      username
      lastname
      file {
        bucket
        key
        region
        uploadTime
        updateTime
        url
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateItem = /* GraphQL */ `
  mutation UpdateItem(
    $input: UpdateItemInput!
    $condition: ModelItemConditionInput
  ) {
    updateItem(input: $input, condition: $condition) {
      id
      filename
      description
      username
      lastname
      file {
        bucket
        key
        region
        uploadTime
        updateTime
        url
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteItem = /* GraphQL */ `
  mutation DeleteItem(
    $input: DeleteItemInput!
    $condition: ModelItemConditionInput
  ) {
    deleteItem(input: $input, condition: $condition) {
      id
      filename
      description
      username
      lastname
      file {
        bucket
        key
        region
        uploadTime
        updateTime
        url
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
