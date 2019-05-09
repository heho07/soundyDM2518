import React, { Component } from "react";
// imports for OnsenUI
import * as Ons from "react-onsenui"; // Import everything and use it as 'Ons.Page', 'Ons.Button'
//import * as ons from "onsenui"; // This needs to be imported to bootstrap the components.
// Webpack CSS import
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

class Feed extends Component {
  // inherits the posts to show from the TabContainer.jsx
  constructor(props) {
    super(props);
    this.state = {
      foo: true,
      debounce:true,
    };
  }

  // componentDidMount(){
  //   console.log("Component did mount");
  //   console.log(window);
  //   window.addEventListener("scroll", function(event)  {
  //     console.log("scroll");
      // if (window.getDocumentById("scrollDiv") - window.getDocumentById("scrollPage").scrollTop - window.innerHeight - 400<= 0) {
      //   console.log("Should update!");
      // }
  //   });
  // }

  // renders a specific row from the dataSource in the LazyList
  // this row corresponds to a post in this.state.posts with the index supplied (done by scrolling)
  // when using > this < in the renderRow() method it refers to the LazyList object
  renderRow(index) {
    let item = this.props.allSounds[index];
    if (index === this.props.allSounds.length-1){
      console.log("Last one");
    }
    return (
      <Ons.Card key={item.time}>
        <p>posted by: {item.userName}</p>
        <p>             
          {new Date(item.time).toDateString()}{' '}
          {new Date(item.time).toLocaleTimeString()}
        </p>
        <img src = "https://i.imgur.com/hgyXyww.png" alt = "placeholderText"/>
        <audio controls onWaiting = {() => this.handleAudioWaiting()}>
          <source src = {item.url}/>
          <p>Your browser does not support audio. The file can be found at <a href = {item.url}>this link</a></p>  
        </audio>     
        
      </Ons.Card>
    );
  }

  


  // Called if the audio player has to wait due to slow internet connection
  handleAudioWaiting(){
    this.props.createErrorMessage("Slow internet connection detected.", "Toast");
  }
          

  // Renders a LazyList https://onsen.io/v2/api/react/LazyList.html
  renderLazyList() {
    // console.log(window.position)
    return (
      <Ons.LazyList
        dataSource={this.props.allSounds}
        length= {this.props.allSounds.length} 
        renderRow= {this.renderRow.bind(this)}  
        calculateItemHeight={() => 44}
      />
    );
  }

  // called from PullHook when the pullHook registers a change
  onChange() {}

  // called from PullHook when the action is performed
  async onLoad(done) {
    await this.props.fetchAllSounds();
    // await setTimeout(() => done(), 3000);
    // ^^^^ Kan användas för att testa hur olika laddningsalternativ ser ut.
    done();
  }

  // Used to request a new database query
  renderPullHook() {
    return (
      <Ons.PullHook
        onChange={this.onChange}
        onLoad={this.onLoad.bind(this)} // bind this (the Feed.jsx object) to be able to use its methods and attributes
        // onAction = {console.log("action?")}
      >
        {this.state.pullHookState === "initial" ? (
          <span>
            <Ons.Icon size={35} spin={false} icon="ion-arrow-down-a" />
            Pull down to refresh
          </span>
        ) : this.state.pullHookState === "preaction" ? (
          <span>
            <Ons.Icon size={35} spin={false} icon="ion-arrow-up-a" />
            Release to refresh
          </span>
        ) : (
          <span>
            <Ons.Icon size={35} spin={true} icon="ion-load-d" /> Loading data...
          </span>
        )}
      </Ons.PullHook>
    );
  }

  // If we don't want to use a LazyList.
  // NOT USED - might be necessary later
  renderSounds() {
    return (
      <div id = "scrollDiv">
        {this.props.allSounds.map((item, index) => {
          return (
            <Ons.Card key={item.time}>
              <p>posted by: {item.userName}</p>
              <p>             
                {new Date(item.time).toDateString()}{' '}
                {new Date(item.time).toLocaleTimeString()}
              </p>
              <img src = "https://i.imgur.com/hgyXyww.png" alt = "placeholderText"/>
              <audio controls onWaiting = {() => this.handleAudioWaiting()}>
                <source src = {item.url}/>
                <p>Your browser does not support audio. The file can be found at <a href = {item.url}>this link</a></p>  
              </audio>     
              
            </Ons.Card>
          );
        })}
      </div>
    );
  }
  // {this.renderAllSounds()}

  // Funkar jättedåligt 
  shouldFeedUpdate(){
    // if (this.state.debounce) {
    //   this.setState({
    //     debounce:false
    //   }, () => {
    //     this.setState({
    //       debounce:true,
    //     })
    //   })
    // }
    if (window.document.getElementById("scrollDiv").scrollHeight - window.document.getElementById("scrollPage").scrollTop - window.innerHeight - 400<= 0) {
      console.log("Should update!");
      this.props.fetchAdditionalSounds();
    }
    // console.log("Caliing shouldFeedUpdate");
    // console.log("window.document.getElementById(scrollDiv)" + window.document.getElementById("scrollDiv"));
  }

  render() {
    var debounce = true;
    return (
      <Ons.Page id = "scrollPage" onScroll = {()=> {
        if (debounce) {
          debounce = false;
          setTimeout(() => {
            this.shouldFeedUpdate();
            debounce = true;
          }, 1000);
        }
      }}>
        {this.renderPullHook()}
        {this.renderSounds()}
      </Ons.Page>
    );
  }
}
        // <button onClick = {() => this.props.fetchAdditionalSounds()}>Fetch more</button>

export default Feed;
