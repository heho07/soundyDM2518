import React, { Component } from "react";
import "./App.css";
import { redirectWhenOAuthChanges } from "./utils";

import * as firebase from "firebase/app";
import "firebase/auth";

import * as Ons from "react-onsenui";

// Webpack CSS import
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";
var googleProvider = new firebase.auth.GoogleAuthProvider();
var facebookProvider = new firebase.auth.FacebookAuthProvider();

class CreateLogin extends Component {
  constructor(props) {
    super(props);

    this.state = { email: "", password: "" };
  }

  componentDidMount() {
    console.log(Ons);
    redirectWhenOAuthChanges(this.props.history);
  }

  signInWithGoogle = () => {
    firebase
      .auth()
      .signInWithPopup(googleProvider)
      .then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log("Signed in with google!");
        console.log(token);
        console.log(user);
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        console.log(
          "error with Google-sign in: " +
            "Message: " +
            errorMessage +
            "Code: " +
            errorCode +
            " email: " +
            email
        );
        console.log(credential);
      });
  };

  signInWithFacebook = () => {
    firebase
      .auth()
      .signInWithPopup(facebookProvider)
      .then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log("Signed in with Facebook!");
        console.log(token);
        console.log(user);
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        console.log(
          "error with Facebook sign in: " +
            "Message: " +
            errorMessage +
            "Code: " +
            errorCode +
            " email: " +
            email
        );
        console.log(credential);
      });
  };

  createClick = () => {
    const { email, password } = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(error => {
        console.log(this.state.email);
        console.error("Error signing in! " + error.code + " " + error.message);
        Ons.notification.alert({
          message: "test",
          buttonLabel: "OK"
        });
      });
  };

  loginClicked = () => {
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        console.log(this.state.email);
        console.error("Error login in! " + error.code + " " + error.message);
      });
  };

  render() {
    return (
      <div className="App">
        <div className="header">Create user</div>
        <p>
          <input
            className="loginInput"
            placeholder="Email"
            type="text"
            value={this.state.email}
            onChange={event => {
              this.setState({ email: event.target.value });
            }}
          />
        </p>

        <p>
          <input
            className="loginInput"
            placeholder="Password"
            type="password"
            value={this.state.password}
            onChange={event => {
              this.setState({ password: event.target.value });
            }}
          />
        </p>
        <div className="inputContainer">
          <p>
            <ons-button modifier="large" onClick={this.loginClicked}>
              Log in
            </ons-button>
          </p>
          <p>
            <ons-button modifier="large" onClick={this.createClick}>
              Create Account
            </ons-button>
          </p>
          <p>
            <ons-button modifier="large" onClick={this.signInWithGoogle}>
              Sign in with Google
            </ons-button>
          </p>
          <p>
            <ons-button modifier="large" onClick={this.signInWithFacebook}>
              Sign in with Facebook
            </ons-button>
          </p>
        </div>
      </div>
    );
  }
}

export default CreateLogin;
