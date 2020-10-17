import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listItems } from './graphql/queries';
import { API, Storage, Auth } from 'aws-amplify';
import ListItems from './components/listItems.js';
import Loader from './components/loader.js';

import { createItem as createItemMutation, deleteItem as deleteItemMutation } from './graphql/mutations';

Storage.configure({ level: 'private' });

const initialFile = {
  filename: '',
  description: '',
  username: '',
  lastname: '',
  bucket: process.env.REACT_APP_S3,
  region:  process.env.REACT_APP_S3_REGION,
  uploadTime: ''
};

function App() {
  const [items, setItems] = useState([]);
  const [fileData, setFileData] = useState(initialFile);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getUser() {
      const user = await Auth.currentUserInfo();
      initialFile.username = user.attributes.email;
      initialFile.lastname = user.attributes.email;
      initialFile.key = `private/${user.id}/`
      setFileData(initialFile);
    }
    getUser();
    fetchItems();
  }, []);

  async function fetchItems() {
    const apiData = await API.graphql({ query: listItems });
    const itemsFromAPI = apiData.data.listItems.items;
    setItems(itemsFromAPI);
  }

  async function updateFile(e) {
    const file = e.target.files[0];
    setSelectedFile(e.target.files[0]);
    if (!file) return;
    setFileData((prevState) => { return ({
        ...prevState,
        filename: file.name,
        key: fileData.key + file.name,
        })
      }
    );
  }

  async function updateDescription(e) {
    setFileData({...fileData, description: e.target.value})
  }

  async function createItem(event) {
    setLoading(true);
    event.preventDefault();
    if (!selectedFile || !fileData.description) return;
    await Storage.put(selectedFile.name, selectedFile);
    const currentFile = fileData;
    currentFile.uploadTime = Date.now();
    await API.graphql({ query: createItemMutation, variables: { input: currentFile } });
    setLoading(false);
    setItems([...items, currentFile]);
    setFileData(initialFile);
  }

  async function deleteItem({ filename, id }) {
    const newItemsArray = items.filter(note => note.id !== id);
    setItems(newItemsArray);
    Storage.remove(filename).catch(err => console.log(err));
    await API.graphql({ query: deleteItemMutation, variables: { input: { id } }});
  }


return (
    <div className="App">
      <h1>My Items App</h1>
      <form onSubmit={createItem}>
        <input
          type="text"
          onChange={updateDescription}
        />
        <input type="file" onChange={updateFile}/>
        <button type="submit">Create Item</button>
      </form>
      {loading ? < Loader /> : null}
      < ListItems items={items} deleteItem={deleteItem}/>
      <AmplifySignOut />
    </div>
  )
}

export default withAuthenticator(App);
