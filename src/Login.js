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

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = { email: "", password: "" };
  }

  componentDidMount() {
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
        //console.log("Signed in with google!");
        //console.log(token);
        //console.log(user);
      })
      .catch(error => {
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
        let errorMsg =
          "There was en error signing in with Google. See the log for detailed information.";
        this.props.createErrorMessage(errorMsg, "Toast");
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
        //console.log("Signed in with Facebook!");
        //console.log(token);
        //console.log(user);
      })
      .catch(error => {
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
        let errorMsg =
          "There was en error signing in with Facebook. See the log for detailed information.";
        this.props.createErrorMessage(errorMsg, "Toast");
        console.log(credential);
      });
  };

  loginClicked = () => {
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        //console.log(this.state.email);
        let errorMsg = "Error logging in! " + error.code + " " + error.message;
        this.props.createErrorMessage(errorMsg, "Toast");
      });
  };

  render() {
    return (
      <Ons.Page className="page">
        <img id="logoStartscreen" src="logo.png" alt="Soundy's logotype" />
        <form
          onSubmit={event => {
            event.preventDefault();
            this.loginClicked();
          }}
        >
          <p>
            <Ons.Input
              value={this.state.email}
              onChange={event => {
                this.setState({ email: event.target.value });
              }}
              type="email"
              modifier="underbar"
              float
              placeholder="Email"
              style={{ width: "80vw" }}
            />
          </p>
          <p>
            <Ons.Input
              value={this.state.password}
              onChange={event => {
                this.setState({ password: event.target.value });
              }}
              modifier="underbar"
              type="password"
              float
              placeholder="Password"
              style={{ width: "80vw" }}
            />
          </p>
          <div className="border" />
          <p>
            <Ons.Button
              onClick={this.loginClicked}
              modifier="underbar"
              style={{ width: "60vw" }}
            >
              Log in
            </Ons.Button>
          </p>
          <input
            type="submit"
            style={{ visibility: "hidden", height: 0, width: 0 }}
          />
        </form>

        <p>
          <Ons.Button
            className=".fb-google-button"
            modifier="underbar"
            style={{ width: "60vw" }}
            onClick={this.signInWithGoogle}
          >
            <Ons.Icon icon="google" /> Sign in with Google
          </Ons.Button>
        </p>
        <p>
          <Ons.Button
            className=".fb-google-button"
            modifier="underbar"
            style={{ width: "60vw" }}
            onClick={this.signInWithFacebook}
          >
            <Ons.Icon icon="facebook" /> Sign in with Facebook
          </Ons.Button>
        </p>
        <br />
        <a
          href="javascript:;"
          onClick={() => {
            this.props.history.push("/create");
          }}
        >
          Don't have an account? Click here
        </a>

        <p style = {{marginTop:"2em"}} ><a href = 'javascript:;' onClick = {() => this.props.history.push('resetpassword')}>Forgot your password? Click here</a></p>

      </Ons.Page>
    );
  }
}

export default Login;
