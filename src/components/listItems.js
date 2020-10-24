import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SingleItem from './singleItem';
import Loader from './loader';

export default function ListItems(props) {
  let items = props.items.map((item,index) => <SingleItem key={index} item={item} currentUser={props.user} fetchItems={(e) => props.fetchItems(e)} deleteItem={(e) => props.deleteItem(e)}/>)
  let loader =
      <Row className="justify-content-center">
        <Loader type="grow" color="secondary" size="xl" className="m-5"/>
        <Loader type="grow" color="secondary" size="xl-1delay" className="m-5"/>
        <Loader type="grow" color="secondary" size="xl-2delay" className="m-5"/>
      </Row>
  return (
    <div className="my-5">
      <Row className="font-weight-bolder mx-0 text-muted" id="table_header">
        <Col sm={2}>File Name</Col>
        <Col sm={2}>Owner</Col>
        <Col sm={4}>Description</Col>
        <Col >Modified</Col>
        <Col className="mr-auto" >Created</Col>
        <Col sm={1}></Col>
      </Row>
      {props.show ? loader : items}
    </div>
  )
}
