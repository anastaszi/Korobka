import React, {useState} from 'react';
import { Storage} from 'aws-amplify';
import { ReactComponent as Bin } from './svg/bin.svg';
import { ReactComponent as Cloud } from './svg/download.svg';
import { ReactComponent as Pen} from './svg/edit.svg';
import { ReactComponent as Settings} from './svg/gear.svg';
import Moment from 'react-moment';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { DeleteModal } from './modals';
import UpdateModal from './update'


export default function SingleItem(props) {
  const [show, setShow] = useState(false);
  const [updateShow, setUpdateShow] = useState(false);


  function editFile() {
    setUpdateShow(true)
  }

  function processUpdate() {
    props.fetchItems(true);
    setUpdateShow(false)
  }

  async function downloadFile() {
    const url = await Storage.get(props.item.filename);
    window.location.href = url;
  }

  function closeModal() {
    setShow(false);
  }

  function closeUpdate() {
    setUpdateShow(false)
  }

  function deleteFile() {
    closeModal();
    props.deleteItem(props.item);
  }

  function confirmDelete() {
    setShow(true);
  }

  function convertTime(time) {
    if (!time)
      return <small>-</small>;
    else
      return <small><Moment format="MMM Do YY">{time}</Moment></small>
  }

  return (
    <>
    <DeleteModal show={show} deleteFile={deleteFile} close={closeModal}/>
    <UpdateModal show={updateShow} update={processUpdate} close={closeUpdate} item={props.item}  />
    <Row className="item text-muted border-bottom align-items-center text-break mx-0">
      <Col sm={2}>{props.item.filename}</Col>
      <Col sm={2}><small>{props.item.username} {props.item.lastname}</small></Col>
      <Col sm={4}>{props.item.description ? props.item.description : '-'}</Col>
      <Col >{convertTime(props.item.updatedAt)}</Col>
      <Col className="mr-auto">{convertTime(props.item.createdAt)}</Col>
      <Col sm={1} className="justify-content-end">
          <DropdownButton variant="light"
        id={'dropdown-basic-'+props.item.filename}
        drop="left"
        title={<Settings/>}>
            {(props.currentUser === props.item.owner) ? <Dropdown.Item onClick={editFile}><Pen className="mr-2"/><small>Edit</small></Dropdown.Item> : ''}
            <Dropdown.Item onClick={downloadFile}><Cloud className="mr-2"/><small>Download</small></Dropdown.Item>
            <Dropdown.Item onClick={confirmDelete}><Bin className="mr-2"/><small>Delete</small></Dropdown.Item>
          </DropdownButton>
      </Col>
    </Row>
    </>
  )
}
