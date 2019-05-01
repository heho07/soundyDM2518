import React from 'react';
import { ReactMic } from 'react-mic';

import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';

export class AudioTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false,
      audioBlob: null,
      isRecording: false,
      isPaused: false,
      allSounds: []
    };
    this.onStop = this.onStop.bind(this);
  }

  componentDidMount = () => {
    var storage = firebase.app().storage('gs://soundy-dm2518.appspot.com/');
    this.storageRef = storage.ref();
    this.db = firebase.firestore();

    this.fetchAllSounds();
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
          });
        });
      })
      .catch(error => {
        console.log('ERROR: ' + error.message);
      });
  };

  fetchAllSounds = () => {
    var allSounds = [];
    this.db
      .collection('all-sounds')
      .orderBy('time', 'desc')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          allSounds.push(doc.data());
        });
        this.setState({ allSounds: allSounds });
      });
  };

  renderAllSounds = () => {
    return this.state.allSounds.map(soundObject => {
      const { url, user, time } = soundObject;
      return (
        <div key={time}>
          <div>User: {user}</div>
          <div>
            {new Date(time).toDateString()}{' '}
            {new Date(time).toLocaleTimeString()}
          </div>
          <div>
            <video ref="audioSource" controls="controls" src={url} />
          </div>
        </div>
      );
    });
  };

  // If you want background image to <video>: style={{backgroundImage: 'url(' + "https://picsum.photos/400/600" + ')'}}
  render() {
    const { blobURL, audioURL, isRecording, isPaused } = this.state;
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
        <button onClick={this.uploadRecording} type="button">
          Upload
        </button>
        <h2>Last sound recorded from source</h2>
        <div>
          <video ref="audioSource" controls="controls" src={blobURL} />
        </div>
        <h2>Sounds from Firebase Storage</h2>
        <button
          onClick={() => {
            this.fetchAllSounds();
          }}
        >
          Refresh
        </button>
        {this.renderAllSounds()}
      </div>
    );
  }
}

export default AudioTest;
