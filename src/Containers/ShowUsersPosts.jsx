import React, { Component } from "react";

// imports for OnsenUI
import * as Ons from "react-onsenui"; // Import everything and use it as 'Ons.Page', 'Ons.Button'
//import * as ons from "onsenui"; // This needs to be imported to bootstrap the components.
// Webpack CSS import
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

class UsersPosts extends Component {
  // inherits the posts to show from the TabContainer.jsx
  constructor(props) {
    super(props);
  }

  //   // Each element to be shown in the feed
  //   renderUsersPost = () => {
  //     var listOfPosts = [];
  //     if (this.state.user) {
  //       const { uid } = this.state.user;
  //       let postsFromUser = this.db
  //         .collection("all-sounds")
  //         .where("user", "==", uid);
  //       postsFromUser.get().then(querySnapshot => {
  //         querySnapshot.forEach(doc => {
  //           let documentData = doc.data();
  //           listOfPosts.push(documentData);
  //           console.log(listOfPosts);
  //           //Lägg till de promise man får i en lista
  //           this.renderListItems();
  //         });
  //       });
  //     }
  //   };
  //
  //   renderListItems() {
  //     return this.state.listOfPosts.map(post => (
  //       <Ons.ListItem key={post.index}>
  //         <div className="left">
  //           <img src={post.imgURL} className="list-item__thumbnail" />
  //         </div>
  //         <div className="center">name</div>
  //       </Ons.ListItem>
  //     ));
  //   }
  //
  //   render() {
  //     return <Ons.List>{this.renderListItems()}</Ons.List>;
  //   }
}

export default UsersPosts;
