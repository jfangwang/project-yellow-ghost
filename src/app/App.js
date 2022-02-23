import React, { Component, useEffect } from 'react';
import {auth, db, provider} from '../utils/Firebase';
import firebase from 'firebase/app';
import { collection, onSnapshot } from "firebase/firestore";
import SwipeableViews from 'react-swipeable-views';
import { bindKeyboard } from 'react-swipeable-views-utils';
import {isMobile } from 'react-device-detect';
import MetaTags from 'react-meta-tags';
import './App.css';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import Messages from '../screens/messages/Messages';
import Camera from '../screens/camera/Camera';
import Discover from '../screens/discover/Discover';


const list = [];

for (let i = 0; i < 30; i += 1) {
  list.push(<div key={i}>{`item n°${i + 1}`}</div>);
}

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);

let userSnapshot;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: window.innerHeight,
      width: window.innerWidth,
      index: 1,
      flipCamCounter: 0,
      snapshot: true,
      Yscroll: 0,
    }
  }
  componentDidMount() {
    this.checkCurrentUser()
    window.addEventListener('resize', this.updateDimensions);
  }
  componentWillUnmount() {
    this.endSnapShot();
  }
  handleScroll() {
    var doc = document.documentElement;
    var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    console.log(top);
  }
  checkCurrentUser = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('user signed in ', user);
      } else {
        console.log('user signed out');
      }
    });
  }
  GoogleSignIn = () => {
    auth.signInWithPopup(provider)
  }
  GoogleSignOut = () => {
    firebase.auth().signOut();
    console.log("sign out");
  }
  startSnapShot = (name) => {
    console.log(name);
    userSnapshot = db.collection("Users").doc(name).onSnapshot(
      { includeMetadataChanges: true },
      (doc) => {
      console.log("This is the document: ", doc.data());
    });
  }
  endSnapShot = () => {
    console.log("ending snapshot");
    if (userSnapshot !== undefined) {
      userSnapshot();
    }
  }
  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };
	handleChangeIndex = index => {
    this.setState({
      index,
    });
  }
  changeToIndex(e) {
    this.setState({
      index: e,
    })
  }
  incFlipCam = () => {
    this.setState({flipCamCounter: this.state.flipCamCounter + 1})
  }
  setYscroll = (e) => {
    this.setState({
      Yscroll: e
    })
  }
  render() {
		const { index, height, width, flipCamCounter, } = this.state;
    return (
      <>
        <MetaTags>
          <title>Yellow Ghost</title>
        </MetaTags>
				<Navbar
          position="absolute"
          height={height}
          width={width}
          index={index}
          incFlipCam={this.incFlipCam}
          GsignIn={this.GoogleSignIn.bind(this)}
          GsignOut={this.GoogleSignOut.bind(this)}
        />
				<BindKeyboardSwipeableViews
          className="slide_container"
          index={index}
          onChangeIndex={this.handleChangeIndex}
          containerStyle={{height:height, WebkitOverflowScrolling: 'touch'}}
          enableMouseEvents
        >
					<div className="slide slide1">
            <Navbar index={index}/>
            <Messages/>
          </div>
					<div className="slide slide2">
            <Camera index={index} height={height} width={width} flipCamCounter={flipCamCounter}/>
          </div>
					<div className="slide slide3">
            <Navbar index={index}/>
            <Discover/>
          </div>
				</BindKeyboardSwipeableViews>
				<Footer index={index} changeToIndex={this.changeToIndex.bind(this)}/>
      </>
    );
  }
}
