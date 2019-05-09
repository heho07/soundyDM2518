
import React, { Component } from 'react';
import { ReactMic } from 'react-mic';

// imports for OnsenUI
import * as Ons from "react-onsenui"; // Import everything and use it as 'Ons.Page', 'Ons.Button'
//import * as ons from 'onsenui'; // This needs to be imported to bootstrap the components.
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
      title: "",
      keyword: "",
      time: 0
    };
    this.onStop = this.onStop.bind(this);
    this.startTimer = this.startTimer.bind(this);
  }

  startTimer() {
    this.timer = setInterval(() => this.setState({
      time: this.state.time + 1
    }), 1000);
    setTimeout(this.stopRecording, 10000);
  }

  stopTimer() {
    this.setState({time: 0});
    clearInterval(this.timer);
  }

  componentDidMount = () => {
    var storage = firebase.app().storage("gs://soundy-dm2518.appspot.com/");
    this.storageRef = storage.ref();
    this.db = firebase.firestore();
  };

  startRecording = () => {
    this.setState({
      record: true
    });
    this.startTimer();
  };

  stopRecording = () => {
    this.setState({
      record: false
    });
    console.log(this.state.time);
    this.stopTimer();
  };

  onData(recordedBlob) {
    console.log("chunk of real-time data is: ", recordedBlob);
  }

  onStop(recordedBlob) {
    this.setState({
      blobURL: recordedBlob.blobURL,
      audioBlob: recordedBlob.blob
    });
  }

  uploadRecording = () => {
    const { audioBlob, title, keyword } = this.state;

    var timeStamp = +new Date();
    console.log(title);
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
            time: timeStamp,
            title: title,
            keyword: keyword
          }).then(alert("uploaded"));
        });
      })
      .catch(error => {
        console.log('ERROR: ' + error.message);
        this.props.createErrorMessage(error.message, "Toast");
      });
  };

  render() {
    const { blobURL, audioURL, isRecording, isPaused, title } = this.state;
    let recordButton;

    switch(this.state.record){
      case false:
        recordButton = <ons-icon onClick={this.startRecording} 
                                 icon="fa-circle" 
                                 size="30px"
                                 style={{color: "red"}}></ons-icon>;
        break;
      case true:
        recordButton = <ons-icon onClick={this.stopRecording} 
                                 icon="fa-stop-circle" 
                                 size="56px"
                                 style={{color: "red"}}></ons-icon>;
        break;
      default:
        recordButton = <h1>Something is wrong</h1>;
        break;
    }
    return (
      <Ons.Page>
        <ReactMic
          record={this.state.record}
          className="sound-wave"
          onStop={this.onStop}
          onData={this.onData}
          strokeColor="#4C78FB"
          backgroundColor="#000000"
        />
        <div>
              <ons-fab>
                {recordButton}
              </ons-fab>
        </div>
        <h3>Time left: {10 - this.state.time}</h3>
        <h2>Listen to your recording:</h2>
        <div>
          <audio ref="audioSource" controls="controls" src={blobURL} />
        </div>
        <div>
          <Ons.Input
            value={this.state.title}
            onChange={event => {
              this.setState({ title: event.target.value });
            }}
            modifier="material"
            float
            placeholder="Title"
            style={{ width: "80vw" }}
          />
        </div>
        <div>
          <Ons.Input
            value={this.state.keyword}
            onChange={event => {
              this.setState({ keyword: event.target.value });
            }}
            modifier="material"
            float
            placeholder="Enter 1 keyword"
            style={{ width: "80vw" }}
          />
        </div>
        <div>
          <ons-button onClick={this.uploadRecording} modifier="quiet" icon="fa-cloud-upload-alt"> Upload</ons-button>
        </div>
      </Ons.Page>
    );
  }
}

export default Upload;
