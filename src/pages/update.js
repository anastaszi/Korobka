import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { getItem } from '../graphql/queries';
import bsCustomFileInput from 'bs-custom-file-input';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import '../css/Update.css';
import { ReactComponent as FileImg} from '../components/svg/file.svg';
import Loader from '../components/loader';

export default function Update(props) {
  const [currentItem, setCurrentItem] = useState();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    async function getItemInfo() {
      const item = await API.graphql(graphqlOperation(getItem, { id: props.match.params.id } ));
      setCurrentItem(item.data.getItem);
      bsCustomFileInput.init();
    }
    getItemInfo();
  }, []);

  function updateFile() {

  }

/*  async function dublicateItem(selectedFile, fileData, id) {
    await Storage.put(selectedFile.name, selectedFile);
    const fileWithUpdated = {
      id: id
    }
    if (fileData.description !== '') {
      fileWithUpdated.description = fileData.description;
    }
    await API.graphql({ query: updateItemMutation, variables: { input: fileWithUpdated } });
    fetchItems();
  }*/

  return (
    <Container>
      <Row className="align-items-center h-100">
        <Col id="fileImg" sm={"auto"}><FileImg/></Col>
        <Col>
          <Form onSubmit={updateFile}>
            <Row className="align-items-center mx-0 my-4">
              <Col sm={4}>
                  <Form.File
                    id="custom-file"
                    label={currentItem ? currentItem.filename : "none"}
                    custom
                    onChange={updateFile}
                  />
              </Col>
              <Col sm={6}>
                  <Form.Group controlId="exampleForm.ControlTextarea1" className="m-0">
                      <Form.Control as="textarea" rows={1} placeholder="Add description" onChange={ updateFile} />
                  </Form.Group>
              </Col>
              <Col sm="auto">
                  <Button variant="secondary" type="submit" disabled={disabled}>
                    {disabled ? 'Add file first' : (loading ? < Loader /> : 'Submit new file')}
                  </Button>
                  </Col>
                </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}
