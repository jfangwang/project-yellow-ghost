import React from 'react';
import Helmet from 'react-helmet';
import SwipeableViews from 'react-swipeable-views';
import { bindKeyboard } from 'react-swipeable-views-utils';
import {auth, storage, db, provider} from './Firebase.js';
import firebase from 'firebase/app';
import './App.css';
import Messages from './Messages.js';
import Camera from './Camera.js';
import NavBar from './Navbar.js';
import Footer from './Footer.js';

// All the firebase calls will occur here to minimize usage

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);
var default_pic = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png"
var dummy_dict = {
  email: "Guest@project-yellow-ghost.com",
  name:"Guest",
  photoURL: default_pic,
  streak_emoji:"\u{1F525}",
  imgs_sent: 0,
  imgs_received: 0,
  friends: ['Guest@project-yellow-ghost.com'],
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // For swiping screen
      index: 0,
      height: window.innerHeight,
      width: window.innerWidth,
      mobile: false,
    }
    window.addEventListener("resize", this.update);
  }

  set_device = () => {
    if (this.state.width < this.state.height) {
      this.setState({
        mobile:true
      })
    } else {
      this.setState({
        mobile:false
      })
    }
  }

  update = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    },
    this.set_device()
    );
  };
  handleChangeIndex = index => {
    this.setState({
      index,
    });
  };
  changeToIndex(e) {
    this.setState({
      index: e
    })
  }

  render() {
    const { index } = this.state;
    return (
      <>
      <NavBar
      />
      <BindKeyboardSwipeableViews enableMouseEvents index={index} onChangeIndex={this.handleChangeIndex} style={Object.assign({width: this.state.width, height: this.state.height, position: 'absolute', top: '0%', left: '0%'})}>
        <div style={Object.assign({backgroundColor: 'white', minHeight: '100vh', width: '100%'})}>
          <Helmet>
            <meta name="viewport" content="height=device-height, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
          </Helmet>
          <Messages
          />
        </div>
        <div style={Object.assign({backgroundColor: 'Plum'})} >
          <Helmet>
            <meta name="viewport" content="height=device-height, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes"></meta>
          </Helmet>
          <Camera
          />
        </div>
      </BindKeyboardSwipeableViews>
      <Footer
        index={index}
        changeToIndex={this.changeToIndex.bind(this)}
      />
      </>
    );
  }
}

export default App;
