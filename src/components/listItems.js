import React from 'react';
import { Storage} from 'aws-amplify';
import { ReactComponent as Bin } from './bin.svg';
import { ReactComponent as Download } from './download.svg';
import Button from 'react-bootstrap/Button';


function SingleItem(props) {
  async function download(filename) {
    const url = await Storage.get(filename);
    console.log(url)
    window.location.href = url;
  }
  return (
    <div key={props.index}>
      <h2>{props.item.filename}</h2>
      <p>{props.item.username}</p>
      <p>{props.item.lastname}</p>
      <p>{props.item.description}</p>
      <Button variant="outline-danger" onClick={() => props.deleteItem(props.item)}> <Bin/></Button>
    <Download onClick={() => download(props.item.filename)} className="bin"/>
    <Bin/>
    </div>
  )
}


export default function ListItems(props) {

  let items = props.items.map((item, index) => <SingleItem item={item} index={index} deleteItem={(e) => props.deleteItem(e)}/>)
  return (
    <div>
    {items}
    </div>
  )
}
