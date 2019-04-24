import * as firebase from "firebase/app";
import "firebase/auth";

export const redirectWhenOAuthChanges = history => {
  firebase.auth().onAuthStateChanged(user => {
    history.push(user ? "/start" : "/login");
  });
};
