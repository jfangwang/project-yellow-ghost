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
import Guest from './GuestInfo';


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
      loggedIn: false,
      userDoc: Guest,
      disable_swiping: false,
      showFooter: true,
      showNavbar: true,
    }
    this.changeToIndex = this.changeToIndex.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.changeToIndex = this.changeToIndex.bind(this);
    this.incFlipCam = this.incFlipCam.bind(this);
    this.disable_swiping = this.disable_swiping.bind(this);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.toggleFooter = this.toggleFooter.bind(this);
    this.disableNavFootSlide = this.disableNavFootSlide.bind(this);
    this.checkCurrentUser = this.checkCurrentUser.bind(this);
    this.GoogleSignIn = this.GoogleSignIn.bind(this);
    this.GoogleSignOut = this.GoogleSignOut.bind(this);
    this.startSnapShot = this.startSnapShot.bind(this);
    this.endSnapShot = this.endSnapShot.bind(this);
    this.getUserOnFirebase = this.getUserOnFirebase.bind(this);
    this.createUserOnFirebase = this.createUserOnFirebase.bind(this);
  }
  componentDidMount() {
    this.checkCurrentUser()
    window.addEventListener('resize', this.updateDimensions);
  }
  componentWillUnmount() {
    this.endSnapShot();
  }
  updateDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };
  changeToIndex(e) {
    this.setState({
      index: e,
    })
  }
  incFlipCam() {
    this.setState({flipCamCounter: this.state.flipCamCounter + 1})
  }
  disable_swiping(e) {
    this.setState({disable_swiping: e});
  }
  toggleNavbar() {
    this.setState({showNavbar: !this.state.showNavbar});
  }
  toggleFooter() {
    this.setState({showFooter: !this.state.showFooter});
  }
  disableNavFootSlide(e) {
    this.disable_swiping(e)
    this.toggleFooter();
    this.toggleNavbar();
  }

  // Firebase Functions
  checkCurrentUser() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          loggedIn: true,
        })
        this.getUserOnFirebase(user);
      } else {
        this.endSnapShot();
        this.setState({
          loggedIn: false,
          userDoc: Guest,
        })
        console.log('user signed out', this.state.userDoc);
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
  // Firestore Functions
  startSnapShot(name) {
    userSnapshot = db.collection("Users").doc(name).onSnapshot(
      { includeMetadataChanges: true },
      (doc) => {
        this.setState({userDoc: doc.data()})
        console.log('user signed in ', this.state.userDoc);
    });
  }
  endSnapShot() {
    console.log("ending snapshot");
    if (userSnapshot !== undefined) {
      userSnapshot();
    }
  }
  getUserOnFirebase(user) {
    let query = db.collection("Users").doc(user.email);
    query.get().then((doc) => {
      if (!doc.exists) {
        this.createUserOnFirebase(user)
      } else {
        this.startSnapShot(user.email);
      }
    })
  }
  createUserOnFirebase(user) {
    const c = new Date().toLocaleString()
    db.collection("Users").doc(user.email).set({
      created: c,
      name: user.displayName,
      email: user.email,
      username: user.email,
      profile_pic_url: user.photoURL,
      phoneNumber: user.phoneNumber,
      streak_emoji:  "\u{1F525}",
      sent: 0,
      received: 0,
      added_me: {},
      pending: {},
      friends: {
        [user.email]: {
            created: c,
            profile_pic_url: user.photoURL,
            name: user.displayName,
            status: "new-friend",
            streak: 0,
            sent: 0,
            received: 0,
            last_time_stamp: null,
            snaps: []
        }
      },
    })
    .then(() => {
      console.log("New user added to firebase!");
    })
  }
  render() {
		const { index, height, width, flipCamCounter, loggedIn, userDoc, disable_swiping, showNavbar, showFooter} = this.state;
    return (
      <>
        <MetaTags>
          <title>Yellow Ghost</title>
        </MetaTags>
				{showNavbar && (<Navbar
          index={index}
          incFlipCam={this.incFlipCam}
          hidden={false}
          GsignIn={this.GoogleSignIn}
          GsignOut={this.GoogleSignOut}
          userDoc={userDoc}
        />)}
				<BindKeyboardSwipeableViews
          className="slide_container"
          index={index}
          onChangeIndex={this.changeToIndex}
          disabled={disable_swiping}
          containerStyle={{height: this.state.height, WebkitOverflowScrolling: 'touch'}}
          enableMouseEvents
        >
					<div className="slide slide1">
            <Navbar/>
            <Messages
              userDoc={userDoc}
              disableNavFootSlide={this.disableNavFootSlide}
            />
          </div>
					<div className="slide slide2">
            <Camera
              index={index}
              height={height}
              width={width}
              flipCamCounter={flipCamCounter}
              userDoc={userDoc}
              disableNavFootSlide={this.disableNavFootSlide}
            />
          </div>
					<div className="slide slide3">
            <Navbar/>
            <h1>Discover</h1>
          </div>
				</BindKeyboardSwipeableViews>
				{showFooter ? <Footer index={index} changeToIndex={this.changeToIndex}/> : null}
      </>
    );
  }
}
