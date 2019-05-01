import React, { Component } from "react";
//import { redirectWhenOAuthChanges } from "../utils";

import * as firebase from "firebase/app";
import "firebase/auth";

import * as Ons from "react-onsenui"; // Import everything and use it as 'Ons.Page', 'Ons.Button'
//import * as ons from "onsenui"; // This needs to be imported to bootstrap the components.

// Webpack CSS import
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

class Profile extends Component {
  state = { currentUser: null, toastShown: true, name: "" };

  componentDidMount() {
    //redirectWhenOAuthChanges(this.props.history);
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
    const currentUser = this.state.currentUser;

    if (currentUser && currentUser.photoURL === null) {
      return (
        <img
          src="https://t4.ftcdn.net/jpg/02/15/84/43/240_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
          alt="No Display Name"
          className="userPhoto"
        />
      );
    } else {
      return (
        <img
          src={currentUser && currentUser.photoURL}
          alt={currentUser && currentUser.displayName}
          className="userPhoto"
        />
      );
    }
  }

  handleDismiss() {
    this.setState({ toastShown: false });
  }

  editProfile() {
    var user = firebase.auth().currentUser;
    user
      .updateProfile({
        displayName: "Mitt nya namn"
      })
      .then(function() {
        console.log("toastShown");
        //this.setState({ toastShown: true });
      })
      .catch(function(error) {
        console.error("Error updating! " + error.code + " " + error.message);
      });
  }

  deleteProfile() {
    var user = firebase.auth().currentUser;

    user
      .delete()
      .then(function() {
        // User deleted.
      })
      .catch(function(error) {
        // An error happened.
      });
  }

  render() {
    const currentUser = this.state.currentUser;
    return (
      <Ons.Page className="page">
        <div className="profilDetails">
          {this.renderProfileImage()}
          <div className="profileName">
            <h2>{currentUser && currentUser.displayName}</h2>
            <div>
              <Ons.Button
                modifier="material"
                className="profileButtons"
                onClick={this.signOut}
              >
                Sign out <Ons.Icon icon="sign-out-alt" />
              </Ons.Button>
              <Ons.Button
                modifier="material"
                className="profileButtons"
                onClick={this.deleteProfile}
              >
                Delete Account <Ons.Icon icon="trash-alt" />
              </Ons.Button>
            </div>
          </div>
        </div>

        <div className="bottomProfile" />

        <Ons.Input
          value={this.state.name}
          onChange={event => {
            this.setState({ name: event.target.value });
          }}
          modifier="material"
          float
          placeholder="Name"
          style={{ width: "80vw" }}
        />

        <Ons.Button
          modifier="material"
          className="updateUser"
          onClick={this.editProfile}
        >
          Update User information <Ons.Icon icon="user-cog" />
        </Ons.Button>
      </Ons.Page>
    );
  }
}

export default Profile;
// <Ons.AlertDialog isOpen={this.state.toastShown} isCancelable={false}>
//   <div className="alert-dialog-title">Confirmaiton</div>
//   <div className="alert-dialog-content">
//     Your name have been updated
//   </div>
//   <div className="alert-dialog-footer">
//     <button
//       onClick={this.handleDismiss}
//       className="alert-dialog-button"
//     >
//       Ok
//     </button>
//   </div>
// </Ons.AlertDialog>
