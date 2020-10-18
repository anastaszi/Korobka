import React from 'react';
import { Storage} from 'aws-amplify';
import { ReactComponent as Bin } from './bin.svg';
import { ReactComponent as Cloud } from './download.svg';
import { ReactComponent as Pen} from './edit.svg';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import { useHistory } from "react-router-dom";


function SingleItem(props) {

  let history = useHistory();

  function handleClick() {
    history.push(props.item.id)
  }
  async function download(filename) {
    const url = await Storage.get(filename);
    window.location.href = url;
  }

  return (
    <tr className="border-bottom text-secondary">
      <td className="col-3">{props.item.filename}</td>
      <td className="col-2">{props.item.username} {props.item.lastname}</td>
      <td className="text-break col-4">{props.item.description}</td>
      <td className="col-3">
        <Button variant="light" onClick={handleClick}><Pen/><small>Update</small></Button>
        <Button variant="light" onClick={() => download(props.item.filename)} className="mr-3"><Cloud/><small>Download</small></Button>
        <Button variant="light" onClick={() => props.deleteItem(props.item)}><Bin/><small>Delete</small></Button>
      </td>
    </tr>
  )
}

export default function ListItems(props) {
  let items = props.items.map((item, index) => <SingleItem key={item.id} item={item} index={index} deleteItem={(e) => props.deleteItem(e)}/>)
  return (
      <Table size="sm" borderless hover >
        <thead>
          <tr>
           <th className="col-3">File Name</th>
           <th className="col-2">Owner</th>
           <th className="col-4">Description</th>
           <th className="col-3">Actions</th>
         </tr>
       </thead>
        <tbody>
        {items}
        </tbody>
      </Table>
  )
}
