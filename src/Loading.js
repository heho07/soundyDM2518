import React, { Component } from "react";
import "./App.css";

import { redirectWhenOAuthChanges } from "./utils";

class Start extends Component {
  componentDidMount() {
    redirectWhenOAuthChanges(this.props.history);
  }

  render() {
    return <div className="App">Loading...</div>;
  }
}

export default Start;
