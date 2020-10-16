import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listItems } from './graphql/queries';
import { API, Storage, Auth } from 'aws-amplify';

import { createItem as createItemMutation, deleteItem as deleteItemMutation } from './graphql/mutations';

Storage.configure({ level: 'private' });

const initialFormState = { name: ''}


function App() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(initialFormState);


  useEffect(() => {
    fetchItems();
  }, []);

  async function onChange(e) {
  if (!e.target.files[0]) return
  const file = e.target.files[0];
  setFormData({ ...formData, name: file.name });
  await Storage.put(file.name, file);
  fetchItems();
}

  async function fetchItems() {
    const apiData = await API.graphql({ query: listItems });
    const itemsFromAPI = apiData.data.listItems.items;
  await Promise.all(itemsFromAPI.map(async item => {
    if (item.url) {
      const url = await Storage.get(item.url);
      item.url = url;
    }
    return item;
  }))
    setItems(apiData.data.listItems.items);
  }

  async function createItem() {
    if (!formData.name) return;
    await API.graphql({ query: createItemMutation, variables: { input: formData } });
    if (formData.url) {
      const url = await Storage.get(formData.url);
      formData.url = url;
    }
    setItems([ ...items, formData ]);
    setFormData(initialFormState);
  }

  async function deleteItem({ name, id }) {
    const newItemsArray = items.filter(note => note.id !== id);
    setItems(newItemsArray);
    Storage.remove(name, { level: 'private' }).catch(err => console.log(err));
    await API.graphql({ query: deleteItemMutation, variables: { input: { id } }});
  }

  return (
    <div className="App">
      <h1>My Items App</h1>

        <input
        type="file"
        onChange={onChange}
      />
      <button onClick={createItem}>Create Item</button>
      <div style={{marginBottom: 30}}>
        {
          items.map(item => (
            <div key={item.id || item.name}>
              <h2>{item.name}</h2>
              <button onClick={() => deleteItem(item)}>Delete item</button>

            </div>
          ))
        }
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
