import React from 'react';
import Button from 'react-bootstrap/Button';


export default function DeleteModal(props) {
  console.log(props)
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
