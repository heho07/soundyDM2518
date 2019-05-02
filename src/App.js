import React, { Component } from "react";
import CreateLogin from "./CreateLogin";
import Loading from "./Loading";
import TabContainer from "./Containers/TabContainer";
import ErrorPopUp from "./Containers/ErrorPopUp";

import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";

class App extends Component {

  constructor(props){
  	super(props);
  	this.state = {
	  errorOccured:false,
      errorMessage:"",
      errorMessageType:"",
  	}
  }

  createErrorMessage(message, type){
  	this.setState({
  		errorOccured:true,
  		errorMessage:message,
  		errorMessageType:type,
  	});
  }

  cancelErrorMessage(){
  	this.setState({
  		errorOccured:false,
  		errorMessage:"",
  		errorMessageType:"",
  	})
  }

  render() {
    return (
      <Router>
        <Route path="/" exact component={Loading} />
        <Route path="/login" exact 
	        render ={(props) => <CreateLogin {...props}  
        							createErrorMessage = {(message, type) => this.createErrorMessage(message, type)} 
        							cancelErrorMessage = {() => this.cancelErrorMessage()}
        						/>}
        />
        
        <Route path="/TabContainer" 
        	render ={ (props) => <TabContainer {...props}  
        							createErrorMessage = {(message, type) => this.createErrorMessage(message, type)} 
        							cancelErrorMessage = {() => this.cancelErrorMessage()}
        							/>}
        />
	    <ErrorPopUp 
	      type = {this.state.errorMessageType}
	      isOpen = {this.state.errorOccured} 
	      message = {this.state.errorMessage}
	      onCancel = {() => this.cancelErrorMessage()}
	    />
      </Router>
    );
  }
}

export default App;

// <Route path="/TabContainer" 
//         	render ={ () => 
//         		<TabContainer createErrorMessage = {() => this.createErrorMessage()} cancelErrorMessage = {() => this.cancelErrorMessage()} /> 
//         	}
//     	/>