import React from 'react';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignIn } from '@aws-amplify/ui-react';

export default function CustomAuth () {
  return (
    <AmplifyAuthenticator>
      <AmplifySignUp
        username-alias="email"
        slot="sign-up"
        formFields={[
          { type: "email" },
          { type: "password" },
          { type: "custom:lastname", label: "Last Name*", placeholder: "Smith", required: true},
          { type: "custom:firstname", label: "First Name*", placeholder: "John", required: true}
        ]}
      />
      <AmplifySignIn slot="sign-in" headerText="Sign In" usernameAlias="email"  />
    </AmplifyAuthenticator>
  )
}
