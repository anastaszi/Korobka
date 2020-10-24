import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ReactComponent as Logo} from './svg/logo.svg';



export default function Header(props) {
  return (
    <Row className="mx-0 mt-5">
      <Col><h1 className="display-3 text-dark" id="updateLogo"><Logo className="mr-3" id="logo-back"/>Korzina Storage</h1>
      </Col>
    </Row>
  )
}
