import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { bindKeyboard } from 'react-swipeable-views-utils';
import {auth, db, provider} from '../Util/Firebase.js';
import firebase from 'firebase/app';
import './App.css';
import Messages from '../Screens/Messages/Messages.js';
import {Camera} from '../Screens/Camera/Camera.js';
import {NavBar} from '../Components/Navbar/Navbar.js';
import Footer from '../Components/Footer/Footer.js';
import Guest from '../Assets/images/guest-profile-pic.png';
import Rick from '../Assets/images/rick-profile-pic.jpg';
import Morty from '../Assets/images/morty-profile-pic.jpg';
import { isMobile } from 'react-device-detect';
import MetaTags from 'react-meta-tags';

// All the firebase calls will occur here to minimize usage

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // For swiping screen
      index: 0,
      disable_swiping: false,
      height: window.innerHeight,
      width: window.innerWidth,
      // Camera
      faceMode: "user",
      mirrored: "true",
      flip_counter: 0,
      // Navbar
      showNavbar: true,
      showFooter: true,
      // User Info
      loggedIn: false,
      name: "Guest",
      email: "Guest@Guest.com",
      pic: Guest,
      streak_emoji:  "\u{1F525}",
      added_me: {},
      pending: {},
      created:null,
      friends: {},
      pic: null,
      streak_emoji: null,
      received: 0,
      sent: 0,
      // Lists
      strangers: {},
      everyone: {},
    }

    this.check_user = this.check_user.bind(this);
    window.addEventListener("resize", this.update);
    window.addEventListener("beforeunload", this.end_snapshot);
    window.addEventListener("onbeforeunload", this.end_snapshot);
  }
  check_user = () => {
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
        // Loading in known user
        this.setState({
          loggedIn: true,
          name: user.displayName,
          pic: user.photoURL,
          email: user.email,
        }, this.check_user_on_firebase)
			} else {
        // Setting up guest account
        var creation = new Date().toLocaleString();
				this.setState({
          loggedIn: false,
          created: creation,
          name: "Guest",
          email: "Guest@Guest.com",
          pic: Guest,
          streak_emoji:  "\u{1F525}",
          sent: 0,
          received: 0,
          added_me: {},
          pending: {},
          friends: {
            "Guest@Guest.com": {
                created: creation,
                profile_pic_url: Guest,
                name: "Guest",
                status: "new-friend",
                streak: 0,
                streak_ref: null,
                sent: 0,
                received: 0,
                last_time_stamp: null,
                snaps: []
            },
            "Guest1@Guest.com": {
                created: creation,
                profile_pic_url: Guest,
                name: "Guest",
                status: "new-friend",
                streak: 0,
                streak_ref: null,
                sent: 0,
                received: 0,
                last_time_stamp: null,
                snaps: []
            },
            "Guest2@Guest.com": {
                created: creation,
                profile_pic_url: Guest,
                name: "Guest",
                status: "new-friend",
                streak: 0,
                streak_ref: null,
                sent: 0,
                received: 0,
                last_time_stamp: null,
                snaps: []
            },
            "Guest3@Guest.com": {
                created: creation,
                profile_pic_url: Guest,
                name: "Guest",
                status: "new-friend",
                streak: 0,
                streak_ref: null,
                sent: 0,
                received: 0,
                last_time_stamp: null,
                snaps: []
            },
            "Guest4@Guest.com": {
                created: creation,
                profile_pic_url: Guest,
                name: "Guest",
                status: "new-friend",
                streak: 0,
                streak_ref: null,
                sent: 0,
                received: 0,
                last_time_stamp: null,
                snaps: []
            },
            "Guest5@Guest.com": {
              created: creation,
              profile_pic_url: Guest,
              name: "Guest",
              status: "new-friend",
              streak: 0,
              streak_ref: null,
              sent: 0,
              received: 0,
              last_time_stamp: null,
              snaps: []
          },
          "Guest6@Guest.com": {
              created: creation,
              profile_pic_url: Guest,
              name: "Guest",
              status: "new-friend",
              streak: 0,
              streak_ref: null,
              sent: 0,
              received: 0,
              last_time_stamp: null,
              snaps: []
          },
          "Guest7@Guest.com": {
              created: creation,
              profile_pic_url: Guest,
              name: "Guest",
              status: "new-friend",
              streak: 0,
              streak_ref: null,
              sent: 0,
              received: 0,
              last_time_stamp: null,
              snaps: []
          },

          },
          strangers: {
            "Rick@Guest.com": {
              created: creation,
              profile_pic_url: Rick,
              name: "Rick",
              status: "new-friend",
              streak: 0,
              streak_ref: null,
              sent: 0,
              received: 0,
              last_time_stamp: null,
              snaps: []
            },
            "Morty@Guest.com": {
              created: creation,
              profile_pic_url: Morty,
              name: "Morty",
              status: "new-friend",
              streak: 0,
              streak_ref: null,
              sent: 0,
              received: 0,
              last_time_stamp: null,
              snaps: []
            },
          },
          everyone: {
            "Guest@Guest.com": {
                created: creation,
                profile_pic_url: Guest,
                name: "Guest",
                status: "new-friend",
                streak: 0,
                streak_ref: null,
                sent: 0,
                received: 0,
                last_time_stamp: null,
                snaps: []
            },
            "Rick@Guest.com": {
              created: creation,
              profile_pic_url: Rick,
              name: "Rick",
              status: "new-friend",
              streak: 0,
              streak_ref: null,
              sent: 0,
              received: 0,
              last_time_stamp: null,
              snaps: []
            },
            "Morty@Guest.com": {
              created: creation,
              profile_pic_url: Morty,
              name: "Morty",
              status: "new-friend",
              streak: 0,
              streak_ref: null,
              sent: 0,
              received: 0,
              last_time_stamp: null,
              snaps: []
            }
          },
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
          sent: 0,
          received: 0,
          added_me: {},
          pending: {},
          friends: {
            [this.state.email]: {
                created: c,
                profile_pic_url: this.state.pic,
                name: this.state.name,
                status: "new-friend",
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
          added_me: {},
          pending: {},
          friends: {
            [this.state.email]: {
              created: c,
              profile_pic_url: this.state.pic,
              name: this.state.name,
              status: "new-friend",
              streak: 0,
              streak_ref: null,
              sent: 0,
              received: 0,
              last_time_stamp: null,
              snaps: [],
            }
          },
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
          friends: doc.data()["friends"],
          pending: doc.data()["pending"],
          added_me: doc.data()["added_me"],
        }, this.start_snapshot)
      }
    })
  }
  start_snapshot = () => {
    const user_doc = db.collection("Users").doc(this.state.email);
    if (this.state.loggedIn) {
      user_doc.onSnapshot((doc) => {
        this.setState({
          name: doc.data()["name"],
          pic: doc.data()["profile_pic_url"],
          received: doc.data()["total_received"],
          sent: doc.data()["total_sent"],
          streak_emoji: doc.data()["streak_emoji"],
          created: doc.data()["created"],
          friends: doc.data()["friends"],
          pending: doc.data()["pending"],
          added_me: doc.data()["added_me"],
        })
        console.log("snapshot created");
        this.update_people_list();
      }, (error) => {
        alert("Problem with real time firebase, cannot get live updates.");
        console.log(error);
      })
    }
  }
  end_snapshot = () => {
    this.start_snapshot();
    console.log("ended snapshot");
  }
  // Updates user's Friends, Strangers, and Everyone list
  update_people_list = () => {
    if (this.state.loggedIn) {
      var f = {}
      var strangers = {}
      var everyone = {}
      var added_me = {}
      db.collection("Users").get().then((doc) => {
        doc.docs.forEach((user) => {
          // console.log("This.friends: ", this.state.friends, user.id);
          if (!Object.keys(this.state.friends).includes(user.id)) {
            strangers[user.id] = user.data()
          } else {
            f[user.id] = user.data()
          }
          everyone[user.id] = user.data();
          
          if (this.state.email === user.id) {
            added_me = user.data()["added_me"]
            // console.log("Added me", user.data()["added_me"])
          }
        })
        // console.log("Friends: ", f)
        // console.log("Strangers: ", strangers)
        // console.log("Everyone: ", everyone)
        
        this.setState({
          // friends: f,
          added_me: added_me,
          strangers: strangers,
          everyone: everyone,
        })
      })
    } 
  }
  // Add or Remove Friend from this.state.friends
  edit_friends = (action, friend, value) => {
    // console.log("action", action);
    // console.log("friend", friend);
    // console.log("value", value);
    const user_doc = db.collection("Users").doc(this.state.email);
    const friend_doc = db.collection("Users").doc(friend);
    // New friends entire document in dictionary form
    var friend_dict = {};
    var dict = this.state.friends;
    // var pending = this.state.pending;
    var added_me = this.state.added_me;
    var new_friend_entry = {}

    if (action === "pending" && !this.state.loggedIn) {
      this.state.friends[friend] = value
      delete this.state.strangers[friend]
      this.setState({
        friends:this.state.friends,
        strangers: this.state.strangers,
      })
    } else if (action === "remove" && !this.state.loggedIn) {
      value["received"] = 0
      value["snaps"] = []
      value["status"] = "new-friend";
      value["last_time_stamp"] = null;

      this.state.strangers[friend] = value

      delete this.state.friends[friend]
      this.setState({
        friends:this.state.friends,
        strangers: this.state.strangers,
      })
    } else if (action === "pending" && this.state.loggedIn) {
      // Check if potential friend still has user on their friend list (unfriended situation)
      friend_doc.get().then((doc) => {
        if (Object.keys(doc.data()["friends"]).includes(this.state.email)) {
          // add friend
          var new_friend_entry = {
            created: value.created,
            profile_pic_url: value.profile_pic_url,
            name: value.name,
            status: "new-friend",
            streak: 0,
            streak_ref: null,
            sent: 0,
            received: 0,
            last_time_stamp: null,
            snaps: []
          }
          dict[friend] = new_friend_entry;
          user_doc.update({friends: dict});

          // Get pending friend's doc info
          friend_doc.get().then((doc) => {
            friend_dict = doc.data()
            // Add user to pending friend's pending list
            friend_dict["friends"][this.state.email]["status"] = "new-friend";
            friend_doc.update({
              friends: friend_dict["friends"],
            })
          })
          // Update local added_me and friends list
          this.setState({
            friends: dict,
          }, this.update_people_list)
        } else {
           // Add user's pending friend to user's friends list and change status to pending
          new_friend_entry = {
            created: value.created,
            profile_pic_url: value.profile_pic_url,
            name: value.name,
            status: "pending",
            streak: null,
            streak_ref: null,
            sent: 0,
            received: 0,
            last_time_stamp: null,
            snaps: []
          }
          dict[friend] = new_friend_entry;
          user_doc.update({friends: dict})

          // Get pending friend's doc info
          friend_doc.get().then((doc) => {
            friend_dict = doc.data()
            // Add user to pending friend's pending list
            friend_dict["added_me"][this.state.email] = dict[this.state.email];
            friend_doc.update({
              added_me: friend_dict["added_me"],
            })
          })
          this.setState({
            friends: dict,
          }, this.update_people_list)
        }
      })
    } else if (action === "add" && this.state.loggedIn) {

      // Add a entry for new friend under user's friends
      new_friend_entry = {
        created: value.created,
        profile_pic_url: value.profile_pic_url,
        name: value.name,
        status: "new-friend",
        streak: 0,
        streak_ref: null,
        sent: 0,
        received: 0,
        last_time_stamp: null,
        snaps: []
      }
      dict[friend] = new_friend_entry;
      // delete friend from added_me list
      delete added_me[friend]
      // Update added_me and friends list to firestore
      user_doc.update({friends: dict, added_me: added_me})

      // Update user on friend's friends list
      friend_doc.get().then((doc) => {
        friend_dict = doc.data();
        friend_dict["friends"][this.state.email]["status"] = "new-friend";
        friend_dict["friends"][this.state.email]["streak"] = 0;
        friend_doc.update({friends: friend_dict["friends"]})
      })

      // Update local added_me and friends list
      this.setState({
        friends: dict,
      }, this.update_people_list)

    } else if (action === "remove pending" && this.state.loggedIn) {
      delete dict[friend]
      user_doc.update({friends: dict})
      friend_doc.get().then((doc) => {
        friend_dict = doc.data();
        delete friend_dict["added_me"][this.state.email];
        friend_doc.update({added_me: friend_dict["added_me"]})
      })
    
    }else if (action === "remove" && this.state.loggedIn) {
      delete dict[friend]
      // update user dict
      user_doc.update({friends: dict})
      this.setState({
        friends: dict,
      }, this.update_people_list)

      // update friend's dict
      friend_doc.get().then((doc) => {
        // Check if friend still has user on their list
        friend_dict = doc.data();
        if (Object.keys(friend_dict["friends"]).includes(this.state.email)) {
          friend_dict["friends"][this.state.email]["status"] = "not-friends";
          friend_dict["friends"][this.state.email]["streak"] = null;
          friend_doc.update({friends: friend_dict["friends"]})
        }
        
      })
    }
    this.update_people_list()
  }

  flipCamera = () => {
    this.setState({flip_counter: this.state.flip_counter + 1});
    setTimeout(function() { //Start the timer
      if (this.state.faceMode === "user") {
        if(isMobile) { 
          this.setState({
            faceMode: "environment",
            mirrored: true
          })
        }
        this.setState({
          faceMode: "environment",
          mirrored: false
        })
      } else {
        this.setState({
          faceMode: "user",
          mirrored: true
        })
      }
    }.bind(this), 0)
  }
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
  update = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    },this.set_device)
  }
  showNavbar = (status) => { this.setState({showNavbar: status}) }
  showFooter = (status) => { this.setState({showFooter: status}) }
  setLocalDict = (dict) => { if (dict !== null) { this.setState({friends: dict}) }}

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
      pic: Guest,
      sent: 0,
      received: 0,
      pending: {},
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
    const list = [];
    const styles = {
      slideContainer: {
        height: '100vh',
        WebkitOverflowScrolling: 'touch', // iOS momentum scrolling
      },
      slide: {
        padding: 0,
      }
    };
    for (let i = 0; i < 100; i += 1) {
      list.push(<div key={i}>{`item n°${i + 1}`}</div>);
    }
    return (
      <>
        <MetaTags>
          <title>Yellow Ghost</title>
          <meta name="description" content="A webapp version of SnapChat. No affiliation with SnapChat Inc, powered by Google Firebase and React.js." />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        </MetaTags>
        {this.state.showNavbar ?
          <NavBar
            index={index}
            // Functions
            login={this.login.bind(this)}
            logout={this.logout.bind(this)}
            disable_swiping={this.setDisabledSwiping.bind(this)}
            edit_friends={this.edit_friends.bind(this)}
            flipCamera={this.flipCamera.bind(this)}
            // User Info
            loggedIn={this.state.loggedIn}
            name={this.state.name}
            email={this.state.email}
            pic={this.state.pic}
            received={this.state.received}
            sent={this.state.sent}
            created={this.state.created}
            pending={this.state.pending}
            added_me={this.state.added_me}
            friends={this.state.friends}
            strangers={this.state.strangers}
            everyone={this.state.everyone}
            // Navbar
            navbarBackground={this.state.navbarBackground}
          />
          : null
        }
        <BindKeyboardSwipeableViews
          onSwitching={this.onSwitching}
          disabled={this.state.disable_swiping}
          enableMouseEvents
          index={index}
          onChangeIndex={this.handleChangeIndex}
          containerStyle={styles.slideContainer}>
          <div style={Object.assign({}, styles.slide, styles.slide1)}>
            <Messages
              // User Info
              loggedIn={this.state.loggedIn}
              friends={this.state.friends}
              streak_emoji={this.state.streak_emoji}
              pic={this.state.pic}
              email={this.state.email}
              showNavbar={this.showNavbar.bind(this)}
              showFooter={this.showFooter.bind(this)}
              setLocalDict={this.setLocalDict.bind(this)}
              disable_swiping={this.setDisabledSwiping.bind(this)}
            />
          </div>
          <div style={Object.assign({}, styles.slide, styles.slide2)}>
            <Camera
              index={index}
              // Functions
              changeToIndex={this.changeToIndex.bind(this)}
              disable_swiping={this.setDisabledSwiping.bind(this)}
              showNavbar={this.showNavbar.bind(this)}
              showFooter={this.showFooter.bind(this)}
              setLocalDict={this.setLocalDict.bind(this)}
              flipCamera={this.flipCamera.bind(this)}
              // Camera
              faceMode={this.state.faceMode}
              mirrored={this.state.mirrored}
              flip_counter={this.state.flip_counter}
              // User Info
              friends={this.state.friends}
              email={this.state.email}
              sent={this.state.sent}
              emoji={this.state.streak_emoji}
              // Increment this.sent
              // Add person to pending list

            />
          </div>
        </BindKeyboardSwipeableViews>
        {this.state.showFooter ?
          <Footer
            index={index}
            changeToIndex={this.changeToIndex.bind(this)}
          />
          : null
        }
      </>
    );
  }
}

export default App;
