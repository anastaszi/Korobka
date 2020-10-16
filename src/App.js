import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listItems } from './graphql/queries';
import { API, Storage, Auth } from 'aws-amplify';

import { createItem as createItemMutation, deleteItem as deleteItemMutation } from './graphql/mutations';

Storage.configure({ level: 'private' });

class App extends React.Component {
  constructor(props) {
    super(props);
    this.initialFile = {filename: '', description: '', username: '', lastname: ''};
    this.initialS3 = {bucket: process.env.REACT_APP_S3, key: '', region:  process.env.REACT_APP_S3_REGION}
    this.createItem = this.createItem.bind(this);
    this.fileName = React.createRef();
    this.state = {
      user: {},
      items: [],
      singleFile: {...this.initialFile},
      s3Object: {...this.initialS3}
    };
  }

  componentDidMount() {
    Auth.currentUserInfo()
      .then(res => this.setState({user: {firstname: res.attributes.email , lastname: res.attributes.email }}))
      .catch(e => console.log(e))
  }

  createItem(event) {
    event.preventDefault();
    if (!this.fileName) return;
    let file = {...this.initialS3}
    let item = {...this.singleFile, ...this.state.user}
    file.key = this.fileName.current.files[0].name;
    item.filename = file.key;
    Storage.put(file.key, this.fileName.current.files[0])
      .then(console.log("S3 PUT: Success!"))
      .catch(e => console.log("S3 PUT: Bad! " + e))
      .then(Storage.get(file.key))
      .then(res => {
        console.log(res)
          //const url = URL.createObjectURL(res);
          file.url = "url";
          item.file = file;
          console.log(item)
        })
      .then(API.graphql({ query: createItemMutation, variables: { input: item } }))
      .then(this.setState((state, item) => {return {items: state.items.push(item)}}))
      .then(this.state.items)
      .catch(e => console.log(e))
    /*await API.graphql({ query: createItemMutation, variables: { input: formData } });
    if (formData.url) {
      const url = await Storage.get(formData.url);
      formData.url = url;
    }
    setItems([ ...items, formData ]);
    setFormData(initialFormState);*/
  }

  render() {return (
    <div className="App">
      <h1>My Items App</h1>
      <form onSubmit={this.createItem}>
        <label>Upload file:
          <input type="file" ref={this.fileName}/>
        </ label>
        <button type="submit">Create Item</button>
      </form>
      <div style={{marginBottom: 30}}>
        {

        }
      </div>
      <AmplifySignOut />
    </div>
  );}
}

export default withAuthenticator(App);
