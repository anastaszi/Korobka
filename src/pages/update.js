import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { getItem } from '../graphql/queries';
import { useHistory } from "react-router-dom";
import bsCustomFileInput from 'bs-custom-file-input';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import '../css/Update.css';
import { ReactComponent as Logo} from '../logo.svg';
import Loader from '../components/loader';

export default function Update(props) {
  const [currentItem, setCurrentItem] = useState();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [formValues, setFormValues] = useState({filename: '', description: '', file: null});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  let history = useHistory();

  useEffect(() => {
    async function getItemInfo() {
      const item = await API.graphql(graphqlOperation(getItem, { id: props.match.params.id } ));
      setCurrentItem(item.data.getItem);
      bsCustomFileInput.init();
    }
    getItemInfo();
  }, []);

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmitting) {
      submitChanges();
    }
  }, [formErrors]);

  function submitChanges(event) {
    console.log(formValues);
    //checkFilename();
  }

  function handleSubmit (event) {
    event.preventDefault();
    setFormErrors(validate());
    setIsSubmitting(true);
  };

  function handleChange (event) {
   const { name, value } = event.target;
   if (name === 'file')
        setFormValues({ ...formValues, [name]: event.target.files[0] });
   else if (name === 'filename') {
        var filenameNoExpention = value.split('.')
        if (filenameNoExpention.length > 2) {
          filenameNoExpention.pop()
        }
        setFormValues({ ...formValues, [name]: filenameNoExpention.join('.') });
   }
   else
      setFormValues({ ...formValues, [name]: value });
   setDisabled(false);
 };

 const validate = () => {
    let errors = {};
    var regex = /^[A-Za-z0-9\/\!\-\_\.\*\'\(\)]+$/g;
    if (!regex.test(formValues.filename)) {
      errors.filename = "Invalid filename format";
    }
    return errors;
  };

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
    <Container fluid="sm">
      <Row className="mx-0 mt-5">
        <Col><h1 className="display-3 text-dark">
          <Logo className="mr-3" onClick={() => history.push('/')} id="logo-back"/>Update File</h1>
        </Col>
      </Row>
          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group controlId="update-name" className="m-0">
              <Row className="align-items-center mx-0 my-4">
                <Col xs={2} className="text-right">
                  <Form.Label>Rename:</Form.Label>
                </Col>
                <Col xs={6} className="mr-auto">
                    <Form.Control as="textarea"
                      rows={1}
                      name="filename"
                      placeholder={currentItem ? currentItem.filename : "Loading data..."}
                      onChange={handleChange}
                      isInvalid={!!formErrors.filename}
                    />
                    <Form.Text className="text-muted">
                     Use Alphanumeric characters and '/!-_.*()
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                      Please provide a filename.
                    </Form.Control.Feedback>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group controlId="update-description" className="m-0">
              <Row className="align-items-center mx-0 my-4">
                <Col xs={2} className="text-right">
                  <Form.Label>Update description:</Form.Label>
                </Col>
                <Col xs={6} className="mr-auto">
                    <Form.Control as="textarea"
                      name="description"
                      rows={1}
                      placeholder={currentItem ? currentItem.description : "Loading data..."}
                      onChange={handleChange}
                    />
                </Col>
              </Row>
            </Form.Group>
            <Form.Group controlId="update-file-group" className="m-0">
              <Row className="align-items-center mx-0 my-4">
                <Col xs={2} className="text-right">
                  <Form.Label>New version:</Form.Label>
                </Col>
                <Col xs={6} className="mr-auto">
                  <Form.File
                    name="file"
                    id="update-file"
                    label={currentItem ? "Version is not yet changed" : "Loading data..."}
                    custom
                    onChange={handleChange}
                  />
                </Col>
              </Row>
            </Form.Group>
            <Row className="mx-0 my-4">
              <Col xs={8} className="text-right">
                <Button variant="secondary" type="submit" disabled={disabled}>
                  {disabled ? 'Add Updates First' : (loading ? < Loader /> : 'Submit Changes')}
                </Button>
              </Col>
            </Row>
          </Form>
    </Container>
  )
}
