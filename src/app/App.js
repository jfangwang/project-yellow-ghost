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
import { objectMethod } from '@babel/types';


const list = [];

for (let i = 0; i < 30; i += 1) {
  list.push(<div key={i}>{`item n°${i + 1}`}</div>);
}

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);

let userSnapshot;
let everyoneSnapshot;

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
      updateCounter: 0,
      peopleList: {
        friends: Guest.friends,
        strangers: Strangers,
        everyone: Everyone,
      }
    }
    this.changeToIndex = this.changeToIndex.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
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
    this.setUserDoc = this.setUserDoc.bind(this);
    this.startEveryoneSS = this.startEveryoneSS.bind(this);
    this.endEveryoneSS = this.endEveryoneSS.bind(this);
    this.updateRelatedSnaps = this.updateRelatedSnaps.bind(this);
    this.incUpdateCount = this.incUpdateCount.bind(this);
    this.toggleSnapShot = this.toggleSnapShot.bind(this);
  }
  componentDidMount() {
    this.checkCurrentUser()
    window.addEventListener('resize', this.updateDimensions);
  }
  componentWillUnmount() {
    this.endSnapShot();
    this.endEveryoneSS();
  }
  updateDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevState.userDoc !== this.state.userDoc) {
      if (prevState.userDoc && ((Object.keys(prevState.userDoc['added_me']).length) !== (Object.keys(this.state.userDoc['added_me']).length))) {
        this.updatePeopleList();
      }
    }
  }
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
  toggleNavbar(e) {
    if (e === true || e === false) {
      this.setState({ showNavbar: !e });
    } else {
      this.setState({ showNavbar: !this.state.showNavbar });
    }
  }
  toggleFooter(e) {
    if (e === true || e === false) {
      this.setState({ showFooter: !e });
    } else {
      this.setState({ showFooter: !this.state.showFooter });
    }
  }
  disableNavFootSlide(e) {
    this.disable_swiping(e)
    this.toggleFooter(e);
    this.toggleNavbar(e);
  }
  setUserDoc(e) {
    this.setState({
      userDoc: e
    })
  }
  incUpdateCount() {
    const num = this.state.updateCounter;
    this.setState({ updateCounter: num + 1 })
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
        this.endEveryoneSS();
        this.setState({
          loggedIn: false,
          userDoc: Guest,
          peopleList: {
            friends: Guest.friends,
            strangers: Strangers,
            everyone: Everyone,
          }
        })
        console.log('user signed out');
      }
    });
  }
  getUserOnFirebase(user) {
    let query = db.collection("Users").doc(user.uid);
    query.get().then((doc) => {
      if (!doc.exists) {
        this.createUserOnFirebase(user)
      } else {
        this.startSnapShot(user);
        this.startEveryoneSS();
      }
    })
  }
  createUserOnFirebase(user) {
    console.log("new user incoming")
    const c = new Date().toLocaleString()
    db.collection("Users").doc(user.uid).set({
      created: c,
      name: user.displayName,
      email: user.email,
      friendship: c,
      id: user.uid,
      username: user.email,
      profile_pic_url: user.photoURL,
      phoneNumber: user.phoneNumber,
      received: 0,
      sent: 0,
      streak_emoji: "\u{1F525}",
      brokeup: {},
      added_me: {},
      pending: {},
      deleteSnaps: [],
      friends: {
        [user.uid]: {
          id: user.uid,
          created: c,
          email: user.email,
          name: user.displayName,
          phoneNumber: user.phoneNumber,
          profile_pic_url: user.photoURL,
          username: user.email,
          nickname: null,
          status: "new-friend",
          streak: 0,
          streakRef: [],
          sent: 0,
          received: 0,
          last_time_stamp: null,
          snaps: {},
        }
      },
    })
      .then(() => {
        db.collection("Users").doc("Everyone").update({
          [`all_users.${user.uid}`]: {
            created: c,
            name: user.displayName,
            email: user.email,
            username: user.email,
            profile_pic_url: user.photoURL,
            phoneNumber: user.phoneNumber,
          },
        }).then(() => {
          console.log("Everyone Doc Updated");
          this.startSnapShot(user)
          this.startEveryoneSS();
        })
          .catch(() => {
            db.collection("Users").doc("Everyone").set({
              all_users: {
                [`${user.uid}`]: {
                  created: c,
                  name: user.displayName,
                  email: user.email,
                  username: user.email,
                  profile_pic_url: user.photoURL,
                  phoneNumber: user.phoneNumber,
                },
              }
            }).then(() => {
              console.log("Everyone Doc Created")
              this.startSnapShot(user)
              this.startEveryoneSS();
            })
              .catch((error) => console.log("Error: ", error))
          })
      })
  }
  toggleSnapShot(e) {
    let d = {
      uid: this.state.userDoc['id']
    }
    if (e === true) {
      this.startSnapShot(d);
    } else if (e === false) {
      this.endSnapShot();
    }
  }
  startSnapShot(user) {
    console.log("Starting snapshot");
    userSnapshot = db.collection("Users").doc(user.uid).onSnapshot(
      { includeMetadataChanges: false },
      (doc) => {
        this.incUpdateCount();
        console.log('user snapshot updated. Update Count: ', this.state.updateCounter);
        this.setState({ userDoc: doc.data() })
        if ((Object.keys(this.state.peopleList['friends']).sort() !== Object.keys(doc.data()['friends']).sort())) {
          this.updatePeopleList();
        }
        if (this.state.updateCounter === 1 && this.state.userDoc['deleteSnaps'].length > 0) {
          this.state.userDoc['deleteSnaps'].forEach((id) => {
            db.collection("Photos").doc(id).delete();
            storage.ref(`posts/${id}`).delete();
          })
          db.collection("Users").doc(this.state.userDoc['id']).update({
            deleteSnaps: [],
          })
          console.log("Deleted trashed snaps")
        }
      }, (err) => console.log("error: ", err))
  }
  endSnapShot() {
    if (userSnapshot !== undefined) {
      console.log("Ending userSnapshot");
      userSnapshot();
    }
  }
  startEveryoneSS() {
    console.log("Starting Everyone SS");
    everyoneSnapshot = db.collection("Users").doc("Everyone").onSnapshot(
      { includeMetadataChanges: false },
      (doc) => {
        console.log('everyone snapshot changed');
        let temp = this.state.peopleList;
        temp['everyone'] = doc.data()['all_users'];
        this.setState({ peopleList: temp });
        this.updatePeopleList();
      },
      (err) => console.log("error: ", err)
    )
  }
  endEveryoneSS() {
    if (everyoneSnapshot !== undefined) {
      console.log("Ending Everyone SS");
      everyoneSnapshot();
      this.updatePeopleList()
    }
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
    let everyone = this.state.peopleList.everyone;
    let s_keys = Object.keys(everyone).filter(function (obj) { return Object.keys(friends).indexOf(obj) == -1; });
    s_keys.forEach((id) => {
      strangers[id] = everyone[id];
    })
    this.setState({
      peopleList: {
        friends: friends,
        strangers: strangers,
        everyone: everyone,
      }
    })
    // console.log("updated people list");
  }
  updateRelatedSnaps(user, person) {
    // Delete and/or update any snaps between id1 and id2
    const photoRef = db.collection("Photos");
    let trash = [];
    let SentByUser = [];
    let SentByPerson = [];
    photoRef.where("sender", '==', user).where("sent", "array-contains", person).get().then((doc) => {
      doc.docs.forEach((photo) => {
        if (photo.data()['sent'].length == 1) {
          trash.push(photo.id);
        } else {
          SentByUser.push(photo.id);
        }
      })
    }).then(() => {
      photoRef.where("sender", '==', person).where("sent", "array-contains", user).get().then((doc) => {
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
            sent: firebase.firestore.FieldValue.arrayRemove(user)
          })
        })
      })
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
    const userRef = db.collection("Users").doc(userDoc['id']);
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
      // On Firebase
      userEntry = {
        id: userDoc['id'],
        created: userDoc['created'],
        friendship: null,
        profile_pic_url: userDoc['profile_pic_url'],
        name: userDoc['name'],
        username: userDoc['username'],
        phoneNumber: userDoc['phoneNumber'],
        status: "pending",
        streak: 0,
        sent: 0,
        received: 0,
        last_time_stamp: null,
        snaps: []
      };
      if (action === "add") {
        if (Object.keys(userDoc['brokeup']).includes(person)) {
          // Restore old friend
          delete peopleList['strangers'][person];
          temp = userDoc['brokeup'][person];
          delete userDoc['brokeup'][person];
          userDoc['friends'][person] = temp;
          let status = 'new-friend';
          if (userDoc['friends'][person]['status'] === 'sent') {
            status = 'new';
          } else if (userDoc['friends'][person]['status'] === 'opened') {
            status = 'received';
          } else if (userDoc['friends'][person]['status'] === 'received') {
            status = 'opened';
          } else if (userDoc['friends'][person]['status'] === 'new') {
            status = 'sent';
          }
          friendRef.update({ [`friends.${userDoc['id']}.status`]: status }).catch((e) => console.log("err: ", e))
          userRef.update({ brokeup: userDoc['brokeup'], friends: userDoc['friends'] }).catch((e) => console.log("err: ", e))
        } else {
          // Send Friend Request
          if (person !== userDoc['id']) {
            friendRef.get().then((doc) => {
              if (doc.exists) {
                personEntry = {
                  id: doc.data()['id'],
                  created: doc.data()['created'],
                  friendship: null,
                  profile_pic_url: doc.data()['profile_pic_url'],
                  name: doc.data()['name'],
                  username: doc.data()['username'],
                  phoneNumber: doc.data()['phoneNumber'],
                  status: "pending",
                  streak: 0,
                  sent: 0,
                  received: 0,
                  last_time_stamp: null,
                  snaps: []
                };
                userRef.set({ "friends": { [`${person}`]: personEntry } }, { merge: true }).then(() => {
                  delete peopleList['strangers'][person];
                  friendRef.set({ "added_me": { [`${userDoc['id']}`]: userEntry } }, { merge: true }).catch((e) => console.log("err: ", e))
                }).catch((e) => console.log("err: ", e))
              }
            }).catch((e) => console.log("err: ", e))
          } else {
            console.log("Cannot add yourself");
          }
        }
      } else if (action === "remove") {
        friendRef.get().then((doc) => { friendDoc = doc.data() }).then(() => {
          if (Object.keys(friendDoc['brokeup']).includes(userDoc['id'])) {
            // Friend Initiated Breakup
            peopleList['strangers'][person] = userDoc['friends'][person];
            friendRef.update({ [`brokeup.${userDoc['id']}`]: firebase.firestore.FieldValue.delete() }).catch((e) => console.log("err: ", e));
            userRef.update({ [`friends.${person}`]: firebase.firestore.FieldValue.delete() }).catch((e) => console.log("err: ", e))
            this.updateRelatedSnaps(person, userDoc['id']);
          } else {
            // Initiating Breakup
            if (person !== userDoc['id']) {
              friendRef.update({ [`friends.${userDoc['id']}.status`]: 'not-friends' }).catch((e) => console.log("err: ", e))
              peopleList['strangers'][person] = userDoc['friends'][person];
              temp = userDoc['friends'][person];
              delete userDoc['friends'][person];
              userDoc['brokeup'][person] = temp;
              userRef.update({ brokeup: userDoc['brokeup'], friends: userDoc['friends'] }).catch((e) => console.log("err: ", e))
            } else {
              console.log("Cannot remove yourself")
            }
          }
        }).catch((e) => console.log("err: ", e))
      } else if (action === "accept request") {
        // Accept Friend Request
        let ts = new Date().toLocaleString()
        friendRef.update({ [`friends.${userDoc['id']}.status`]: 'new-friend', [`friends.${userDoc['id']}.friendship`]: ts }).catch((e) => console.log("err: ", e))
        temp = userDoc['added_me'][person];
        delete userDoc['added_me'][person];
        userDoc['friends'][person] = temp;
        userDoc['friends'][person]['status'] = 'new-friend';
        userRef.update({ added_me: userDoc['added_me'], friends: userDoc['friends'], [`friends.${person}.friendship`]: ts }).catch((e) => console.log("err: ", e))
      } else if (action === "remove request") {
        // Remove Friend Request
        friendRef.update({ [`added_me.${userDoc['id']}`]: firebase.firestore.FieldValue.delete() }).catch((e) => console.log("err: ", e))
        peopleList['strangers'][person] = userDoc['friends'][person];
        delete userDoc['friends'][person];
        userRef.update({ friends: userDoc['friends'] }).catch((e) => console.log("err: ", e))
      } else {
        console.log("action unknown: ", action)
      }
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
              height={height}
              width={width}
              loggedIn={loggedIn}
              toggleSnapShot={this.toggleSnapShot}
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
              setUserDoc={this.setUserDoc}
              changeToIndex={this.changeToIndex}
              toggleSnapShot={this.toggleSnapShot}
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
