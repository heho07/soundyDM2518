import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
//import config from "./Config.js";
import * as firebase from "firebase/app";
import "firebase/auth";

firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.unregister();
