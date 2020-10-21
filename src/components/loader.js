import React from 'react';
import Spinner from 'react-bootstrap/Spinner'

export default function Loader (props) {
  return (
    <Spinner animation={props.type} role="status" variant={props.color} size={props.size}>
      <span className="sr-only">Loading...</span>
    </Spinner>
  )
}
