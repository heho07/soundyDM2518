import React, { Component } from "react";
import Login from "./Login";
import CreateUser from "./CreateUser";
import Loading from "./Loading";
import TabContainer from "./Containers/TabContainer";
import ErrorPopUp from "./Containers/ErrorPopUp";
import ShowUsersPosts from "./Containers/ShowUsersPosts";
import ResetPassword from "./ResetPassword";


import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorOccured: false,
      errorMessage: "",
      errorMessageType: ""
    };
    window.addEventListener("offline", e => {
      this.createErrorMessage(
        "No internet connection detected. \nThe app won't function properly.",
        "Toast"
      );
    });
  }

  createErrorMessage(message, type) {
    this.setState({
      errorOccured: true,
      errorMessage: message,
      errorMessageType: type
    });
  }

  cancelErrorMessage() {
    this.setState({
      errorOccured: false,
      errorMessage: "",
      errorMessageType: ""
    });
  }

  render() {
    return (
      <div>
        <header className="App-header">
          <Route path="/" exact component={Loading} />
          <Route
            path="/login"
            exact
            render={props => (
              <Login
                {...props}
                createErrorMessage={(message, type) =>
                  this.createErrorMessage(message, type)
                }
                cancelErrorMessage={() => this.cancelErrorMessage()}
              />
            )}
          />
          <Route
            path="/create"
            exact
            render={props => (
              <CreateUser
                {...props}
                createErrorMessage={(message, type) =>
                  this.createErrorMessage(message, type)
                }
                cancelErrorMessage={() => this.cancelErrorMessage()}
              />
            )}
          />

          <Route 
            path = "/resetpassword"
            exact
            render = {props => (
              <ResetPassword
                {...props}
                createErrorMessage = {(message, type) => 
                  this.createErrorMessage(message, type)
                }
                cancelErrorMessage = {() => this.cancelErrorMessage()}
              />
            )}
          />

          <Route
            path="/TabContainer"
            render={props => (
              <TabContainer
                {...props}
                createErrorMessage={(message, type) =>
                  this.createErrorMessage(message, type)
                }
                cancelErrorMessage={() => this.cancelErrorMessage()}
              />
            )}
          />
          <ErrorPopUp
            type={this.state.errorMessageType}
            isOpen={this.state.errorOccured}
            message={this.state.errorMessage}
            onCancel={() => this.cancelErrorMessage()}
          />
        </header>
      </div>
    );
  }
}

export default App;

// <Route path="/TabContainer"
//         	render ={ () =>
//         		<TabContainer createErrorMessage = {() => this.createErrorMessage()} cancelErrorMessage = {() => this.cancelErrorMessage()} />
//         	}
//     	/>
