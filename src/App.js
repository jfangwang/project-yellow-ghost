import React from 'react';
import Helmet from 'react-helmet';
import SwipeableViews from 'react-swipeable-views';
import { bindKeyboard } from 'react-swipeable-views-utils';
import {auth, storage, db, provider} from './Firebase.js';
import firebase from 'firebase/app';
// import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Messages from './Messages.js';
import Camera from './Camera.js';


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
      // All for Messages
      logged_in: false,
      user_friends_dict: [dummy_dict],
      user_strangers_dict: null,
      everyone_dict: [dummy_dict],
      // Properties for every user on firebase
      user_email: "Guest",
      user_name: "Guest",
      user_pic: default_pic,
      streak_emoji: "\u{1F525}",
      imgs_sent: 0,
      imgs_received: 0,
      user_friends: ["Guest@mail"]
    }
    window.addEventListener("resize", this.update);
  }

  update = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  // For Messages Component

  login = () => {
    auth.signInWithPopup(provider)
    .then((result) => {
      this.setState({
          logged_in: true,
          user_name: result.user.displayName,
          user_email: result.user.email,
          user_pic: result.user.photoURL,
          user_friends: [result.user.email],
      }, this.get_friends_list)
    })
    .catch((error) => console.log(error.message));
  }
  logout = () => {
    firebase.auth().signOut()
    this.setState({
        logged_in: false,
        streak_emoji: "\u{1F525}",
        user_name: "Guest",
        user_email: "Guest",
        user_friends_dict: [dummy_dict],
        user_strangers_dict: null,
        everyone_dict: [dummy_dict],
        user_pic: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png",
    })
  }
  check_user = () => {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            this.setState({
                user_name: user.displayName,
                user_email: user.email,
                user_pic: user.photoURL,
                logged_in: true,
            }, this.get_friends_list
            )
        }
    }.bind(this))
	}
	get_friends_list = () => {

    const userdb = db.collection("users").doc(this.state.user_email);
        userdb.get().then((doc) => {
            if (!doc.exists) {
              // It is a new user and creates a new doc
              db.collection("users").doc(this.state.user_email).set({
                  email: this.state.user_email,
                  name: this.state.user_name,
                  photoURL: this.state.user_pic,
                  streak_emoji: this.state.streak_emoji,
                  imgs_sent: 0,
                  imgs_received: 0,
                  friends: [this.state.user_email],
              })
              .catch((error) => {
                  console.log("Couldn't write user to DB, error: ", error);
              });
              this.get_all_users()
            } else {
              // User has logged in before and has friends
              this.setState({
                user_friends: doc.data()["friends"],
                imgs_sent: doc.data()["imgs_sent"],
                imgs_received: doc.data()["imgs_received"],
                streak_emoji: doc.data()["streak_emoji"],
              }, this.get_all_users);
            }

        }).catch((error) => {
            console.log("Error getting document:", error);
        });
  }
  get_all_users = () => {
    var friends_meta = [];
    var strangers_meta = [];
    var everyone_meta = [];
    var meta_idx = 0;
    var strangers_idx = 0;
    var everyone_idx = 0;
    const sender = db.collection("users");
    sender.get().then((doc) => {
        for (var i=0;i<doc.docs.length;i++) {
            if (this.state.user_friends.includes(doc.docs[i].data()['email'])) {
                friends_meta[meta_idx] = doc.docs[i].data()
                meta_idx = meta_idx + 1;
            } else {
                strangers_meta[strangers_idx] = doc.docs[i].data()
                strangers_idx = strangers_idx + 1;
            }
            everyone_meta[everyone_idx] = doc.docs[i].data()
            everyone_idx = everyone_idx + 1;
        }
        this.setState({
            user_friends_dict: friends_meta,
            user_strangers_dict: strangers_meta,
            everyone_dict: everyone_meta,
        })
    });
  }
  componentDidMount() {
      this.check_user();
  }


  render() {
    return (
      <BindKeyboardSwipeableViews enableMouseEvents style={Object.assign({width: this.state.width, height: this.state.height, position: 'absolute', top: '0%', left: '0%'})}>
        <div style={Object.assign({backgroundColor: 'white', minHeight: '100vh', width: '100%'})}>
          <Helmet>
            <meta name="viewport" content="height=device-height, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
          </Helmet>
          <Messages
            user_email={this.state.user_email}
            user_name={this.state.user_name}
            user_pic={this.state.user_pic}
            user_friends_dict={this.state.user_friends_dict}
            user_strangers_dict={this.state.user_strangers_dict}
            everyone_dict={this.state.everyone_dict}
            logged_in={this.state.logged_in}
            login={this.login.bind(this)}
            logout={this.logout.bind(this)}
            get_friends_list={this.get_friends_list.bind(this)}
            get_all_users={this.get_all_users.bind(this)}
            friends_list={this.state.user_friends}
            streak_emoji={this.state.streak_emoji}
          />
        </div>
        <div style={Object.assign({backgroundColor: 'Plum'})} >
          <Helmet>
            <meta name="viewport" content="height=device-height, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes"></meta>
          </Helmet>
          <Camera/>
        </div>
      </BindKeyboardSwipeableViews>
    );
  }
}

export default App;
