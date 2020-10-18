import React, { useState, useEffect } from 'react';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listItems } from './graphql/queries';
import { API, Storage, Auth } from 'aws-amplify';
import Container from 'react-bootstrap/Container';
import ListItems from './components/listItems.js';
import Loader from './components/loader.js';
import Form from 'react-bootstrap/Form';
import bsCustomFileInput from 'bs-custom-file-input';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

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
    bsCustomFileInput.init();
    getUser();
    fetchItems();
  }, []);

  async function fetchItems() {
    const apiData = await API.graphql({ query: listItems });
    const itemsFromAPI = apiData.data.listItems.items;
    setItems(itemsFromAPI);
  }

  async function addFile(e) {
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

  async function addDescription(e) {
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
    <Container fluid="md">
      <h1>My Items Axwp</h1>
      <Row className="justify-content-center">
        <Col sm={6}>
          <Form onSubmit={createItem}>
              <Form.File
                id="custom-file"
                label="No file selected..."
                custom
                className="mb-4"
                onChange={addFile}
              />
              <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Control as="textarea" rows={3} placeholder="Add description" onChange={addDescription} />
              </Form.Group>
              <Button variant="secondary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      {loading ? < Loader /> : null}
      < ListItems items={items} deleteItem={deleteItem}/>
      < AmplifySignOut />
    </ Container>
  )
}

export default withAuthenticator(App);
