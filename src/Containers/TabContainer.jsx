import React, { Component } from "react";

import { redirectWhenOAuthChanges } from "../utils";

import * as firebase from "firebase/app";
import "firebase/auth";

import Feed from "./Feed";

// imports for OnsenUI
import * as Ons from "react-onsenui"; // Import everything and use it as 'Ons.Page', 'Ons.Button'
// import * as ons from "onsenui"; // This needs to be imported to bootstrap the components.
// Webpack CSS import
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";


// ES Modules syntax
import Unsplash, { toJson} from 'unsplash-js';

// require syntax


class TabContainer extends Component {

  // in the this.state.posts array we can save the results from our database queries
  // these can then automatically be shown in Feed.jsx by passing the state as a prop
  // By saving the data here we don't have to do a new API call every time we switch tabs 
  constructor(props) {
    super(props);
    
    // connecting to Unsplash to get images automatically
    const Unsplash = require('unsplash-js').default;
    let unsplash = new Unsplash({
      applicationId: "2a745e3aed8f6d1704ea605cf1714be80d3fdf38fabf4e6c09a098b770cf97a6",
      secret: "33be076d60849f65a6bf319f8b9631b63b4ca166ae5bdbf941cfb381960564e0"
    });

    this.state = {
      currentUser: null,
      index: 0,
      posts: [
        {
          title:'dog',
          picUrl:'https://i.imgur.com/Cm919US.jpg',
          postedBy:'Herman'
        },
        {
          title:'cat',
          picUrl:'https://i.imgur.com/1Yd8RQ2.png',
          postedBy:'OtherUser'
        },
        {
          title:'hat',
          picUrl:'https://i.imgur.com/TNDmju5.png',
          postedBy:'David'
        }
      ],
      unsplash: unsplash,
    };
    console.log(this.state.unsplash);

  }

  // metod innehållandes kod vi kan använda när vi laddar in databasresultat?
  // returns the promise of a JSON object containing information about a picture 
  async updateImagesFromUnsplash(keyWord){
    if (!keyWord) {
      // default to something if no keywoard was supplied
      let keyWord = "sea";
      console.log("didnt detect keyWord");
    }
    let unsplashResult = await this.state.unsplash.search.photos(keyWord, 1, 1);
    unsplashResult = await toJson(unsplashResult);
    console.log(unsplashResult);
    return unsplashResult.results[0].urls.thumb;
  }

  componentDidMount() {
  //   redirectWhenOAuthChanges(this.props.history);
  //   firebase.auth().onAuthStateChanged(user => {
  //     if (user) {
  //       this.setState({ currentUser: user });
  //     } else {
  //       this.setState({ currentUser: null });
  //     }
  //   });
  // }

  // signOut = () => {
  //   firebase
  //     .auth()
  //     .signOut()
  //     .then(function() {
  //       console.log("Signed out completed");
  //     })
  //     .catch(function(error) {
  //       console.log("Error when signing out" + error);
  //     });

    for (var post of this.state.posts){
      console.log(post);
      this.updateImagesFromUnsplash(post.title).then(res => post.picUrl = res);
    }


  };

  render() {
    return (
      <Ons.Page>
        <ons-toolbar>
          <div className="center">Soundy</div>

          <div className="right">
            <button onClick = {() => this.updateImagesFromUnsplash("horse")}>connect to unsplash </button>
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
                  <Feed posts = {this.state.posts} />
                </Ons.Page>
              ),
              tab: <Ons.Tab label="Feed" icon="fa-headphones" key="FeedTab" />
            },
            {
              content: (
                <Ons.Page key="Upload">
                  <p>upload</p>
                </Ons.Page>
              ),
              tab: <Ons.Tab label="Upload" icon="fa-microphone" key="UploadTab" />
            },
            {
              content: (
                <Ons.Page key="Profile">
                  <p>Profile</p>
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
