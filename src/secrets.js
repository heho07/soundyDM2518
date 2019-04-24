<div className="App">
  <div className="header">Create user</div>
  <div className="inputContainer">
    <div>Email</div>
    <input
      className="loginInput"
      type="text"
      value={this.state.email}
      onChange={event => {
        this.setState({ email: event.target.value });
      }}
    />
  </div>
  <div className="inputContainer">
    <div>Password</div>
    <input
      className="loginInput"
      type="password"
      value={this.state.password}
      onChange={event => {
        this.setState({ password: event.target.value });
      }}
    />
  </div>
  <div className="inputContainer">
    <button onClick={this.createClick}>Create Account</button>
    <button onClick={this.loginClicked}>Log in</button>
    <button onClick={this.signInWithGoogle}>Sign in with Google</button>
    <button onClick={this.signInWithFacebook}>Sign in with Facebook</button>
  </div>
</div>;
