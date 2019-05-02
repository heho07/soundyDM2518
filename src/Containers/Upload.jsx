import React, { Component } from 'react';
import { ReactMic } from 'react-mic';
// imports for OnsenUI
import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'
import * as ons from 'onsenui'; // This needs to be imported to bootstrap the components.
// Webpack CSS import
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';

import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';

import ErrorPopUp from "./ErrorPopUp";

class Upload extends Component {

  constructor(props) {
    super(props);
    this.state = {
      record: false,
      audioBlob: null,
      isRecording: false,
      isPaused: false,
      errorOccured:false,
      errorMessage:"",
      errorMessageType:"",
    };
    this.onStop = this.onStop.bind(this);
  }
  
  componentDidMount = () => {
    var storage = firebase.app().storage('gs://soundy-dm2518.appspot.com/');
    this.storageRef = storage.ref();
    this.db = firebase.firestore();
  };

  startRecording = () => {
    this.setState({
      record: true
    });
  };

  stopRecording = () => {
    this.setState({
      record: false
    });
  };

  onData(recordedBlob) {
    console.log('chunk of real-time data is: ', recordedBlob);
  }

  onStop(recordedBlob) {
    this.setState({
      blobURL: recordedBlob.blobURL,
      audioBlob: recordedBlob.blob
    });
  }

  uploadRecording = () => {
    const { audioBlob } = this.state;

    var timeStamp = +new Date();
    var soundRef = this.storageRef.child('sounds/' + timeStamp);
    soundRef
      .put(audioBlob)
      .then(snapshot => {
        //It is now uploaded to storage
        soundRef.getDownloadURL().then(downloadURL => {
          this.db.collection('all-sounds').add({
            //Add to database
            url: downloadURL,
            user: 1, //TODO: Add real user-id
            time: timeStamp
          }).then(alert("uploaded"));
        });
      })
      .catch(error => {
        console.log('ERROR: ' + error.message);
      });
  };



  showErrorMessage(){

  }


  render() {
    const { blobURL, audioURL, isRecording, isPaused } = this.state;
    return (
      <Ons.Page>  
        <ReactMic
          record={this.state.record}
          className="sound-wave"
          onStop={this.onStop}
          onData={this.onData}
          strokeColor="#000000"
          backgroundColor="#FF4081"
        />
        <button onClick={this.startRecording} type="button">
          Start
        </button>
        <button onClick={this.stopRecording} type="button">
          Stop
        </button>
        <button onClick={this.uploadRecording} type="button">
          Upload
        </button>
        <h2>Last sound recorded from source</h2>
        <div>
          <video ref="audioSource" controls="controls" src={blobURL} />
        </div>
        <button onClick = {() => this.setState({errorOccured:true, errorMessage:"testingError", errorMessageType:"Toast"})} >
          Detta är toast
        </button>
        <button onClick = {() => this.setState({errorOccured:true, errorMessage:"testingError", errorMessageType:"AlertDialog"})} >
          Detta är alertdialog
        </button>
        <button onClick = {() => this.setState({errorOccured:true, errorMessage:"testingError", errorMessageType:"foo"})} >
          Denna har ingen giltig type
        </button>
        <ErrorPopUp 
          type = {this.state.errorMessageType}
          isOpen = {this.state.errorOccured} 
          message = {this.state.errorMessage}
          onCancel = {() => this.setState({errorOccured:false, errorMessage:"", errorMessageType:""})}
        />


      </Ons.Page>
    );
  }
}

export default Upload;
