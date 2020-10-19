import React from 'react';
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
import { useHistory } from "react-router-dom";


export default function SingleItem(props) {

  let history = useHistory();

  function handleClick() {
    history.push('update/' + props.item.id)
  }
  async function download() {
    const url = await Storage.get(props.item.filename);
    window.location.href = url;
  }

  function convertTime(time) {
    if (!time)
      return <small>-</small>;
    else
      return <small><Moment format="MMM Do YY">{time}</Moment></small>
  }

  return (
    <Row className="item text-muted border-bottom align-items-center text-break mx-0">
      <Col sm={2}>{props.item.filename}</Col>
      <Col sm={2}><small>{props.item.username} {props.item.lastname}</small></Col>
      <Col sm={4}>{props.item.description ? props.item.description : '-'}</Col>
      <Col >{convertTime(props.item.updateTime)}</Col>
      <Col className="mr-auto"><small><Moment format="MMM Do YY">
                {props.item.uploadTime}
            </Moment></small></Col>
      <Col sm={1} className="justify-content-end">
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
