import React, { Component } from "react";
import CreateLogin from "./CreateLogin";
import Start from "./Start";
//import Feed from "./Feed";
//import MyProfile from "./MyProfile";
//import Upload from "./Upload";
import Loading from "./Loading";
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
        <Route path="/" exact component={Loading} />
        <Route path="/login" exact component={CreateLogin} />
        <Route path="/start" component={Start} />
      </Router>
    );
  }
}

export default App;
