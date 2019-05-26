import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroller";
// imports for OnsenUI
import * as Ons from "react-onsenui"; // Import everything and use it as 'Ons.Page', 'Ons.Button'
//import * as ons from "onsenui"; // This needs to be imported to bootstrap the components.
// Webpack CSS import
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";
import ImageSoundPlayer from "../Components/ImageSoundPlayer";

import ShowUsersPosts from "./ShowUsersPosts";

class Feed extends Component {
  // inherits the posts to show from the TabContainer.jsx
  constructor(props) {
    super(props);
    this.state = {
      foo: true
    };
  }

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
            <Ons.Icon
              spin
              icon="sync-alt"
              style={{ display: this.state.spinner }}
            />
          </span>
        )}
      </Ons.PullHook>
    );
  }

  // https://www.npmjs.com/package/react-infinite-scroller

  renderInfiniteScroller(that) {
    //  console.log(that);
    let items = [];
    this.props.allSounds.map((element, i) => {
      items.push(
        <ImageSoundPlayer
          item={element}
          key={element.id}
          createErrorMessage={this.props.createErrorMessage}
          pushPage={userID => this.props.pushPage(userID)}
        />
      );
    });

    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={this.loadItems.bind(this)}
        initialLoad={false} // undviker att ladda när elementet först skapas iom att vi redan har data
        hasMore={this.props.hasMore}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }
        // threshold = {1000}     // <---- om man vill sätta anpassad gräns för när den uppdaterar
        useWindow={false} // <---- MUY IMPORTANTE, annars känner den inte av scrollen
      >
        <div>{items}</div>
      </InfiniteScroll>
    );
  }

  // The function called from infiniteScroller when new items are to be loaded
  loadItems(page) {
    //console.log("Loading more items from the database");
    this.props.fetchAdditionalSounds();
  }

  render() {
    return (
      <Ons.Page>
        {this.renderPullHook()}
        {this.renderInfiniteScroller()}
      </Ons.Page>
    );
  }
}

//  en klass som antingen visar Feed eller ShowUsersPost
class Navigator extends Component {
  constructor(props) {
    super(props);
  }


  renderPage(route, navigator) {
    switch (route.component) {
      case "Feed":
        // skickar med alla props till Feed samt även hur den kan nå ShowUsersPosts
        return (
          <Feed
            key={route.component}
            {...this.props}
            pushPage={userID => this.pushPage(navigator, userID)}
          />
        );


      default:
        // om route inte är Feed så antas det att det är ett user ID och försöker visa detta.
        // visar även namn samt tillbakaknapp
        return (

        <Ons.Page key = {route.component.uid}>
          <div style = {{textAlign:"left"}} >
            <Ons.BackButton onClick = {() => navigator.popPage()} >go back</Ons.BackButton>
            <h2 style = {{display:"inline-block"}}  >{route.component.userName} </h2>
          </div>
          <ShowUsersPosts 
            user = {route.component}
            shouldShowDeleteButton={false}
            shouldShowUserName = {true}

            />
          </Ons.Page>
        );
    }
  }

  // lägger till en route i navigatorns stack
  pushPage(navigator, route) {
    navigator.pushPage({ component: route, hasBackButton: true });
  }

  render() {
    return (
      <Ons.Page>

       <Ons.Navigator
        swipeable
        renderPage={this.renderPage.bind(this)}
        initialRoute={{
          component:{uid:"Feed"},
          hasBackButton: false
        }}
      />
    </Ons.Page>

    );
  }
}

export default Navigator;
