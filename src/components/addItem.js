import React, {  useRef, useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import bsCustomFileInput from 'bs-custom-file-input';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Loader from './loader.js';

const initialFile = {
  filename: '',
  description: '',
  username: '',
  lastname: '',
  bucket: process.env.REACT_APP_S3,
  region:  process.env.REACT_APP_S3_REGION,
  uploadTime: ''
};


export default function AddItem(props) {
  const [fileData, setFileData] = useState(initialFile);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const formRef = useRef(null);

  const {createItem} = props

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
    setDisabled(false);
  }

  async function addDescription(e) {
    setFileData({...fileData, description: e.target.value})
  }

  const handleReset = () => {
    formRef.current.reset();
  };

  async function submitFile(event) {
    event.preventDefault();
    setLoading(true);
    if (!selectedFile) return;
    const currentFile = fileData;
    currentFile.uploadTime = Date.now();
    currentFile.updateTime = Date.now();
    await createItem(selectedFile, currentFile);
    setLoading(false);
    setFileData(initialFile);
    setDisabled(true);
    handleReset();
  }

  return (
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
              {disabled ? 'Add file first' : (loading ? < Loader /> : 'Submit new file')}
            </Button>
            </Col>
          </Row>
    </Form>
  )
}
