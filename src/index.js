import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import config from "./secrets";
import * as firebase from "firebase/app";
import "firebase/auth";

firebase.initializeApp(config.config);

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.unregister();
