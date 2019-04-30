import React, { Component } from "react";
import { redirectWhenOAuthChanges } from "../utils";

import * as firebase from "firebase/app";
import "firebase/auth";

import * as Ons from "react-onsenui";

// Webpack CSS import
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

class Profile extends Component {
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

  renderProfileImage() {
    const { currentUser } = this.state;
    console.log(currentUser && currentUser.photoURL);
    if (currentUser && currentUser.photoURL === null) {
      console.log("Undefined image, use default");
      return (
        <img
          src="https://t4.ftcdn.net/jpg/02/15/84/43/240_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
          alt={currentUser && currentUser.displayName}
          className="userPhoto"
        />
      );
    } else {
      console.log("NOT Undefined image");
      return (
        <img
          src={currentUser && currentUser.photoURL}
          alt={currentUser && currentUser.displayName}
          className="userPhoto"
        />
      );
    }
  }

  render() {
    const { currentUser } = this.state;
    return (
      <Ons.Page className="page">
        <div className="Profil">{this.renderProfileImage()}</div>
        <h2>{currentUser && currentUser.displayName}</h2>

        <Ons.Button modifier="material" onClick={this.signOut}>
          Sign out {currentUser && currentUser.email}
        </Ons.Button>
      </Ons.Page>
    );
  }
}

export default Profile;
