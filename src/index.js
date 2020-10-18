import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Update from './pages/update'
import * as serviceWorker from './serviceWorker';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
Amplify.configure(awsconfig);

ReactDOM.render(
  <React.StrictMode>
  <Router>
           <Switch>
            <Route exact path="/" component={App} />
            <Route path="/update/:id" component={Update} />
            <Route component={App} />
           </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
