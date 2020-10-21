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
  const formRef = useRef(null);

  const {createItem, items, dublicateItem} = props

  useEffect(() => {
    async function getUser() {
      const user = await Auth.currentUserInfo();
      initialFile.username = user.attributes.email;
      initialFile.lastname = user.attributes.email;
      initialFile.key = `private/${user.id}/`
      setFileData(initialFile);
      bsCustomFileInput.init();
    }
    if (initialFile.username === '') getUser();
  }, []);

  function addFile(e) {
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
    setDisabled(false);
  }

  function addDescription(e) {
    setFileData({...fileData, description: e.target.value})
  }

  const handleReset = () => {
    formRef.current.reset();
  };

  const handleClose = () => setShow(!show);

  function resetData() {
    setLoading(false);
    setFileData(initialFile);
    setDisabled(true);
    handleReset();
  }

  async function submitFile(event) {
    event.preventDefault();
    if (!selectedFile) return;
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
    <Form onSubmit={submitFile} ref={formRef}>
      <Row className="align-items-center mx-0 my-4">
        <Col sm={4}>
            <Form.File
              id="custom-file"
              label="No file selected..."
              custom
              onChange={addFile}
            />
        </Col>
        <Col sm={6}>
            <Form.Group controlId="exampleForm.ControlTextarea1" className="m-0">
                <Form.Control as="textarea" rows={1} placeholder="Add description" onChange={addDescription} />
            </Form.Group>
        </Col>
        <Col sm="auto">
            <Button variant="secondary" type="submit" disabled={disabled}>
              {disabled ? 'Add file first' : (loading ? < Loader color="info" size="sm" type="border"/> : 'Submit new file')}
            </Button>
            </Col>
          </Row>
    </Form>
    </>
  )
}
