import React, { useState, useEffect } from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { API, Storage } from 'aws-amplify';

import { listItems } from './graphql/queries';
import { createItem as createItemMutation, deleteItem as deleteItemMutation } from './graphql/mutations';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './App.css';
import ListItems from './components/listItems.js';
import AddItem from './components/addItem';
import { ReactComponent as Logo} from './logo.svg';

Storage.configure({ level: 'private' });

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const apiData = await API.graphql({ query: listItems });
    const itemsFromAPI = apiData.data.listItems.items;
    setItems(itemsFromAPI);
  }

  async function createItem(selectedFile, fileData) {
    await Storage.put(selectedFile.name, selectedFile);
    await API.graphql({ query: createItemMutation, variables: { input: fileData } });
    setItems([...items, fileData]);
  }

  async function deleteItem({ filename, id }) {
    const newItemsArray = items.filter(note => note.id !== id);
    setItems(newItemsArray);
    Storage.remove(filename).catch(err => console.log(err));
    await API.graphql({ query: deleteItemMutation, variables: { input: { id } }});
  }


return (
    <Container fluid="sm">
      <Row className="mx-0 mt-5">
        <Col><h1 className="display-3 text-dark"><Logo className="mr-3"/>Korobka Storage</h1></Col>
      </Row>
      < AddItem createItem={createItem}/>
      < ListItems items={items} deleteItem={deleteItem}/>
      < AmplifySignOut />
    </ Container>
  )
}

export default withAuthenticator(App);
