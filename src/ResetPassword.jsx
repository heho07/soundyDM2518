import React, { Component } from "react";
import "./App.css";

import * as firebase from "firebase/app";
import "firebase/auth";

import * as Ons from "react-onsenui";

// Webpack CSS import
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      email: "",
    };
  }

  componentDidMount() {
  }


  resetPassword = () => {
    var auth = firebase.auth();
    var emailAddress = this.state.email;

    auth.sendPasswordResetEmail(emailAddress).then(() => {
      // Email sent.
      console.log(this)
      this.props.createErrorMessage("Email for password reset sent. Follow instructions in the email.", "Toast");
      this.props.history.push('/');
    }).catch((error) => {
      // An error happened.
      console.log(error);
      this.props.createErrorMessage("Error entering email: " + error.code, "Toast");
    });

  };

  renderToolbar() {
    return (
      <Ons.Toolbar>
        <div className="center">Welcome</div>
      </Ons.Toolbar>
    );
  }

  render() {
    return (
      <Ons.Page renderToolbar={this.renderToolbar} className="page">
        <h1>Soundy</h1>
          <form onSubmit = {(event) => {
            event.preventDefault();
            this.resetPassword();
          }}>
            <p>
                <Ons.Input
                  value={this.state.email}
                  onChange={event => {
                    this.setState({ email: event.target.value });
                  }}
                  modifier="underbar"
                  type="email"
                  float
                  placeholder="Enter email to reset password"
                  style={{ width: "80vw" }}
                />
              </p>

              <br />

              <p>
                <Ons.Button
                  onClick={this.resetPassword}
                  modifier="underbar"
                  style={{ width: "60vw" }}
                >
                  Send me an email
                </Ons.Button>
              </p>

            <input type = "submit" style = {{visibility:"hidden", height:0, width:0}}/>
          </form>
          <p style = {{width:"80%"}} >Enter your email address to receive an email with details on how to reset your password.</p> 
          <a href='javascript:;' onClick={() => {this.props.history.push('/login')}}>Back to the login screen</a>
      </Ons.Page>
    );
  }
}

export default ResetPassword;