import React from 'react';
import { ReactMic } from 'react-mic';

import * as firebase from 'firebase/app';
import 'firebase/storage';
import config from '../secrets';

var app = firebase.initializeApp(config);

var storage = firebase.app().storage('gs://soundy-dm2518.appspot.com/');
var storageRef = storage.ref();

export class AudioTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false
    };
  }

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
    console.log('recordedBlob is: ', recordedBlob);
    let audioBlob = recordedBlob.blob;
    console.log(audioBlob);

    //var audioRef = storageRef.child('audios');
    var soundRef = storageRef.child('sound');
    soundRef
      .put(audioBlob)
      .then(snapshot => {
        console.log(snapshot);
      })
      .catch(error => {
        console.log('ERROR: ' + error.message);
      });
  }

  render() {
    return (
      <div>
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
      </div>
    );
  }
}

export default AudioTest;
