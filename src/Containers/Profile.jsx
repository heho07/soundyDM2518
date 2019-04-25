import React, { Component } from "react";

// imports for OnsenUI
import * as Ons from "react-onsenui"; // Import everything and use it as 'Ons.Page', 'Ons.Button'
import * as ons from "onsenui"; // This needs to be imported to bootstrap the components.
// Webpack CSS import
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

class TabContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0
    };
  }

  render() {
    return (
      <Ons.Page>
        <Ons.Tabbar
          onPreChange={({ index }) => this.setState({ index: index })}
          onPostChange={() => console.log("postChange")}
          onReactive={() => console.log("postChange")}
          position="bottom"
          index={this.state.index}
          renderTabs={(activeIndex, tabbar) => [
            {
              content: (
                <Ons.Page key="About">
                  <p>feed</p>
                </Ons.Page>
              ),
              tab: (
                <Ons.Tab label="About" icon="fa-info-circle" key="AboutTab" />
              )
            },
            {
              content: (
                <Ons.Page key="Yoga">
                  <p>upload</p>
                </Ons.Page>
              ),
              tab: (
                <Ons.Tab
                  label="Yoga"
                  icon="fa-child"
                  className="testTab"
                  key="YogaTab"
                />
              )
            },
            {
              content: (
                <Ons.Page key="Breathing">
                  <p>profile</p>
                </Ons.Page>
              ),
              tab: (
                <Ons.Tab label="Breathing" icon="fa-grin" key="BreathingTab" />
              )
            }
          ]}
        />
      </Ons.Page>
    );
  }
}

export default TabContainer;
