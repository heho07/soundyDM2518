import React, { Component } from "react";

import * as firebase from "firebase/app";
import "firebase/firestore";

// imports for OnsenUI
import * as Ons from "react-onsenui"; // Import everything and use it as 'Ons.Page', 'Ons.Button'
//import * as ons from "onsenui"; // This needs to be imported to bootstrap the components.
// Webpack CSS import
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

class ShowUsersPosts extends Component {
  // inherits the posts to show from the TabContainer.jsx
  constructor(props) {
    super(props);
    this.state = {
      hasFetched: false,
      listOfPosts: []
    };
  }

  componentDidMount() {
    this.db = firebase.firestore();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.hasFetched) {
      return true;
    } else {
      if (nextProps.user) {
        this.getUsersPost(nextProps.user);
        return false;
      }
    }
  }

  getUsersPost = user => {
    const { uid } = user;
    let postsFromUser = this.db
      .collection("all-sounds")
      .where("user", "==", uid);
    return postsFromUser.get().then(querySnapshot => {
      let posts = [];
      querySnapshot.forEach(doc => {
        let documentData = doc.data();
        console.log(documentData);
        posts.push(documentData);

        //Lägg till de promise man får i en lista
      });
      posts.sort((a, b) => {
        return b.time - a.time;
      });
      this.setState({ listOfPosts: posts, hasFetched: true });
    });
  };

  renderListItems() {
    console.log("renderListItems");

    return this.state.listOfPosts.map(post => (
      <Ons.ListItem key={post.time}>
        <div className="left">
          <img src={post.imgUrl} className="list-item__thumbnail" />
        </div>
        <div className="center">
          <strong>
            {post.title}
            <i> #{post.keyword}</i>
          </strong>
        </div>

        {this.props.shouldShowDeleteButton && (
          <div className="right">
            <Ons.Fab onClick={this.upload} className="saveButton">
              <Ons.Icon icon="trash" />
            </Ons.Fab>
          </div>
        )}
      </Ons.ListItem>
    ));
  }

  render() {
    return <Ons.List>{this.renderListItems()}</Ons.List>;
  }
}

export default ShowUsersPosts;
