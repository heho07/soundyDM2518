import React, { Component } from "react";
import ShowUsersPosts from "./ShowUsersPosts";
//import { redirectWhenOAuthChanges } from "../utils";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";

import * as Ons from "react-onsenui"; // Import everything and use it as 'Ons.Page', 'Ons.Button'
//import * as ons from "onsenui"; // This needs to be imported to bootstrap the components.

// Webpack CSS import
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

class Profile extends Component {
  // behövde skriva om koden med en konstruktor för att få tillgång till props
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      name: null,
      photoURL: null,
      image: "",
      checkmark: "none",
      spinner: "none",
      selectText: "inherent",
      uploadText: "inherent",
      listOfPosts: []
    };
  }

  componentDidMount() {
    this.firebaseAuthListener = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ currentUser: user });
      }
    });

    var storage = firebase.app().storage("gs://soundy-dm2518.appspot.com/");
    this.storageRef = storage.ref();
    this.db = firebase.firestore();
  }

  componentWillUnmount() {
    this.firebaseAuthListener && this.firebaseAuthListener();
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
        this.props.createErrorMessage(
          "Error when signing out. See log for more details",
          "AlertDialog"
        );
      });
  };

  renderProfileImage() {
    const currentUser = this.state.currentUser; 
    if (currentUser && currentUser.photoURL === null) {
      console.log(currentUser.userName);
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

  editProfileName() {
    var user = firebase.auth().currentUser;
    this.state.name !== null &&
      user
        .updateProfile({
          displayName: this.state.name
        })
        .then(test => {
          this.setState({ currentUser: user, name: null });
        })
        .catch(function(error) {
          console.error("Error updating! " + error.code + " " + error.message);
          this.createErrorMessage(
            "Error editing profile. See log for more details",
            "AlertDialog"
          );
        });
  }

  upload = () => {
    var user = firebase.auth().currentUser;
    const ref = this.storageRef.child("profileImages");
    const file = document.querySelector("#photo").files[0];
    if (file) {
      this.setState({ uploadText: "none", spinner: "block" });
      const name = user.uid;
      const metadata = {
        contentType: file.type
      };
      const task = ref.child(name).put(file, metadata);
      task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
          user
            .updateProfile({
              photoURL: url
            })
            .then(test => {
              this.setState({
                currentUser: user,
                image: null,
                checkmark: "none",
                spinner: "none",
                selectText: "block",
                uploadText: "block"
              });
            })
            .catch(function(error) {
              // An error happened.
              this.props.createErrorMessage(
                "Error uploading profile image.",
                "AlertDialog"
              );
            });
        })
        .catch(console.error);
    }
  };

  selectButtonContent = () => {
    this.setState({
      checkmark: "block",
      selectText: "none"
    });
  };

  render() {
    const currentUser = this.state.currentUser;

    return (
      <Ons.Page className="page">
        <div className="top">
          <div className="profilDetails">
            {this.renderProfileImage()}
            <div className="profileName">
              <h2>{currentUser && currentUser.displayName}</h2>
              <div>
                <Ons.Button modifier="material" onClick={this.signOut}>
                  Sign out <Ons.Icon icon="sign-out-alt" />
                </Ons.Button>
              </div>
            </div>
          </div>
          <div className="edit">
            <div className="editName">
              <Ons.Input
                value={this.state.name}
                onChange={event => {
                  this.setState({ name: event.target.value });
                }}
                modifier="underbar"
                float
                placeholder="Update Name"
                className="updateName"
                requried
              />
              <Ons.Fab
                className="saveButton"
                onClick={this.editProfileName.bind(this)}
              >
                <Ons.Icon icon="save" />
              </Ons.Fab>
            </div>
            <form>
              <input
                className="uploadImage"
                type="file"
                name="photo"
                accept="image/*"
                id="photo"
                onChange={this.selectButtonContent}
              />
              <label htmlFor="photo" className="uploadImage">
                <span style={{ display: this.state.selectText }}>
                  Select Image
                </span>
                <Ons.Icon
                  icon="check"
                  style={{ display: this.state.checkmark }}
                />
              </label>
              <Ons.Button
                modifier="material"
                onClick={this.upload}
                className="uploadImage"
              >
                <span style={{ display: this.state.uploadText }}>Upload</span>
                <Ons.Icon
                  spin
                  icon="sync-alt"
                  style={{ display: this.state.spinner }}
                />
              </Ons.Button>
            </form>
          </div>
        </div>
        <ShowUsersPosts
          user={this.state.currentUser}
          shouldShowDeleteButton={true}
        />
      </Ons.Page>
    );
  }
}

export default Profile;
