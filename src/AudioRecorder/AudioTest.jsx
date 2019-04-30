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
      record: false,
      blobObject: null,
      isRecording: false,
      isPaused: false,
      audioURL: ""
    };
    this.onStop = this.onStop.bind(this);
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
    let audioBlob = recordedBlob.blob;
    this.setState({ blobURL : recordedBlob.blobURL });
    //var audioRef = storageRef.child('audios');

    //TODO: Random audio name generation
    var soundRef = storageRef.child('sound');
    soundRef
      .put(audioBlob)
      .then(snapshot => {
        console.log(snapshot);
        this.audioURL = soundRef.getDownloadURL().then(function(downloadURL) {
          //console.log('File available at', downloadURL);
          // TODO: I can get the url of the file in the bucket inside here but not outside, then it's just a promise.
          return downloadURL;
        });
        console.log(this.audioURL);
      })
      .catch(error => {
        console.log('ERROR: ' + error.message);
      });
  }

  // If you want background image to <video>: style={{backgroundImage: 'url(' + "https://picsum.photos/400/600" + ')'}}
  render() {
    const { blobURL, isRecording, isPaused } = this.state;
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
        <div>
            <video ref="audioSource" controls="controls" src={blobURL}></video>
      	</div>
      </div>
      
    );
  }
}

export default AudioTest;
