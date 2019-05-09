import React, { Component } from "react";

// imports for OnsenUI
import * as Ons from "react-onsenui"; // Import everything and use it as 'Ons.Page', 'Ons.Button'
//import * as ons from "onsenui"; // This needs to be imported to bootstrap the components.
// Webpack CSS import
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

class ErrorPopUp extends Component {
  // inherits the posts to show from the TabContainer.jsx
  constructor(props) {
    super(props);
    
  }



  handleCancel(){
    console.log("clicked handleCancel");
  }

  renderToast(){
    return (
        <Ons.Toast isOpen={this.props.isOpen}>
          <div className="message">
            {this.props.message}
          </div>
          <button onClick={() => this.props.onCancel()}>
            Dismiss
          </button>
        </Ons.Toast>
      );
  }

  renderAlertDialog(){
    return (
      <Ons.AlertDialog isOpen={this.props.isOpen} onCancel={() => this.props.onCancel()} cancelable>
       <div className="alert-dialog-title">Warning!</div>
       <div className="alert-dialog-content">
          {this.props.message}
       </div>
       <div className="alert-dialog-footer">
         <button onClick={() => this.props.onCancel()} className="alert-dialog-button">
           Cancel
         </button>
         <button onClick={() => this.props.onCancel()} className="alert-dialog-button">
           Ok
         </button>
       </div>
     </Ons.AlertDialog>
    );
  }

  showError(){
    let toRet;
    switch(this.props.type){
      case "AlertDialog":
        toRet = this.renderAlertDialog();
        break;
      case "Toast":
        toRet =  this.renderToast();
        break;
      default:
        toRet = this.renderAlertDialog();
        break;
    }
    return toRet;
  }

  render() {
    let toReturn = this.showError();
    return (<span>{toReturn}</span>)
  }
}

export default ErrorPopUp;
