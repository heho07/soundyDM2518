import React, { Component } from "react";
import { redirectWhenOAuthChanges } from "../utils";

import * as firebase from "firebase/app";
import "firebase/auth";

import * as Ons from "react-onsenui"; // Import everything and use it as 'Ons.Page', 'Ons.Button'
//import * as ons from "onsenui"; // This needs to be imported to bootstrap the components.

// Webpack CSS import
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

class Profile extends Component {
  state = { currentUser: null };

  componentDidMount() {
    // redirectWhenOAuthChanges(this.props.history);
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
    //console.log(currentUser);
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

  renderRow(row, index) {
    const names = [
      "Max",
      "Chloe",
      "Bella",
      "Oliver",
      "Tiger",
      "Lucy",
      "Shadow",
      "Angel"
    ];
    const name = names[Math.floor(names.length * Math.random())];

    return (
      <Ons.ListItem key={index}>
        <div className="left">
          <img
            src="https://cdn1.iconfinder.com/data/icons/phone-33/65/31-512.png"
            className="list-item__thumbnail"
            alt="Sound icon"
          />
        </div>
        <div className="center">{name}</div>
      </Ons.ListItem>
    );
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
                Edit <Ons.Icon icon="user-cog" />
              </Ons.Button>
              <Ons.Button
                modifier="material"
                className="profileButtons"
                onClick={this.signOut}
              >
                Sign out <Ons.Icon icon="sign-out-alt" />
              </Ons.Button>
            </div>
          </div>
        </div>

        <div className="bottomProfile">
          <Ons.List
            dataSource={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
            renderRow={this.renderRow}
            renderHeader={() => <Ons.ListHeader>Your posts</Ons.ListHeader>}
          />
        </div>
      </Ons.Page>
    );
  }
}

export default Profile;
