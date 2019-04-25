import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import * as firebase from "firebase/app";
import "firebase/auth";
//import config from "./secrets";

var config = {
  apiKey: "AIzaSyAJZXBhqNSQG9VplYDMM-v0cADz10r16-M",
  authDomain: "soundy-dm2518.firebaseapp.com",
  databaseURL: "https://soundy-dm2518.firebaseio.com",
  projectId: "soundy-dm2518",
  storageBucket: "soundy-dm2518.appspot.com",
  messagingSenderId: "431756069486"
};

firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
