
import React, { Component } from 'react';
import { ReactMic } from 'react-mic';
import { Line } from 'rc-progress';
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
      time: 0,
      uploading: false,
    };
    this.onStop = this.onStop.bind(this);
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
    this.setState({uploading: true})
    const { audioBlob, title, keyword } = this.state;
    const { uid } = firebase.auth().currentUser;

    console.log(uid);
    var timeStamp = +new Date();
    console.log(title);
    var soundRef = this.storageRef.child('sounds/' + timeStamp);
    
    this.props.updateImagesFromUnsplash(keyword)
    .then((imgUrl) => {
      soundRef
        .put(audioBlob)
        .then(snapshot => {
          //It is now uploaded to storage
          soundRef.getDownloadURL().then(downloadURL => {
            this.db.collection('all-sounds').add({
              //Add to database
              url: downloadURL,
              user: uid,
              time: timeStamp,
              title: title,
              keyword: keyword,
              imgUrl:imgUrl,
            }).then(this.setState({uploading: false}));
          });
        })
        .catch(error => {
          console.log('ERROR: ' + error.message);
          this.props.createErrorMessage(error.message, "Toast");
      });
    });
  }

  render() {
    const { blobURL, audioURL, isRecording, isPaused, title, uploading } = this.state;
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
              <ons-fab class="fab fab--material">
                {recordButton}
              </ons-fab>
        </div>
        <br/>
        <Line percent={this.state.time * 10} style={{width: "80%"}}strokeWidth="4" strokeColor="#D3D3D3" />
        <p>{this.state.time} out of 10s</p>
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
          <Ons.Button
            modifier="material"
            onClick={this.uploadRecording}
            className="uploadImage"
          >
            <Ons.Icon
              spin = {uploading}
              icon={uploading ? "sync-alt" : "fa-cloud-upload-alt"}
              style={{ display: this.state.spinner }}
            />
            
            <span> Upload</span>

          </Ons.Button>
        </div>
      </Ons.Page>
    );
  }
}

export default Upload;
