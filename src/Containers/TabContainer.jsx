import React, { Component } from 'react';

import { redirectWhenOAuthChanges } from '../utils';

import * as firebase from 'firebase/app';
import 'firebase/auth';

import Feed from './Feed';
import Profile from './Profile';
import Upload from "./Upload";
import AudioTest from '../AudioRecorder/AudioTest';

// imports for OnsenUI
import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'
// import * as ons from "onsenui"; // This needs to be imported to bootstrap the components.
// Webpack CSS import
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';

import config from "../secrets.js";

// ES Modules syntax
import Unsplash, { toJson} from 'unsplash-js';

// require syntax


class TabContainer extends Component {
  // in the this.state.posts array we can save the results from our database queries
  // these can then automatically be shown in Feed.jsx by passing the state as a prop
  // By saving the data here we don't have to do a new API call every time we switch tabs
  constructor(props) {
    super(props);
    console.log(this.props);
    // connecting to Unsplash to get images automatically
    const Unsplash = require('unsplash-js').default;
    console.log(config);
    let unsplash = new Unsplash({
      applicationId: config.unsplashApiKeys.access_key,
      secret: config.unsplashApiKeys.secret_key
    });

    this.state = {
      currentUser: null,
      index: 0,
      posts: [
        {

          title:'dog',
          postedBy:'Herman'
        },
        {
          title:'cat',
          postedBy:'OtherUser'
        },
        {
          title:'hat',
          postedBy:'David'
        }
      ],
      unsplash: unsplash,
      status:"loading",

      // states for the audio recording
      allSounds: []
    };
  }

  // metod innehållandes kod vi kan använda när vi laddar in databasresultat?
  // returns the promise of a JSON object containing information about a picture 
  async updateImagesFromUnsplash(keyWord){
    if (!keyWord) {
      // default to something if no keywoard was supplied
      let keyWord = "sea";
      console.log("didnt detect keyWord");
    }

    // Söker efter en bild matchande det sökord som ges
    // Måste använda try-catch för att kunna fånga upp ifall API-queryn ger error
    try{
      let unsplashResult = await this.state.unsplash.search.photos(keyWord, 1, 1);
      unsplashResult = await toJson(unsplashResult);
      return unsplashResult.results[0].urls.thumb;
    }
    catch(error){
      // Ifall vi får error ge nån default bild (t.ex. ifall vi uppnåt quota för unsplashAPI)
      console.log(error);
      return 'https://i.imgur.com/1S5dGBf.png';
    }
  }

  async componentDidMount() {
    // ifall man skulle bli utloggad (tror jag /H)
    redirectWhenOAuthChanges(this.props.history);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ currentUser: user });
      } else {
        this.setState({ currentUser: null });
      }
    });

    // kopplar upp till databasen
    var storage = firebase.app().storage('gs://soundy-dm2518.appspot.com/');
    this.storageRef = storage.ref();
    this.db = firebase.firestore();

    this.fetchAllSounds();

    // kopplar en bild från unsplash till databsen
    for (var post of this.state.posts){
      console.log(post);
      let res = await this.updateImagesFromUnsplash(post.title);
      post.picUrl = res;
      this.setState({
        status:"loaded",
      });
    }
  }

  // Anropar databasen och sparar alla query-resultat i this.state
  fetchAllSounds = () => {
    var allSounds = [];
    this.db
      .collection('all-sounds')
      .orderBy('time', 'desc')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          allSounds.push(doc.data());
        });
        this.setState({ 
          allSounds: allSounds, 
        }, () => console.log(this.state.allSounds));
      });
  };


  // logga-ut knapp
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
    }

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
    switch(this.state.status){
      case "loading":
        feedPage = <p>loading</p>;
        break;
      case "loaded":
        feedPage = <Feed 
                      posts = {this.state.posts}
                      allSounds = {this.state.allSounds}
                      fetchAllSounds = {() => this.fetchAllSounds()}
                    />
        break;
      default:
        feedPage = <p>something wrong</p>
        break;
    }


  
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
                  {feedPage}

                </Ons.Page>
              ),
              tab: <Ons.Tab label="Feed" icon="fa-headphones" key="FeedTab" />
            },
            {
              content: (
                <Ons.Page key="Upload">
                  <Upload 
                    createErrorMessage = {(message, type) => this.props.createErrorMessage(message, type)}
                    cancelErrorMessage = {() => this.props.cancelErrorMessage()}
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
