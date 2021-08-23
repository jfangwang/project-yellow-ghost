import React from 'react';
import Helmet from 'react-helmet';
import SwipeableViews from 'react-swipeable-views';
import { bindKeyboard } from 'react-swipeable-views-utils';
import {auth, db, provider} from './Firebase.js';
import firebase from 'firebase/app';
import './App.css';
import Messages from './Messages.js';
import Camera from './Camera.js';
import {NavBar} from './Navbar.js';
import Footer from './Footer.js';

// All the firebase calls will occur here to minimize usage

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);
var default_pic = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png"
// var dummy_dict = {
//   email: "Guest@project-yellow-ghost.com",
//   name:"Guest",
//   photoURL: default_pic,
//   streak_emoji:"\u{1F525}",
//   imgs_sent: 0,
//   imgs_received: 0,
//   friends: ['Guest@project-yellow-ghost.com'],
// }

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // For swiping screen
      index: 0,
      height: window.innerHeight,
      width: window.innerWidth,
      orientation: "Landscape",
      disable_swiping: false,
      // User Info
      loggedIn: null,
      name: null,
      email: null,
      pic: null,
      received: null,
      sent: null,
      streak_emoji: null,
      created:null,
      friends: [],
      strangers: [],
      everyone: [],

    }

    this.check_user = this.check_user.bind(this);
    window.addEventListener("resize", this.update);
    window.addEventListener("beforeunload", this.end_snapshot);
    window.addEventListener("onbeforeunload", this.end_snapshot);
  }

  set_device = () => {
    if (this.state.width > this.state.height) {
      this.setState({
        orientation: "Landscape"
      })
    } else {
      this.setState({
        orientation: "Mobile"
      })
    }
  }
  update = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    },this.set_device)
  };
  handleChangeIndex = index => {
    this.setState({
      index,
    });
  };
  changeToIndex(e) {
    this.setState({
      index: e,
    })
  }
  setDisabledSwiping(e) {
    this.setState({
      disable_swiping: e,
    })
  }

  
  check_user = () => {
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
        this.setState({
          loggedIn: true,
          name: user.displayName,
          pic: user.photoURL,
          email: user.email,
        }, this.check_user_on_firebase)
			} else {
				this.setState({
          loggedIn: false,
          name: "Guest",
          email: "Guest@Guest.com",
          pic: default_pic,
          sent: 0,
          received: 0,
          streak_emoji: "\u{1F525}",
          created: new Date().toLocaleString(),
        })
			}
		}.bind(this))
	}

  check_user_on_firebase = () => {
    const user_doc = db.collection("Users").doc(this.state.email);
    user_doc.get().then((doc) => {
      if (!doc.exists) {
        // New User
        const c = new Date().toLocaleString();
        user_doc.set({
          created: c,
          name: this.state.name,
          profile_pic_url: this.state.pic,
          streak_emoji:  "\u{1F525}",
          total_sent: 0,
          total_received: 0,
          friends: {
            [this.state.email]: {
                created: c,
                profile_pic_url: this.state.pic,
                name: this.state.name,
                status: "New Friend!",
                streak: 0,
                streak_ref: null,
                sent: 0,
                received: 0,
                last_time_stamp: null,
                snaps: []
            }
          },
        })
        this.setState({
          received: 0,
          sent: 0,
          streak_emoji: "\u{1F525}",
        }, this.start_snapshot)
      } else {
        // User has logged in before
        this.setState({
          name: doc.data()["name"],
          pic: doc.data()["profile_pic_url"],
          received: doc.data()["total_received"],
          sent: doc.data()["total_sent"],
          streak_emoji: doc.data()["streak_emoji"],
          created: doc.data()["created"],
          friends: doc.data()["friends"]
        }, this.start_snapshot)
      }
    })
  }
  start_snapshot = () => {
    this.update_people_list()
    // const user_doc = db.collection("Users").doc(this.state.email);
    // user_doc.onSnapshot((doc) => {
    //   this.setState({
    //     name: doc.data()["name"],
    //     pic: doc.data()["profile_pic_url"],
    //     received: doc.data()["total_received"],
    //     sent: doc.data()["total_sent"],
    //     streak_emoji: doc.data()["emoji"],
    //     created: doc.data()["created"],
    //     friends: doc.data()["friends"],
    //   })
    //   console.log("snapshot created")
    // }, (error) => {
    //   alert("Problem with real time firebase, cannot get live updates.");
    //   console.log(error);
    // })
  }
  end_snapshot = () => {
    this.start_snapshot();
    console.log("ended snapshot");
  }
  // Updates user's Friends, Strangers, and Everyone list
  update_people_list = () => {
    var strangers = {}
    var everyone = {}
    db.collection("Users").get().then((doc) => {
      doc.docs.forEach((user) => {
        // console.log("This.friends: ", this.state.friends, user.id);
        if (!Object.keys(this.state.friends).includes(user.id)) {
          strangers[user.id] = user.data()
        }
        everyone[user.id] = user.data();
      })
      // console.log("Friends: ", friends)
      // console.log("Strangers: ", strangers)
      // console.log("Everyone: ", everyone)
      this.setState({
        strangers: strangers,
        everyone: everyone,
      })
    })
  }
  // Add or Remove Friend from this.state.friends
  edit_friends = (action, friend, value) => {
    // console.log("action", action);
    // console.log("friend", friend);
    // console.log("value", value);
    const user_doc = db.collection("Users").doc(this.state.email);
    var dict = this.state.friends;
    if (action === "add") {
      var new_friend_entry = {
        created: value.created,
        profile_pic_url: value.profile_pic_url,
        name: value.name,
        status: "New Friend!",
        streak: 0,
        streak_ref: null,
        sent: 0,
        received: 0,
        last_time_stamp: null,
        snaps: []
      }
      dict[friend] = new_friend_entry;
      // Add to firestore
      user_doc.update({friends: dict})
      // Update state for user
      this.setState({
        friends: dict,
      }, this.update_people_list)
    } else if (action === "remove") {
      delete dict[friend]
      user_doc.update({friends: dict})
      this.setState({
        friends: dict,
      }, this.update_people_list)
    }
  }

  login = () => {
    auth.signInWithPopup(provider)
    .then((result) => {
      this.setState({
        loggedIn: true,
        name: result.user.displayName,
        email: result.user.email,
        pic: result.user.photoURL,
      })
    })
  }
	logout = () => {
    firebase.auth().signOut()
    this.setState({
      loggedIn: false,
      name: "Guest",
      email: "Guest@Guest.com",
      pic: default_pic,
      sent: 0,
      received: 0,
      friends: [],
      strangers: [],
      everyone: [],
    })
  }

  componentDidMount() {
    console.log("Mounted");
    this.check_user()
  }

  render() {
    const { index } = this.state;
    return (
      <>
      <NavBar
        index={index}
        // Functions
        login={this.login.bind(this)}
        logout={this.logout.bind(this)}
        disable_swiping={this.setDisabledSwiping.bind(this)}
        edit_friends={this.edit_friends.bind(this)}
        // User Info
        loggedIn={this.state.loggedIn}
        name={this.state.name}
        email={this.state.email}
        pic={this.state.pic}
        received={this.state.received}
        sent={this.state.sent}
        created={this.state.created}
        friends={this.state.friends}
        strangers={this.state.strangers}
        everyone={this.state.everyone}
      />
      <BindKeyboardSwipeableViews disabled={this.state.disable_swiping} enableMouseEvents index={index} onChangeIndex={this.handleChangeIndex} style={Object.assign({width: this.state.width, height: this.state.height, position: 'absolute', top: '0%', left: '0%'})}>
        <div style={Object.assign({backgroundColor: 'white', minHeight: '100vh', width: '100%'})}>
          <Helmet>
            <meta name="viewport" content="height=device-height, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
          </Helmet>
          <Messages
            // User Info
            loggedIn={this.state.loggedIn}
            friends={this.state.friends}
            streak_emoji={this.state.streak_emoji}
          />
        </div>
        <div style={Object.assign({backgroundColor: 'Plum'})} >
          <Helmet>
            <meta name="viewport" content="height=device-height, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes"></meta>
          </Helmet>
          <Camera
            index={index}
            changeToIndex={this.changeToIndex.bind(this)}
            disable_swiping={this.setDisabledSwiping.bind(this)}
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
