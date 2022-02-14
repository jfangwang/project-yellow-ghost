import React from 'react';
import Helmet from 'react-helmet';
import SwipeableViews from 'react-swipeable-views';
import { bindKeyboard } from 'react-swipeable-views-utils';
import {auth, db, provider} from './Firebase.js';
import firebase from 'firebase/app';
import './App.css';
import Messages from './Messages.js';
import {Camera} from './Camera.js';
import {NavBar} from './Navbar.js';
import Footer from './Footer.js';
import Guest from './images/guest-profile-pic.png';
import Rick from './images/rick-profile-pic.jpg';
import Morty from './images/morty-profile-pic.jpg';

// All the firebase calls will occur here to minimize usage

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);

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
      // Camera
      faceMode: "user",
      mirrored: "true",
      // Navbar
      showNavbar: true,
      showFooter: true,
      navbarBackground: null,
      // User Info
      loggedIn: null,
      email: null,
      created:null,
      friends: {},
      name: null,
      added_me: {},
      pending: {},
      pic: null,
      streak_emoji: null,
      received: null,
      sent: null,
      // Lists
      strangers: {},
      everyone: {},

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
  onSwitching = index => {
    this.setState({
      navbarBackground: index,
    })
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
          total_sent: 0,
          total_received: 0,
          added_me: {},
          pending: {},
          friends: {
            ["Guest@Guest.com"]: {
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
            }
          },
          strangers: {
            ["Rick@Guest.com"]: {
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
            ["Morty@Guest.com"]: {
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
            ["Guest@Guest.com"]: {
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
            ["Rick@Guest.com"]: {
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
            ["Morty@Guest.com"]: {
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
          total_sent: 0,
          total_received: 0,
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
          
          if (this.state.email == user.id) {
            added_me = user.data()["added_me"]
            console.log("Added me", user.data()["added_me"])
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
    var pending = this.state.pending;
    var added_me = this.state.added_me;

    if (action == "pending" && !this.state.loggedIn) {
      this.state.friends[friend] = value
      delete this.state.strangers[friend]
      this.setState({
        friends:this.state.friends,
        strangers: this.state.strangers,
      })
    } else if (action == "remove" && !this.state.loggedIn) {
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
    } else if (action == "pending" && this.state.loggedIn) {
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
          var new_friend_entry = {
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

    } else if (action == "remove pending" && this.state.loggedIn) {
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
    if (this.state.faceMode == "user") {
      if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
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
  }

  showNavbar = (status) => {
    this.setState({showNavbar: status})
  }
  showFooter = (status) => {
    this.setState({showFooter: status})
  }
  setLocalDict = (dict) => {
    if (dict != null) {
      this.setState({friends: dict})
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
    return (
      <>
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
      <BindKeyboardSwipeableViews onSwitching={this.onSwitching} disabled={this.state.disable_swiping} enableMouseEvents index={index} onChangeIndex={this.handleChangeIndex} style={Object.assign({width: '100%', height: '100%', position: 'absolute', top: '0%', left: '0%'})}>
        <div style={Object.assign({backgroundColor: 'white'})}>
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
          />
        </div>
        <div style={Object.assign({backgroundColor: 'Plum'})} >
          <Camera
            index={index}
            // Functions
            changeToIndex={this.changeToIndex.bind(this)}
            disable_swiping={this.setDisabledSwiping.bind(this)}
            showNavbar={this.showNavbar.bind(this)}
            showFooter={this.showFooter.bind(this)}
            setLocalDict={this.setLocalDict.bind(this)}
            // Camera
            faceMode={this.state.faceMode}
            mirrored={this.state.mirrored}
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
