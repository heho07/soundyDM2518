import React, { Component } from "react";

import { redirectWhenOAuthChanges } from "../utils";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";

import Navigator from "./Feed";
import Profile from "./Profile";
import Upload from "./Upload";
import UsersPosts from "./ShowUsersPosts";
//import AudioTest from '../AudioRecorder/AudioTest';

// imports for OnsenUI
import * as Ons from "react-onsenui"; // Import everything and use it as 'Ons.Page', 'Ons.Button'
// import * as ons from "onsenui"; // This needs to be imported to bootstrap the components.
// Webpack CSS import
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

import config from "../secrets.js";

// ES Modules syntax
import Unsplash, { toJson } from "unsplash-js";

// require syntax

class TabContainer extends Component {
  // in the this.state.posts array we can save the results from our database queries
  // these can then automatically be shown in Feed.jsx by passing the state as a prop
  // By saving the data here we don't have to do a new API call every time we switch tabs
  constructor(props) {
    super(props);
    // connecting to Unsplash to get images automatically
    const Unsplash = require("unsplash-js").default;
    //console.log(config);
    let unsplash = new Unsplash({
      applicationId: config.unsplashApiKeys.access_key,
      secret: config.unsplashApiKeys.secret_key
    });

    this.getAllUsers = firebase.functions().httpsCallable("getAllUsers");

    this.state = {
      currentUser: null,
      index: 0,
      posts: [
        {
          title: "dog",
          postedBy: "Herman"
        },
        {
          title: "cat",
          postedBy: "OtherUser"
        },
        {
          title: "hat",
          postedBy: "David"
        }
      ],
      unsplash: unsplash,
      status: "loading",

      // states for the audio recording
      allSounds: [],
      
      // states for infinitescroller
      lastKnownKey: "",
      hasMore: true,


    };
  }

  // metod innehållandes kod vi kan använda när vi laddar in databasresultat?
  // returns the promise of a JSON object containing information about a picture
  // 50 requests per hour
  async updateImagesFromUnsplash(keyWord) {
    if (!keyWord) {
      // default to something if no keywoard was supplied
      return "https://i.imgur.com/dBmYY4M.png";
    }

    // Söker efter en bild matchande det sökord som ges
    // Måste använda try-catch för att kunna fånga upp ifall API-queryn ger error
    try {
      let unsplashResult = await this.state.unsplash.search.photos(
        keyWord,
        1,
        1
      );
      unsplashResult = await toJson(unsplashResult);
      return unsplashResult.results[0].urls.thumb;
    } catch (error) {
      // Ifall vi får error ge nån default bild (t.ex. ifall vi uppnåt quota för unsplashAPI)
      console.log(error);
      return "https://i.imgur.com/dBmYY4M.png";
    }
  }

  async componentDidMount() {
    redirectWhenOAuthChanges(this.props.history);

    // kopplar upp till databasen
    var storage = firebase.app().storage("gs://soundy-dm2518.appspot.com/");
    this.storageRef = storage.ref();
    this.db = firebase.firestore();
    this.fetchAllSounds();
  }

  // Anropar databasen och sparar alla query-resultat i this.state
  // Keeps track of the last item in the allSounds array by saving it to state
  fetchAllSounds = async () => {
    if (navigator.onLine) {
      const usersFromDatabase = await this.fetchAllUsers();
      var allSounds = [];
      try {
        await this.db
        .collection('all-sounds')
        .orderBy('time', 'desc')
        .limit(10)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            let soundData = doc.data()
            const correctUser = usersFromDatabase.find(user => user.uid === soundData.user)
            soundData.userName = correctUser ? correctUser.displayName : "-"
            soundData.photoURL = correctUser ? correctUser.photoURL : null
            soundData.id = doc.id
            allSounds.push(soundData);
          })})
        .then(() => 
          this.setState({ 
            allSounds: allSounds,
            status:"loaded",
          }, () => this.setState({
            lastKnownKey: this.state.allSounds[this.state.allSounds.length-1].time,            
          }))
        )
        .catch(error => {
          this.props.createErrorMessage("Error when fetching new sounds. See the log for more details", "Toast");
          console.log(error);
        });
      } catch(err){
        this.props.createErrorMessage(err, "Toast");
        console.log(err);
      }
    } else {
      this.props.createErrorMessage("No internet connection! :(", "Toast");
    }
  };

  // Slightly different version of the one above.
  // Fetches new posts from the database, starting from the last time-ID currently loaded.
  // Excludes the last one currently shown so as not to create duplicates
  // Keeps track of the last item in the allSounds array by saving it to state
  fetchAdditionalSounds = async () => {
    if (navigator.onLine) {
      const usersFromDatabase = await this.fetchAllUsers();
      var allSounds = this.state.allSounds;
      try {
        await this.db
          .collection("all-sounds")
          .orderBy("time", "desc")
          .startAt(this.state.lastKnownKey)
          .limit(10)
          .get()
          .then(querySnapshot => {
            if (querySnapshot.size === 1) {
              // ifall vi bara får ett resultat innebär det att det inte finns mer att ladda
              this.setState({
                hasMore: false
              });
              this.props.createErrorMessage(
                "No more posts available.",
                "Toast"
              );
            }
            querySnapshot.forEach(doc => {
              let soundData = doc.data();
              const correctUser = usersFromDatabase.find(
                user => user.uid === soundData.user
              );
              soundData.userName = correctUser ? correctUser.displayName : "-";
              soundData.photoURL = correctUser ? correctUser.photoURL : null;
              if (soundData.time !== this.state.lastKnownKey) {
                allSounds.push(soundData);
              }
            });
          })
          .then(() =>
            this.setState(
              {
                allSounds: allSounds,
                status: "loaded"
              },
              () =>
                this.setState({
                  lastKnownKey: this.state.allSounds[
                    this.state.allSounds.length - 1
                  ].time
                })
            )
          )
          .catch(error => {
            this.props.createErrorMessage(
              "Error when fetching new sounds. See the log for more details",
              "Toast"
            );
            console.log(error);
          });
      } catch (err) {
        this.props.createErrorMessage(err, "Toast");
        console.log(err);
      }
    } else {
      this.props.createErrorMessage("No internet connection! :(", "Toast");
    }
  };

  fetchAllUsers = () => {
    return this.getAllUsers()
      .then(result => {
        return result.data.users;
      })
      .catch(err => {
        return [];
      });
  };

  // logga-ut knapp
  signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        console.log("Signed out completed");
      })
      .catch(error => {
        console.log("Error when signing out" + error);
        this.props.createErrorMessage(
          "Error when signing out " + error,
          "Toast"
        );
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
    // Visar bara posts ifall allt laddat klart. Kan med fördel användas till ljud-filerna
    let feedPage;
    switch (this.state.status) {
      case "loading":
        feedPage = (
          <div style={{ paddingTop: "50%" }}>
            <Ons.Icon spin icon="sync-alt" />
          </div>
        );
        break;
      case "loaded":
        feedPage = (
          <Navigator
            posts={this.state.posts}
            allSounds={this.state.allSounds}
            fetchAllSounds={() => this.fetchAllSounds()}
            createErrorMessage={(msg, type) =>
              this.props.createErrorMessage(msg, type)
            }
            fetchAdditionalSounds={() => this.fetchAdditionalSounds()}
            hasMore={this.state.hasMore}

          />
        );
        break;
      default:
        feedPage = <p>something wrong</p>;
        break;
    }

    return (
      <Ons.Page renderToolbar={this.renderToolbar}>
        <Ons.Tabbar
          onPreChange={({ index }) => this.setState({ index: index })}
          onPostChange={() => console.log("postChange")}
          onReactive={() => console.log("postChange")}
          position="bottom"
          index={this.state.index}
          renderTabs={(activeIndex, tabbar) => [
            {
              content: <Ons.Page key="Feed">{feedPage}</Ons.Page>,
              tab: <Ons.Tab label="Feed" icon="fa-headphones" key="FeedTab" />
            },
            {
              content: (
                <Ons.Page key="Upload">
                  <Upload
                    createErrorMessage={(message, type) =>
                      this.props.createErrorMessage(message, type)
                    }
                    updateImagesFromUnsplash={keyWord =>
                      this.updateImagesFromUnsplash(keyWord)
                    }
                  />
                </Ons.Page>
              ),
              tab: (
                <Ons.Tab label="Upload" icon="fa-microphone" key="UploadTab" />
              )
            },
            {
              content: (
                <Ons.Page key="Profile">
                  <Profile
                    createErrorMessage={(message, type) =>
                      this.props.createErrorMessage(message, type)
                    }
                  />
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
