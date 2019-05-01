import React, { Component } from 'react';
import CreateLogin from './CreateLogin';
//import Start from "./Start";
import Loading from './Loading';
import TabContainer from './Containers/TabContainer';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <Route path="/" exact component={Loading} />
        <Route path="/login" exact component={CreateLogin} />
        <Route path="/TabContainer" component={TabContainer} />
      </Router>
    );
  }
}

export default App;
