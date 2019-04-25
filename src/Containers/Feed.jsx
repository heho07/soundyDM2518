import React, { Component } from 'react';

// imports for OnsenUI
import * as Ons from 'react-onsenui'; // Import everything and use it as 'Ons.Page', 'Ons.Button'
import * as ons from 'onsenui'; // This needs to be imported to bootstrap the components.
// Webpack CSS import
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';


class Feed extends Component {

  constructor(props){
    super(props);
    this.state = {
      index:0,
    }
  }
  
  signOut(){
    console.log("detta ska logga ut användaren");
  }  
  // signOut() {
  //   firebase
  //     .auth()
  //     .signOut()
  //     .then(function() {
  //       console.log("Signed out completed");
  //     })
  //     .catch(function(error) {
  //       console.log("Error when signing out" + error);
  //     });
  // };

  render() {
    return (
      <Ons.Page>  
        <ons-toolbar>
          <div className="center">Soundy</div>

          <div className="right">
            <ons-toolbar-button icon="sign-out-alt" onClick={this.signOut} />
          </div>
        </ons-toolbar>
      </Ons.Page>
    );
  }
}

export default Feed;
