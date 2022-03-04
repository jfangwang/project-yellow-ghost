import React, { Component, useEffect } from 'react';
import { auth, db, provider, storage } from '../utils/Firebase';
import firebase from 'firebase/app';
import { collection, onSnapshot } from "firebase/firestore";
import SwipeableViews from 'react-swipeable-views';
import { bindKeyboard } from 'react-swipeable-views-utils';
import { isMobile } from 'react-device-detect';
import MetaTags from 'react-meta-tags';
import './App.css';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import Messages from '../screens/messages/Messages';
import Camera from '../screens/camera/Camera';
import Discover from '../screens/discover/Discover';
import { Guest, Strangers, Everyone } from './GuestInfo';


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
      peopleList: {
        latestFriends: {},
        strangers: Strangers,
        everyone: Everyone,
      }
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
    this.edit_friends = this.edit_friends.bind(this);
    this.updatePeopleList = this.updatePeopleList.bind(this);
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
    this.setState({ flipCamCounter: this.state.flipCamCounter + 1 })
  }
  disable_swiping(e) {
    this.setState({ disable_swiping: e });
  }
  toggleNavbar() {
    this.setState({ showNavbar: !this.state.showNavbar });
  }
  toggleFooter() {
    this.setState({ showFooter: !this.state.showFooter });
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
  // Firestore Functions
  updatePeopleList() {
    // Make Strangers and Everyone List
    let friends = this.state.userDoc.friends;
    let strangers = {};
    let everyone = {};
    console.log("updating people list");
    db.collection("Users").get().then((doc) => {
      doc.docs.forEach((user) => {
        if (!Object.keys(friends).includes(user.id)) {
          strangers[user.id] = user.data()
        }
        everyone[user.id] = user.data();
      })
    }).then(() => {
      this.setState({
        peopleList: {
          latestFriends: friends,
          strangers: strangers,
          everyone: everyone,
        }
      })
    })
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
      streak_emoji: "\u{1F525}",
      sent: 0,
      received: 0,
      brokeup: {},
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
  edit_friends(action, person) {
    let peopleList = this.state.peopleList;
    let userDoc = this.state.userDoc;
    let friendDoc = {};
    let userEntry = {};
    let personEntry = {};
    let temp;
    const friendRef = db.collection("Users").doc(person);
    const userRef = db.collection("Users").doc(userDoc['email']);
    const photoRef = db.collection("Photos")
    if (!this.state.loggedIn) {
      // Guest Account

      if (action === "add") {
        temp = peopleList['strangers'][person];
        delete peopleList['strangers'][person];
        userDoc['friends'][person] = temp;
      } else if (action === "remove") {
        temp = userDoc['friends'][person];
        delete userDoc['friends'][person];
        peopleList['strangers'][person] = temp;
      }
      this.setState({
        userDoc: userDoc,
        peopleList: peopleList,
      })
    } else {
      // Logged In Account
      this.endSnapShot();
      friendRef.get().then((doc) => {
        friendDoc = doc.data();
        userEntry = {
          created: userDoc['created'],
          friendship: null,
          profile_pic_url: userDoc['profile_pic_url'],
          name: userDoc['name'],
          status: "pending",
          streak: 0,
          sent: 0,
          received: 0,
          last_time_stamp: null,
          snaps: []
        }
        personEntry = {
          created: doc.data()['created'],
          friendship: null,
          profile_pic_url: doc.data()['profile_pic_url'],
          name: doc.data()['name'],
          status: "pending",
          streak: 0,
          sent: 0,
          received: 0,
          last_time_stamp: null,
          snaps: []
        }
      }).then(() => {
        if (action === "add") {
          if (Object.keys(userDoc['brokeup']).includes(person)) {
            // Restore old friend
            temp = userDoc['brokeup'][person];
            delete userDoc['brokeup'][person];
            userDoc['friends'][person] = temp;
            if (userDoc['friends'][person]['status'] === 'sent') {
              friendDoc['friends'][userDoc['email']]['status'] = 'new';
            } else if (userDoc['friends'][person]['status'] === 'opened') {
              friendDoc['friends'][userDoc['email']]['status'] = 'received';
            } else if (userDoc['friends'][person]['status'] === 'received') {
              friendDoc['friends'][userDoc['email']]['status'] = 'opened';
            } else if (userDoc['friends'][person]['status'] === 'new') {
              friendDoc['friends'][userDoc['email']]['status'] = 'sent';
            } else {
              friendDoc['friends'][userDoc['email']]['status'] = 'new-friend';
            }
          } else {
            // Send Friend Request
            friendDoc['added_me'][userDoc['email']] = userEntry;
            userDoc['friends'][person] = personEntry;
          }
        } else if (action === "remove") {
          if (Object.keys(friendDoc['brokeup']).includes(userDoc['email'])) {
            // Friend initiated breakup
            delete friendDoc['brokeup'][userDoc['email']];
            delete userDoc['friends'][person];
            // Delete and/or update any snaps related to former friend and user
            let trash = [];
            let SentByUser = [];
            let SentByPerson = [];
            photoRef.where("sender", '==', userDoc['email']).where("sent", "array-contains", person).get().then((doc) => {
              doc.docs.forEach((photo) => {
                if (photo.data()['sent'].length == 1) {
                  trash.push(photo.id);
                } else {
                  SentByUser.push(photo.id);
                }
              })
            }).then(() => {
              photoRef.where("sender", '==', person).where("sent", "array-contains", userDoc['email']).get().then((doc) => {
                doc.docs.forEach((photo) => {
                  if (photo.data()['sent'].length == 1) {
                    trash.push(photo.id);
                  } else {
                    SentByPerson.push(photo.id);
                  }
                })
              }).then(() => {
                trash.forEach((item) => {
                  photoRef.doc(item).delete().catch(() => { });
                  storage.ref(`posts/${item}`).delete().catch(() => { })
                })
                SentByUser.forEach((item) => {
                  photoRef.doc(item).update({
                    sent: firebase.firestore.FieldValue.arrayRemove(person)
                  })
                })
                SentByPerson.forEach((item) => {
                  photoRef.doc(item).update({
                    sent: firebase.firestore.FieldValue.arrayRemove(userDoc['email'])
                  })
                })
              })
            })
          } else {
            // Initiating Breakup
            temp = userDoc['friends'][person];
            delete userDoc['friends'][person];
            userDoc['brokeup'][person] = temp;
            friendDoc['friends'][userDoc['email']]['status'] = 'not-friends';
          }
        } else if (action === "accept request") {
          // Accept Friend Request
          temp = userDoc['added_me'][person];
          delete userDoc['added_me'][person];
          userDoc['friends'][person] = temp;
          userDoc['friends'][person]['status'] = 'new-friend';
          friendDoc['friends'][userDoc['email']]['status'] = 'new-friend';
        } else if (action === "remove request") {
          // Remove Friend Request
          delete friendDoc['added_me'][userDoc['email']];
          delete userDoc['friends'][person];
        } else {
          console.log("action unknown: ", action)
        }
        // Update state variables and let firebase update values later
        this.setState({
          friends: userDoc['friends'],
        })
        // Update actions on firebase
        friendRef.update({
          added_me: friendDoc['added_me'],
          brokeup: friendDoc['brokeup'],
          friends: friendDoc['friends'],
        }).then(() => {
          userRef.update({
            brokeup: userDoc['brokeup'],
            friends: userDoc['friends'],
            added_me: userDoc['added_me'],
          }).then(() => {
            this.startSnapShot(userDoc['email']);
            temp = this.state.peopleList;
            temp['latestFriends'] = {};
            this.setState({
              peopleList: temp
            })
          })
        })
      })
    }
  }
  startSnapShot(name) {
    console.log("Starting snapshot");
    userSnapshot = db.collection("Users").doc(name).onSnapshot(
      { includeMetadataChanges: true },
      (doc) => {
        this.setState({ userDoc: doc.data() })
        if (Object.keys(this.state.peopleList['latestFriends']).length !== Object.keys(doc.data()['friends']).length) {
          // console.log(Object.keys(this.state.peopleList['latestFriends']).length)
          // console.log(Object.keys(doc.data()['friends']).length)
          this.updatePeopleList();
        }
        console.log('snapshot changed');
      });
  }
  endSnapShot() {
    if (userSnapshot !== undefined) {
      console.log("Ending snapshot");
      userSnapshot();
    }
  }

  render() {
    const { index, height, width, flipCamCounter, loggedIn, userDoc, disable_swiping, showNavbar, showFooter, peopleList } = this.state;
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
          peopleList={peopleList}
          edit_friends={this.edit_friends}
        />)}
        <BindKeyboardSwipeableViews
          className="slide_container"
          index={index}
          onChangeIndex={this.changeToIndex}
          disabled={disable_swiping}
          containerStyle={{ height: this.state.height, WebkitOverflowScrolling: 'touch' }}
          enableMouseEvents
        >
          <div className="slide slide1">
            <Navbar />
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
            <Navbar />
            <h1>Discover</h1>
          </div>
        </BindKeyboardSwipeableViews>
        {showFooter ? <Footer index={index} changeToIndex={this.changeToIndex} /> : null}
      </>
    );
  }
}
