import React, { Component } from 'react';

import { redirectWhenOAuthChanges } from '../utils';

import * as firebase from 'firebase/app';
import 'firebase/auth';

import Feed from './Feed';
import Profile from './Profile';
import AudioTest from '../AudioRecorder/AudioTest';

// imports for OnsenUI
import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'
// import * as ons from "onsenui"; // This needs to be imported to bootstrap the components.
// Webpack CSS import
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';

class TabContainer extends Component {
  // in the this.state.posts array we can save the results from our database queries
  // these can then automatically be shown in Feed.jsx by passing the state as a prop
  // By saving the data here we don't have to do a new API call every time we switch tabs
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      index: 2,
      posts: [
        {
          title: 'foo',
          picUrl: 'https://i.imgur.com/Cm919US.jpg',
          postedBy: 'Herman'
        },
        {
          title: 'bar',
          picUrl: 'https://i.imgur.com/1Yd8RQ2.png',
          postedBy: 'OtherUser'
        },
        {
          title: 'LMAO',
          picUrl: 'https://i.imgur.com/TNDmju5.png',
          postedBy: 'David'
        }
      ]
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
        console.log('Signed out completed');
      })
      .catch(function(error) {
        console.log('Error when signing out' + error);
      });
  };

  renderToolbar() {
    return (
      <Ons.Toolbar>
        <div className="center">Soundy</div>
      </Ons.Toolbar>
    );
  }

  render() {
    return (
      <Ons.Page renderToolbar={this.renderToolbar}>
        <Ons.Tabbar
          onPreChange={({ index }) => this.setState({ index: index })}
          onPostChange={() => console.log('postChange')}
          onReactive={() => console.log('postChange')}
          position="bottom"
          index={this.state.index}
          renderTabs={(activeIndex, tabbar) => [
            {
              content: (
                <Ons.Page key="Feed">
                  <Feed posts={this.state.posts} />
                </Ons.Page>
              ),
              tab: <Ons.Tab label="Feed" icon="fa-headphones" key="FeedTab" />
            },
            {
              content: (
                <Ons.Page key="Upload">
                  <AudioTest />
                </Ons.Page>
              ),
              tab: (
                <Ons.Tab label="Upload" icon="fa-microphone" key="UploadTab" />
              )
            },
            {
              content: (
                <Ons.Page key="Profile">
                  <Profile />
                </Ons.Page>
              ),
              tab: <Ons.Tab label="Profile" icon="fa-user" key="ProfileTab" />
            }
          ]}
        />
      </Ons.Page>
    );
  }
}

export default TabContainer;
