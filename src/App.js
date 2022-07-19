import React from "react";
import { onChildAdded, push, ref as refDatabase, set } from "firebase/database";
import { database, storage } from "./firebase";
import logo from "./logo.png";
import "./App.css";
import {
  getDownloadURL,
  ref as refStorage,
  uploadBytes,
} from "firebase/storage";
import Card from "react-bootstrap/Card";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const MESSAGE_FOLDER_NAME = "messages";
const IMAGES_FOLDER_NAME = "images";
const POSTS_FOLDER_NAME = "posts";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      posts: [],
      msgInputValue: "",
      fileInputFile: null,
      fileInputValue: "",
      textInputValue: "",
    };
  }

  componentDidMount() {
    const messagesRef = refDatabase(database, MESSAGE_FOLDER_NAME);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      //console.log(data.key, data.val);
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [
          ...state.messages,
          {
            key: data.key,
            chatMsg: data.val(),
            timestamp: new Date().toLocaleString(),
          },
        ],
      }));
    });

    const postsRef = refDatabase(database, POSTS_FOLDER_NAME);
    onChildAdded(postsRef, (data) => {
      this.setState((state) => ({
        posts: [
          ...state.posts,
          {
            key: data.key,
            value: data.val(),
          },
        ],
      }));
    });
  }

  // add handle for msgInputValue
  // handleMsgInputChange = (e) => {}

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeChatData = (e) => {
    e.preventDefault();
    const messageListRef = refDatabase(database, MESSAGE_FOLDER_NAME);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      chatMsg: e.target[0].value,
      timestamp: new Date().toLocaleString(),
    });

    //console.log(new Date().toLocaleString());
  };

  handleFileInputChange = (e) => {
    // console.log(e);
    // console.log(e.target.files[0]);
    // console.log(e.target.value);

    this.setState({
      fileInputFile: e.target.files[0],
      fileInputValue: e.target.value,
    });
  };

  handleTextInputChange = (e) => {
    console.log(e);
    this.setState({ textInputValue: e.target.value });
  };

  writePostData = (e) => {
    e.preventDefault();

    const fileRef = refStorage(
      storage,
      `${IMAGES_FOLDER_NAME}/${this.state.fileInputFile.name}`
    );

    // console.log(this.state.fileInputFile);
    // console.log(this.state.textInputValue);

    uploadBytes(fileRef, this.state.fileInputFile).then(() => {
      getDownloadURL(fileRef).then((downloadURL) => {
        // console.log("b");
        // console.log(this.state.textInputValue);
        const postListRef = refDatabase(database, POSTS_FOLDER_NAME);
        const newPostRef = push(postListRef);
        set(newPostRef, {
          imageLink: downloadURL,
          imgDesc: this.state.textInputValue,
        });
        this.setState({
          fileInputFile: null,
          fileInputValue: "",
          textInputValue: "",
        });
      });

      // console.log("Uploaded a blob or file!");
    });
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => {
      //console.log(message);

      return (
        <li key={message.key}>
          {message.chatMsg.chatMsg} {message.chatMsg.timestamp}
        </li>
      );
    });

    console.log(this.state.posts);
    console.log(this.state.textInputValue);
    console.log(this.state.fileInputFile, this.state.fileInputValue);

    let postCards = this.state.posts.map((post) => {
      console.log(post);
      return (
        <Card bg="dark" key={post.key}>
          <Card.Img src={post.value.imageLink} className="Card-Img" />
          <Card.Text>{post.value.imgDesc}</Card.Text>
        </Card>
      );
    });

    //
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          {/* TODO: Add input field and add text input as messages in Firebase */}
          <form onSubmit={this.writeChatData}>
            for chat
            <input type="text" />
            <input type="submit" />
          </form>

          <ol>{messageListItems}</ol>

          <form onSubmit={this.writePostData}>
            for upload
            <input
              type="text"
              value={this.state.textInputValue}
              onChange={this.handleTextInputChange}
            />
            <input
              type="file"
              value={this.state.fileInputValue}
              onChange={this.handleFileInputChange}
            />
            <input type="submit" />
          </form>
          {postCards}
        </header>
      </div>
    );
  }
}

export default App;
