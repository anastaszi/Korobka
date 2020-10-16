/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getItem = /* GraphQL */ `
  query GetItem($id: ID!) {
    getItem(id: $id) {
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
export const listItems = /* GraphQL */ `
  query ListItems(
    $filter: ModelItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
