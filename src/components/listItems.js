import React from 'react';
import { Storage} from 'aws-amplify';
import { ReactComponent as Bin } from './bin.svg';
import { ReactComponent as Cloud } from './download.svg';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function SingleItem(props) {
  async function download(filename) {
    const url = await Storage.get(filename);
    console.log(url)
    window.location.href = url;
  }
  return (
    <Row key={props.index}>
    <Col>{props.item.filename}</Col>
    <Col>{props.item.username}</Col>
    <Col>{props.item.lastname}</Col>
    <Col>{props.item.description}</Col>
    <Col><Button onClick={() => download(props.item.filename)}><Cloud/></Button>
    <Button variant="danger" onClick={() => props.deleteItem(props.item)}><Bin/></Button></Col>
    </Row>
  )
}


export default function ListItems(props) {

  let items = props.items.map((item, index) => <SingleItem key={item.id} item={item} index={index} deleteItem={(e) => props.deleteItem(e)}/>)
  return (
    <div>
    {items}
    </div>
  )
}
