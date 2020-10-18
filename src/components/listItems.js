import React from 'react';
import { Storage} from 'aws-amplify';
import { ReactComponent as Bin } from './bin.svg';
import { ReactComponent as Cloud } from './download.svg';
import { ReactComponent as Pen} from './edit.svg';
import { ReactComponent as Settings} from './gear.svg';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useHistory } from "react-router-dom";


function SingleItem(props) {

  let history = useHistory();

  function handleClick() {
    history.push('update/' + props.item.id)
  }
  async function download() {
    const url = await Storage.get(props.item.filename);
    window.location.href = url;
  }

  return (
    <Row className="item text-muted border-bottom align-items-center text-break mx-0">
      <Col sm={2}>{props.item.filename}</Col>
      <Col sm={2}><small>{props.item.username} {props.item.lastname}</small></Col>
      <Col sm={6} className="mr-auto">{props.item.description}</Col>
      <Col sm="auto" className="justify-content-end">
          <DropdownButton variant="light"
        id={'dropdown-basic-'+props.item.filename}
        drop="left"
        title={<Settings/>}>
            <Dropdown.Item onClick={handleClick}><Pen className="mr-2"/><small>Update</small></Dropdown.Item>
            <Dropdown.Item onClick={download}><Cloud className="mr-2"/> <small>Download</small></Dropdown.Item>
            <Dropdown.Item onClick={() => props.deleteItem(props.item)}><Bin className="mr-2"/><small>Delete</small></Dropdown.Item>
          </DropdownButton>
      </Col>
    </Row>
  )
}

export default function ListItems(props) {
  let items = props.items.map((item, index) => <SingleItem key={item.id} item={item} index={index} deleteItem={(e) => props.deleteItem(e)}/>)
  return (
    <div className="my-3">
      <Row className="font-weight-bolder mx-0 text-muted" id="table_header">
        <Col sm={2}>File Name</Col>
        <Col sm={2}>Owner</Col>
        <Col sm={6}>Description</Col>
      </Row>
      {items}
    </div>
  )
}
