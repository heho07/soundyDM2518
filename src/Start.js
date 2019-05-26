import React, { Component } from "react";
import "./App.css";

import { redirectWhenOAuthChanges } from "./utils";

import * as firebase from "firebase/app";
import "firebase/auth";

import * as Ons from "react-onsenui";

// Webpack CSS import
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

class Start extends Component {
  state = { currentUser: null };

  componentDidMount() {
    redirectWhenOAuthChanges(this.props.history);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ currentUser: user });
      } else {
        this.setState({ currentUser: null });
      }
    });
  }

  signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        console.log("Signed out completed");
      })
      .catch(function(error) {
        console.log("Error when signing out" + error);
      });
  };

  render() {
    const { currentUser } = this.state;
    return (
      <ons-page id="App">
        <ons-toolbar>
          <div className="center">
            <img scr="logo.png" />
          </div>

          <div className="right">
            <ons-toolbar-button icon="sign-out-alt" onClick={this.signOut} />
          </div>
        </ons-toolbar>

        <ons-card>
          <img
            src={"https://monaca.io/img/logos/download_image_onsenui_01.png"}
            alt="Onsen UI"
            style={{ width: "100%" }}
          />
          <div className="title">This is the first song</div>
          <div className="content" />
        </ons-card>
      </ons-page>
    );
  }
}

export default Start;
