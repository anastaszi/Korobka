/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateItem = /* GraphQL */ `
  subscription OnCreateItem($owner: String!) {
    onCreateItem(owner: $owner) {
      id
      name
      file {
        bucket
        key
        region
      }
      url
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateItem = /* GraphQL */ `
  subscription OnUpdateItem($owner: String!) {
    onUpdateItem(owner: $owner) {
      id
      name
      file {
        bucket
        key
        region
      }
      url
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteItem = /* GraphQL */ `
  subscription OnDeleteItem($owner: String!) {
    onDeleteItem(owner: $owner) {
      id
      name
      file {
        bucket
        key
        region
      }
      url
      createdAt
      updatedAt
      owner
    }
  }
`;
