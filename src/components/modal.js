import React from 'react';
import Button from 'react-bootstrap/Button';


export default function Modal(props) {
  console.log(props)
  var modal = (<div className="customModal">
                  <div className="customModal-content bg-info text-white rounded p-3">
                  <div>{props.children}</div>
                  <div className="text-right"><Button variant="info" onClick={props.handleClose}>Got it!</Button></div>
                  </div>
            </div>)
  return (
    props.show ? modal: null
  );
}
