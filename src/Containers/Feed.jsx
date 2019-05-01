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
      posts: this.props.posts
    };
  }

  // renders a specific row from the dataSource in the LazyList
  // this row corresponds to a post in this.state.posts with the index supplied (done by scrolling)
  // when using > this < in the renderRow() method it refers to the LazyList object
  renderRow(index){

    let item = this.dataSource[index];

    return (
      <Ons.Card key={item.title + index}>
        <img
          src={item.picUrl}
          alt={item.title}
          style={{ width: "100%", height: "100%" }}
        />
        <div className="title right">{item.title}</div>
        <p>posted by: {item.postedBy}</p>
      </Ons.Card>
    );
  }

  // Renders a LazyList https://onsen.io/v2/api/react/LazyList.html
  renderLazyList() {
    return (
      <Ons.LazyList
        dataSource={this.state.posts}
        length={this.state.posts.length}
        renderRow={this.renderRow}
        calculateItemHeight={() => 44}
      />
    );
  }

// <<<<<<< HEAD

  // called from PullHook
  onChange(){
    console.log("onchange");
  }

  // called from PullHook
  onLoad(){
    console.log("onload");
    console.log(this);

    // to see that it works
    // this loop should be deleted / repurposed
    for (var obj of this.state.posts){
      console.log(obj);
      obj.title = Math.floor(Math.random()*10);
    }
  }


  // Used to request a new database query
  renderPullHook(){
    return (
      <Ons.PullHook 
        onChange={this.onChange} 
        onLoad={this.onLoad.bind(this)}  // bind this (the Feed.jsx object) to be able to use its methods and attributes
      >
        {
         (this.state.pullHookState === 'initial') ?
          <span >
            <Ons.Icon size={35} spin={false} icon='ion-arrow-down-a' />
            Pull down to refresh
          </span> :
          (this.state.pullHookState === 'preaction') ?
           <span>
             <Ons.Icon size={35} spin={false} icon='ion-arrow-up-a' />
             Release to refresh
          </span>
          :
          <span><Ons.Icon size={35} spin={true} icon='ion-load-d'></Ons.Icon> Loading data...</span>
        }
      </Ons.PullHook>
      );
  }

  // If we don't want to use a LazyList. NOT USED
  renderPost() {
    return (
      <div>
        {this.state.posts.map((item, index) => {
          return (
            <Ons.Card key={item.title + index}>
              <img
                src={item.picUrl}
                alt={item.title}
                style={{ width: "100%", height: "100%" }}
              />
              <p>{item.title}</p>
              <p>posted by: {item.postedBy}</p>
            </Ons.Card>
          );
        })}
      </div>

    );
  }


  // If we don't want to use a LazyList. NOT USED
  // renderPost(){
  //   return (
  //     <div>
  //       { this.state.posts.map((item, index) => {
  //         return (
  //           <Ons.Card key = {item.title + index}>
  //             <img src = {item.picUrl} alt = {item.title} style = {{width:"100%", height:"100%"}} />
  //             <p>{item.title}</p>
  //             <p>posted by: {item.postedBy}</p>
  //           </Ons.Card>
  //       );
  //       })}
  //     </div>
  //   );
  // }

  render() {

    return (
      <Ons.Page>
        {this.renderPullHook()}
        {this.renderLazyList()}
        
      </Ons.Page>
    );
    return <Ons.Page>{this.renderLazyList()}</Ons.Page>;
  }
}

export default Feed;
