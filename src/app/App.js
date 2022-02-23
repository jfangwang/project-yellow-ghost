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
      loggedIn: false,
      userInfo: {},
      userDoc: {}
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
  // Firebase Functions
  checkCurrentUser = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          loggedIn: true,
          userInfo: user,
        })
        console.log('user signed in ', this.state.userInfo);
        this.getUserOnFirebase(user);
      } else {
        this.setState({
          loggedIn: false,
          userInfo: {},
        })
        console.log('user signed out', this.state.userInfo);
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
  startSnapShot = (name) => {
    console.log("Starting Snapshot")
    userSnapshot = db.collection("Users").doc(name).onSnapshot(
      { includeMetadataChanges: true },
      (doc) => {
        this.setState({userDoc: doc.data()})
    });
  }
  endSnapShot = () => {
    console.log("ending snapshot");
    if (userSnapshot !== undefined) {
      userSnapshot();
    }
  }
  getUserOnFirebase = (user) => {
    let query = db.collection("Users").doc(user.email);
    query.get().then((doc) => {
      if (!doc.exists) {
        this.createUserOnFirebase(user)
      } else {
        this.startSnapShot(user.email);
      }
    })
  }
  createUserOnFirebase = (user) => {
    const name = user.displayName;
    const photo = user.photoURL;
    const c = new Date().toLocaleString()
    db.collection("Users").doc(user.email).set({
      created: c,
      name: name,
      profile_pic_url: photo,
      streak_emoji:  "\u{1F525}",
      sent: 0,
      received: 0,
      added_me: {},
      pending: {},
      friends: {
        [user.email]: {
            created: c,
            profile_pic_url: photo,
            name: name,
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
		const { index, height, width, flipCamCounter, loggedIn, userInfo} = this.state;
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
          loggedIn={loggedIn}
          userInfo={userInfo}
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
