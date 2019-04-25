import React, { Component } from "react";
import CreateLogin from "./CreateLogin";
import Start from "./Start";
//import Feed from "./Feed";
//import MyProfile from "./MyProfile";
//import Upload from "./Upload";
import Loading from "./Loading";
import { BrowserRouter as Router, Route } from "react-router-dom";

import TabContainer from "./Containers/TabContainer";
// <<<<<<< HEAD
//       <Router>
//         <Route path="/" exact component={Loading} />
//         <Route path="/login" exact component={CreateLogin} />
//         <Route path="/start" component={Start} />
//       </Router>
// =======

class App extends Component {
  render() {
    return (

      <div className="App">
        {/*<header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>*/}
        <TabContainer/>

      </div>
    );
  }
}

export default App;
