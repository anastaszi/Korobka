import React, { useState, useEffect } from 'react';
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { API, Auth, Storage } from 'aws-amplify';

import { listItems } from './graphql/queries';
import { createItem as createItemMutation, deleteItem as deleteItemMutation, updateItem as updateItemMutation } from './graphql/mutations';

import './App.css';
import ListItems from './components/listItems.js';
import AddItem from './components/addItem';
import Header from './components/header';
import {ReactComponent as AdminLogo} from './components/svg/admin.svg';

Storage.configure({ level: 'private' });

function App(props) {
  const [authState, setAuthState] = React.useState();
   const [user, setUser] = React.useState();
   const [items, setItems] = useState([]);
   const [loading, setLoading] = useState(false);
   const [currentUser, setCurrentUser] = useState({});
   const [returned, setReturned] = useState(false);
   const [showList, setShowList] = useState(true);


   React.useEffect(() => {

       return onAuthUIStateChange((nextAuthState, authData) => {
           setAuthState(nextAuthState);
           setUser(authData);
           fetchItems(authData);
       });
   }, []);

  async function fetchItems(authData) {
    if(authData) {
      console.log(authData)
      setLoading(true);
      const userInfo = (await Auth.currentSession()).idToken.payload;
      setCurrentUser({user: userInfo["cognito:username"], group: userInfo["cognito:groups"]})
      const apiData = await API.graphql({ query: listItems });
      const itemsFromAPI = apiData.data.listItems.items;
      setItems(itemsFromAPI);
      setLoading(false);
    }
  }

  async function createItem(selectedFile, fileData) {
    await Storage.put(selectedFile.name, selectedFile);
    await API.graphql({ query: createItemMutation, variables: { input: fileData } });
    var submittedFile = fileData;
    submittedFile.createdAt = Date.now();
    submittedFile.updatedAt = submittedFile.createdAt;
    fetchItems(true);
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
    fetchItems(true);
  }

  async function deleteItem({ filename, id }) {
    const newItemsArray = items.filter(note => note.id !== id);
    setItems(newItemsArray);
    await API.graphql({ query: deleteItemMutation, variables: { input: { id } }});
  }

  const adminMark = <div className="admin-logo"><AdminLogo /></div>


  return authState === AuthState.SignedIn && user ? (
  <>
      {(currentUser.group && (currentUser.group[0] === 'Admins')) ? adminMark : ''}
      < Header />
      < AddItem items={items} createItem={createItem} dublicateItem={dublicateItem} />
      < ListItems items={items} deleteItem={deleteItem} show={loading} user={currentUser.user} fetchItems={fetchItems}/>
      < AmplifySignOut />
    </>
  ) : <>hello<AmplifyAuthenticator /></>
}

export default App;
