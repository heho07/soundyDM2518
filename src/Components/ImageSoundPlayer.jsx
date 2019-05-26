import React, { Component } from "react";

// imports for OnsenUI
import * as Ons from "react-onsenui"; // Import everything and use it as 'Ons.Page', 'Ons.Button'
//import * as ons from "onsenui"; // This needs to be imported to bootstrap the components.
// Webpack CSS import
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

import TimeAgo from "react-timeago";
//import frenchStrings from 'react-timeago/lib/language-strings/fr'
//import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

class ImageSoundPlayer extends Component {
  // inherits the posts to show from the TabContainer.jsx
  constructor(props) {
    super(props);
    this.state = {
      playing: false
    };
    this.refToSound = {};
  }

  soundClick = () => {
    if (!this.state.playing) {
      this.refToSound.play();
      this.setState({ playing: true });
    } else {
      this.refToSound.pause();
      this.setState({ playing: false });
    }
  };

  // Each element to be shown in the feed
  renderItem(item) {}

  // Called if the audio player has to wait due to slow internet connection
  handleAudioWaiting() {
    this.props.createErrorMessage(
      "Slow internet connection detected.",
      "Toast"
    );
  }

  render() {
    const item = this.props.item;
    const { playing } = this.state;
    let img = item.imgUrl ? item.imgUrl : "https://i.imgur.com/dBmYY4M.png"; // old placeholder image "https://i.imgur.com/hgyXyww.png"
    return (
      <Ons.Card key={item.time}>
        <div>
          <img
            src={item.photoURL}
            onClick={() => this.props.pushPage(item.user)}
            className="profile-image-feed img-circle"
            alt="profile"
          />
          <b onClick={() => this.props.pushPage(item.user)}>{item.userName}</b>
        </div>
        <div className="imageButtonContainer">
          <img src={img} style={{ width: "100%" }} alt="placeholderText" />
          <button
            className="btn"
            style={{ opacity: "0.8" }}
            onClick={() => this.soundClick()}
          >
            <ons-icon icon={playing ? "pause" : "play"} />
          </button>
        </div>
        <audio
          ref={x => {
            this.refToSound = x;
          }}
          onWaiting={() => this.handleAudioWaiting()}
        >
          <source src={item.url} />
          <p>
            Your browser does not support audio. The file can be found at{" "}
            <a href={item.url}>this link</a>
          </p>
        </audio>
        <center>
          <h4>
            {item.title} <i>#{item.keyword}</i>
          </h4>
        </center>
        <p>
          Posted <TimeAgo date={new Date(item.time)} />
        </p>
      </Ons.Card>
    );
  }
}

export default ImageSoundPlayer;
