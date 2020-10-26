import React, { useState, useEffect } from 'react';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { API, Auth, Storage } from 'aws-amplify';

import { listItems } from './graphql/queries';
import { createItem as createItemMutation, deleteItem as deleteItemMutation, updateItem as updateItemMutation } from './graphql/mutations';

import './App.css';
import ListItems from './components/listItems.js';
import AddItem from './components/addItem';
import Header from './components/header';
import CustomAuth from './components/customAuth';
import {ReactComponent as AdminLogo} from './components/svg/admin.svg';

Storage.configure({ level: 'private' });

function App(props) {
  const [authState, setAuthState] = useState();
   const [user, setUser] = useState();
   const [items, setItems] = useState([]);
   const [loading, setLoading] = useState(false);
   const [cognitoUser, setCognitoUser] = useState(false);


   useEffect(() => {

       return onAuthUIStateChange((nextAuthState, authData) => {
           setAuthState(nextAuthState);
           setUser(authData);
           getUserInfo(authData);
           fetchItems(authData);
       });
   }, [props]);

  async function fetchItems(authData) {
    if(authData && authData.attributes) {
      console.log(authData.attributes.email_verified)
      setLoading(true);
      const apiData = await API.graphql({ query: listItems });
      const itemsFromAPI = apiData.data.listItems.items;
      setItems(itemsFromAPI);
      setLoading(false);
    }
  }

async function getUserInfo(authData) {
  if (authData && authData.attributes) {
    const userInfo = (await Auth.currentUserInfo());
    setCognitoUser({
      user: authData.username,
      username: authData.attributes["custom:firstname"] ? authData.attributes["custom:firstname"] : authData.attributes.email ,
      lastname: authData.attributes["custom:lastname"] ? authData.attributes["custom:lastname"] : authData.attributes.email,
      id: userInfo.id,
      group: authData.signInUserSession.accessToken.payload["cognito:groups"]});
  }
}

  async function createItem(selectedFile, fileData) {
    await Storage.put(selectedFile.name, selectedFile);
    fileData.username = cognitoUser.username;
    fileData.lastname = cognitoUser.lastname;
    fileData.key = `private/${cognitoUser.id}`
    await API.graphql({ query: createItemMutation, variables: { input: fileData } });
    fetchItems({attributes: true});
  }

  async function dublicateItem(selectedFile, fileData, id) {
    await Storage.put(selectedFile.name, selectedFile);
    const fileWithUpdated = {
      id: id
    }
    if (fileData.description !== '') {
      fileWithUpdated.description = fileData.description;
    }
    await API.graphql({ query: updateItemMutation, variables: { input: fileWithUpdated } });
    fetchItems({attributes: true});
  }

  async function deleteItem({ filename, id }) {
    const newItemsArray = items.filter(note => note.id !== id);
    setItems(newItemsArray);
    await API.graphql({ query: deleteItemMutation, variables: { input: { id } }});
  }

  const adminMark = <div className="admin-logo"><AdminLogo /></div>


  return authState === AuthState.SignedIn && user ? (
  <>
      {(cognitoUser.group && (cognitoUser.group[0] === 'Admins')) ? adminMark : ''}
      < Header />
      < AddItem items={items} allowAdd={cognitoUser} createItem={createItem} dublicateItem={dublicateItem} />
      < ListItems items={items} deleteItem={deleteItem} show={loading} user={cognitoUser.user} fetchItems={fetchItems}/>
      < AmplifySignOut />
    </>
  ) : <CustomAuth />
}

export default App;
