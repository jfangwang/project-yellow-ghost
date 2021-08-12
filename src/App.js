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
var friends_list = [];
var dummy_dict = {name:"Guest (me)", email: "Guest@project-yellow-ghost.com", friends: ['Guest@project-yellow-ghost.com'], streak_emoji:"\u{1F525}",photoURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png"}

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
      streak_image: "\u{1F525}",
      user_name: "Guest",
      user_email: "Guest",
      user_friends: [dummy_dict],
      user_strangers: null,
      everyone: [dummy_dict],
      user_pic: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png",
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
        })
        // Creates a new entry in db if user is signing up
        const userdb = db.collection("users").doc(result.user.email);
        userdb.get().then((doc) => {
            if (!doc.exists) {
                db.collection("users").doc(result.user.email).set({
                    email: result.user.email,
                    name: result.user.displayName,
                    photoURL: result.user.photoURL,
                    streak_emoji: this.state.streak_image,
                    friends: [result.user.email],
                })
                .catch((error) => {
                    console.log("Couldn't write user to DB, error: ", error);
                });
                this.get_friends_list()
            } else {
                this.get_friends_list();
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    })
    .catch((error) => console.log(error.message));
  }
  logout = () => {
    firebase.auth().signOut()
    this.setState({
        logged_in: false,
        streak_image: "\u{1F525}",
        user_name: "Guest",
        user_email: "Guest",
        user_friends: [dummy_dict],
        user_strangers: null,
        everyone: [dummy_dict],
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
            },
            this.get_friends_list,
            )
        }
    }.bind(this))
	}
	get_friends_list = () => {
			console.log("Get friends!!!!!");
			if (this.state.logged_in) {
					const friends = db.collection("users").doc(this.state.user_email);
					friends.get().then((doc) => {
							if (!doc.data().hasOwnProperty('friends')) {
									friends_list = [this.state.user_email];
									this.get_messages();
							} else {
									friends_list = doc.data()["friends"];
									this.get_messages();
							}

					});
			}

	}
	get_messages = () => {
			const sender = db.collection("users");
			var friends_meta = [];
			var strangers_meta = [];
			var everyone_meta = [];
			var meta_idx = 0;
			var strangers_idx = 0;
			var everyone_idx = 0;
			sender.get().then((doc) => {
					for (var i=0;i<doc.docs.length;i++) {
							if (friends_list.includes(doc.docs[i].data()['email'])) {
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
							user_friends: friends_meta,
							user_strangers: strangers_meta,
							everyone: everyone_meta,
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
          <Messages/>
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
