import React from 'react';
import Button from 'react-bootstrap/Button';

export function Modal(props) {
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

export function DeleteModal(props) {
  var modal = (<div className="deleteModal align-items-center">
                  <div className="deleteModal-content bg-light rounded p-3">
                    <div className="text-center mb-4">Are you sure you want to delete this file?</div>
                    <div className="text-center"><Button variant="danger" onClick={props.deleteFile} className="mr-4">Yes</Button>
                    <Button variant="secondary" onClick={props.close} className="ml-4">No</Button></div>
                  </div>
            </div>)
  return (
    props.show ? modal: null
  );
}

export function SuccessModal(props) {
  var modal = (<div className="successModal align-items-center">
                  <div className="successModal-content bg-success text-white rounded p-3">
                    <div className="text-center">
                      <h5>Success</h5>
                      <p>Your file was updated!</p></div>
                  </div>
            </div>)
  return (
    props.show ? modal: null
  );
}
