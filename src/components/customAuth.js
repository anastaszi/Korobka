import React from 'react';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignIn, AmplifyConfirmSignIn } from '@aws-amplify/ui-react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ReactComponent as Logo} from './svg/logo.svg';

export default function CustomAuth () {
  return (
    <Row className="mx-0 mt-5">
      <Col sm={12} className="mb-3"><h1 className="display-3 text-dark" id="updateLogo"><Logo className="mr-3" id="logo-back"/>Korzina Storage</h1></Col>
      <Col><AmplifyAuthenticator>
        <AmplifySignUp
          usernameAlias="email"
          slot="sign-up"
          formFields={[
            { type: "email" },
            { type: "password" },
            { type: "custom:lastname", label: "Last Name*", placeholder: "Smith", required: true},
            { type: "custom:firstname", label: "First Name*", placeholder: "John", required: true}
          ]}
        />
        <AmplifySignIn slot="sign-in" headerText="Sign In" usernameAlias="email"  />
        <AmplifyConfirmSignIn headerText="My Custom Confirm Sign In Text" slot="confirm-sign-in"></AmplifyConfirmSignIn>
      </AmplifyAuthenticator>
      </Col>
    </Row>
  )
}
