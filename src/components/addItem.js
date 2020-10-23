import React, {  useRef, useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import bsCustomFileInput from 'bs-custom-file-input';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Modal } from './modals';
import Loader from './loader';

const initialFile = {
  filename: '',
  description: '',
  username: '',
  lastname: '',
  bucket: process.env.REACT_APP_S3,
  region:  process.env.REACT_APP_S3_REGION,
};


export default function AddItem(props) {
  const [fileData, setFileData] = useState(initialFile);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [show, setShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const formRef = useRef(null);

  const {createItem, items, dublicateItem} = props

  useEffect(() => {
    bsCustomFileInput.init();
    let mounted = true;
    if (initialFile.username === '')
      loadUserInfo(mounted);;
    return function cleanup() {
            mounted = false;
        }
  }, []);

  useEffect(() => {
    console.log(formErrors)
    if (Object.keys(formErrors).length === 0 && isSubmitting) {
      submitFile();
    }
  }, [formErrors]);

  function loadUserInfo(mounted) {
    Auth.currentUserInfo()
      .then((user) => {
        initialFile.username = user.attributes.email;
        initialFile.lastname = user.attributes.email;
        initialFile.key = `private/${user.id}`;
        console.log(user)
        if (mounted)
          setFileData(initialFile);
      }).catch((e) => console.log(e))
  }

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === 'filename') {
      const file = event.target.files[0];
      setSelectedFile(event.target.files[0]);
      if (!file) return;
      setFileData({ ...fileData, [name]: file.name });
      setDisabled(false);
    }
    else
       setFileData({ ...fileData, [name]: value });
  }

  const handleClose = () => setShow(!show);

  function handleSubmit (event) {
    event.preventDefault();
    setFormErrors(validate());
    setIsSubmitting(true);
  };

  const resetForm = () => {
    formRef.current.reset();
  };

  function resetData() {
    setLoading(false);
    setFileData(initialFile);
    setDisabled(true);
    setIsSubmitting(false);
    resetForm();
  }


  function validate () {
    console.log("hello")
     let errors = {};
     if (!selectedFile)
        errors.file = "You haven't chose a file!";
     if (selectedFile.size > 10 * 1024 * 1024)
        errors.file = "This file is too big. Max size is 10Mb";
     return errors;
   };

  async function submitFile(event) {
    setLoading(true);
    var _dublicate = items.filter(function (el) {
        return (el.filename === fileData.filename)
    })
    var dublicate = ""
    if (_dublicate.length > 0) dublicate = _dublicate[0]
    if(dublicate){
      setShow(true);
      await dublicateItem(selectedFile, fileData, dublicate.id);
    } else {
      await createItem(selectedFile, fileData);
    }
    resetData();
  }

  return (
    <>
    <Modal show={show} handleClose={handleClose}>
      <h5>Duplicate file upload</h5>
      <p>You already have a version of this file. A new version has been attached to the original.</p>
    </Modal>
    <Form onSubmit={handleSubmit} ref={formRef} noValidate>
      <Row className="align-items-center mx-0 my-4">
        <Col sm={4}>
            <Form.File
              name="filename"
              id="custom-file"
              label="No file selected..."
              custom
              onChange={handleChange}
              isInvalid={!!formErrors.file}
              feedback={formErrors.file}
              className="text-truncate"
              feedbackTooltip
            />
        </Col>
        <Col sm={5}>
            <Form.Group controlId="exampleForm.ControlTextarea1" className="m-0">
                <Form.Control as="textarea" rows={1} placeholder="Add description" name="description" onChange={handleChange} />
            </Form.Group>
        </Col>
        <Col sm="auto">
            <Button variant="secondary" type="submit" disabled={disabled}>
              {disabled ? 'Add file first' : (loading ? < Loader color="light" size="sm" type="border"/> : 'Submit')}
            </Button>
            </Col>
          </Row>
    </Form>
    </>
  )
}
