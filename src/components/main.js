import React, { useState, useEffect } from 'react';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import { API, Storage } from 'aws-amplify';

import { listItems } from '../graphql/queries';
import { createItem as createItemMutation, deleteItem as deleteItemMutation, updateItem as updateItemMutation } from '../graphql/mutations';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import '../App.css';
import ListItems from './listItems.js';
import AddItem from './addItem';
import { ReactComponent as Logo} from '../logo.svg';
import {ReactComponent as AdminLogo} from './svg/admin.svg';

Storage.configure({ level: 'private' });

export default function App(props) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [isAdmin, setisAdmin] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    setCurrentUser({user: props.user.signInUserSession.accessToken.payload.username, group: props.user.signInUserSession.accessToken.payload["cognito:groups"]})
    const apiData = await API.graphql({ query: listItems });
    const itemsFromAPI = apiData.data.listItems.items;
    setItems(itemsFromAPI);
    setLoading(false);
  }

  async function createItem(selectedFile, fileData) {
    await Storage.put(selectedFile.name, selectedFile);
    await API.graphql({ query: createItemMutation, variables: { input: fileData } });
    fetchItems();
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
    fetchItems();
  }

  async function deleteItem({ filename, id }) {
    const newItemsArray = items.filter(note => note.id !== id);
    setItems(newItemsArray);
    await API.graphql({ query: deleteItemMutation, variables: { input: { id } }});
  }

  const adminMark = <div className="admin-logo"><AdminLogo /></div>


return (
  <>
    {(currentUser.group && (currentUser.group[0] === 'Admins')) ? adminMark : ''}
    <Container fluid="sm">
      <Row className="mx-0 mt-5">
        <Col><h1 className="display-3 text-dark"><Logo className="mr-3"/>Korobka Storage</h1></Col>
      </Row>
      < AddItem items={items} createItem={createItem} dublicateItem={dublicateItem}/>
      < ListItems items={items} deleteItem={deleteItem} show={loading} user={currentUser.user}/>
      < AmplifySignOut />
    </ Container>
    </>
  )
}
