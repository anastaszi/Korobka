import React, { useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify';
import bsCustomFileInput from 'bs-custom-file-input';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import '../App.css';
import Loader from '../components/loader';
import {SuccessModal as Modal} from '../components/modals';
import { updateItem as updateItemMutation } from '../graphql/mutations';

export default function Update(props) {
  const initialState = {filename: '', description: '', file: null}

  const [currentItem, setCurrentItem] = useState();
  const [disabled, setDisabled] = useState(true);
  const [formValues, setFormValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    bsCustomFileInput.init();
    let mounted = true;
    setCurrentItem(props.item);
    return function cleanup() {
            mounted = false;
        }
  }, []);

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmitting) {
      submitChanges();
    }
  }, [formErrors]);

  function submitChanges(event) {
    updateItem();
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
      props.update();
    }, 500);
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
   else
      setFormValues({ ...formValues, [name]: value });
   setDisabled(false);
 };

 function validate () {
    let errors = {};
    var regex = /^[A-Za-z0-9\/\!\-\_\.\*\'\(\)]+$/g;
    if (formValues.filename && !regex.test(formValues.filename)) {
      errors.filename = "Invalid filename format";
    }
    if (formValues.file) {
      if (formValues.file.name !== currentItem.filename)
        errors.file = "Looks like you chose completely different file... Try again!"
      else if (formValues.file.size > 10 * 1024 * 1024)
        errors.file = "This file is too big. Max size is 10Mb";
      }
    return errors;
  };


  async function updateItem() {
    if (formValues.file) {
      await Storage.put(formValues.file.name, formValues.file).catch((e) => console.log("Smth Went Wrong"))
    }
    const fileWithUpdated = {
      id: currentItem.id
    }
    if (formValues.description !== '') {
      fileWithUpdated.description = formValues.description;
    }
    if (formValues.filename !== '') {
      fileWithUpdated.filename = formValues.filename;
    }
    await API.graphql({ query: updateItemMutation, variables: { input: fileWithUpdated } });
  }

  const defaultNameInput = <Form.Control as="textarea" rows={1} placeholder="Loading data..."/>

  const customizedNameInput = <Form.Control as="textarea"
    rows={1}
    name="filename"
    onChange={handleChange}
    defaultValue={currentItem ? currentItem.filename : "Loading data..."}
    isInvalid={!!formErrors.filename}
  />

  const updateModal = (
    <>
    <Modal show={showModal}/>
    <div className="updateModal">
      <div className="updateModal-content rounded p-3">
        <Row className="mx-0 mt-5 justify-content-center">
        <Col xs={"auto"}>
          <h3 className="display-4 text-dark" id="updateLogo">
            Update File</h3>
          </Col>
        </Row>
        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group controlId="update-name" className="m-0">
            <Row className="align-items-center mx-0 my-4">
              <Col xs={4} className="text-right">
                <Form.Label>Rename:</Form.Label>
              </Col>
              <Col className="mr-auto">
                  {currentItem ? customizedNameInput : defaultNameInput}
                  <Form.Text className="text-muted">
                   Use Alphanumeric characters and '/!-_.*()
                  </Form.Text>
                  <Form.Control.Feedback type="invalid" tooltip>
                    Please provide valid name
                  </Form.Control.Feedback>
              </Col>
            </Row>
          </Form.Group>
          <Form.Group controlId="update-description" className="m-0">
            <Row className="align-items-center mx-0 my-4">
              <Col xs={4} className="text-right">
                <Form.Label>Update description:</Form.Label>
              </Col>
              <Col className="mr-auto">
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
              <Col xs={4} className="text-right">
                <Form.Label>New version:</Form.Label>
              </Col>
              <Col className="mr-auto">
                <Form.File
                  name="file"
                  id="update-file"
                  label={formValues.file ? formValues.file.name: "Version is not yet changed"}
                  custom
                  onChange={handleChange}
                  isInvalid={!!formErrors.file}
                  feedback={formErrors.file}
                  feedbackTooltip
                />
              </Col>
            </Row>
          </Form.Group>
          <Row className="mx-0 my-4 justify-content-center">
              <Button variant="secondary" type="submit" disabled={disabled}>
                {disabled ? 'Add Updates First' : 'Submit Changes'}
              </Button>
              <Button variant="warning" onClick={props.close} className="ml-4">Cancel</Button>
          </Row>
        </Form>
      </div>
    </div>
    </>
  )

  return (props.show ? updateModal : null)
}
