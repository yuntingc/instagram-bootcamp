import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import "./App.css";
import AuthForm from "./AuthForm";
import Composer from "./Composer";
import NewsFeed from "./NewsFeed";
import { auth } from "../firebase";
import logo from "../logo.png";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: null,
      shouldRenderAuthForm: false,
    };
  }

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      // If user is logged in, save logged-in user to state
      if (user) {
        this.setState({ loggedInUser: user });
        return;
      }
      // Else set logged-in user in state to null
      this.setState({ loggedInUser: null });
    });
  }

  toggleAuthForm = () => {
    this.setState((state) => ({
      shouldRenderAuthForm: !state.shouldRenderAuthForm,
    }));
  };

  render() {
    const authForm = <AuthForm toggleAuthForm={this.toggleAuthForm} />;
    const composerAndNewsFeed = (
      <div>
        <Composer
          loggedInUser={this.state.loggedInUser}
          toggleAuthForm={this.toggleAuthForm}
        />
        <br />
        <NewsFeed />
      </div>
    );
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {this.state.shouldRenderAuthForm ? authForm : composerAndNewsFeed}
        </header>
      </div>
    );
  }
}

export default App;
