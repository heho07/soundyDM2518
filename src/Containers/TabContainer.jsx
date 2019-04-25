import React, { Component } from "react";

import { redirectWhenOAuthChanges } from "../utils";

import * as firebase from "firebase/app";
import "firebase/auth";

import Feed from "./Feed";

// imports for OnsenUI
import * as Ons from "react-onsenui"; // Import everything and use it as 'Ons.Page', 'Ons.Button'
//import * as ons from "onsenui"; // This needs to be imported to bootstrap the components.
// Webpack CSS import
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

class TabContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      index: 0
    };
  }

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
    return (
      <Ons.Page>
        <ons-toolbar>
          <div className="center">Soundy</div>

          <div className="right">
            <ons-toolbar-button icon="sign-out-alt" onClick={this.signOut} />
          </div>
        </ons-toolbar>
        <Ons.Tabbar
          onPreChange={({ index }) => this.setState({ index: index })}
          onPostChange={() => console.log("postChange")}
          onReactive={() => console.log("postChange")}
          position="bottom"
          index={this.state.index}
          renderTabs={(activeIndex, tabbar) => [
            {
              content: (
                <Ons.Page key="Feed">
                  <Feed />
                </Ons.Page>
              ),
              tab: <Ons.Tab label="Feed" icon="fa-info-circle" key="FeedTab" />
            },
            {
              content: (
                <Ons.Page key="Upload">
                  <p>upload</p>
                </Ons.Page>
              ),
              tab: <Ons.Tab label="Upload" icon="fa-child" key="UploadTab" />
            },
            {
              content: (
                <Ons.Page key="Profile">
                  <p>Profile</p>
                </Ons.Page>
              ),
              tab: <Ons.Tab label="Profile" icon="fa-grin" key="ProfileTab" />
            }
          ]}
        />
      </Ons.Page>
    );
  }
}

export default TabContainer;
