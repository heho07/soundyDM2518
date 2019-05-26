import React, { Component } from "react";

import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/functions";

// imports for OnsenUI
import * as Ons from "react-onsenui"; // Import everything and use it as 'Ons.Page', 'Ons.Button'
import * as ons from "onsenui"; // This needs to be imported to bootstrap the components.
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
    this.removeOnePost = firebase.functions().httpsCallable("removeOnePost");
  }

  componentDidMount() {
    this.db = firebase.firestore();
    if (this.props.user) {
      console.log(this.props.user);
      this.getUsersPost(this.props.user);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.hasFetched) {
      return true;
    } else {
      if (nextProps.user) {
        this.getUsersPost(nextProps.user);
        return false;
      }
      return true
    }
  }

  getUsersPost = user => {
    const { uid } = user;
    let postsFromUser = this.db
      .collection("all-sounds")
      .where("user", "==", uid);
    postsFromUser.get().then(querySnapshot => {
      let posts = [];
      querySnapshot.forEach(doc => {
        let documentData = doc.data();
        documentData.id = doc.id;
        posts.push(documentData);

        //Lägg till de promise man får i en lista
      });
      posts.sort((a, b) => {
        return b.time - a.time;
      });
      this.setState({ listOfPosts: posts, hasFetched: true });
    });
  };

  showDeletePostConfirmation = (post, index) => {
    ons.notification.confirm('Are you sure you want to delete this post?')
    .then(selected => {
      //Selected is 1 for OK and 0 for Cancel
      if(selected){
        this.deletePost(post, index)
      }
    })
  }

  deletePost = (post, index) => {
    //Delete post
    post.showSpinnerOnButton = true
    this.state.listOfPosts[index].showSpinnerOnButton = true;
    this.forceUpdate()
    const {id, storageUri} = post
    this.removeOnePost({id, storageUri}).then(result => {
      if(result.data.completed){
        this.setState({hasFetched: false})
      }
    })
  }

  renderListItems() {
    return this.state.listOfPosts.map((post, index) => (
      <Ons.ListItem key={post.time}>
        <div className="left">
          <img
            src={post.imgUrl}
            className="list-item__thumbnail"
            alt="thumbnail"
          />
        </div>
        <div className="center">
          <strong>
            {post.title}
            <i> #{post.keyword}</i>
          </strong>
        </div>

        {this.props.shouldShowDeleteButton && (
          <div className="right">
            <Ons.Fab
              onClick={() => this.showDeletePostConfirmation(post, index)}
              className="saveButton">
              <Ons.Icon
                spin={!!post.showSpinnerOnButton}
                icon={post.showSpinnerOnButton ? "spinner" : "trash"} />
            </Ons.Fab>
          </div>
        )}
      </Ons.ListItem>
    ));
  }

  render() {
    return (
      <div className="userList">
        <Ons.List>{this.renderListItems()}</Ons.List>
      </div>
    );
  }
}

export default ShowUsersPosts;
