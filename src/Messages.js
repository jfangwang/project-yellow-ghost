import React, { Component } from 'react';
import {auth, storage, db, provider} from './Firebase.js';
import firebase from 'firebase/app';
import './Messages.css';
import MessagesNavbar from './MessagesNavbar';
import Message from './Message';
import SwipeableViews from 'react-swipeable-views';
import { bindKeyboard } from 'react-swipeable-views-utils';

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);
var friends_list = [];

class Messages extends Component {
    constructor(props) {
        super(props);
        var dummy_dict = {name:"Guest (me)", email: "Guest@project-yellow-ghost.com", friends: ['Guest@project-yellow-ghost.com'], streak_emoji:"\u{1F525}",photoURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png"}
        this.state = {
            streak_image: "\u{1F525}",
            user_name: "Guest",
            user_email: "Guest",
            user_friends: [dummy_dict],
            user_strangers: null,
            everyone: [dummy_dict],
            user_pic: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png",
            friends_list: []
        }
    }

    login = () => {
        auth.signInWithPopup(provider)
        .then((result) => {
            this.setState({
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
            user_name: "Guest",
            user_email: "Guest",
            user_friends: ["Guest (Me)"],
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
                },
                this.get_friends_list,
                )
            }
        }.bind(this))
    }

    get_friends_list = () => {
        const friends = db.collection("users").doc(this.state.user_email);
        friends.get().then((doc) => {
            if (!doc.data().hasOwnProperty('friends')) {
                friends_list = [this.state.user_email];
                this.setState({
                    friends_list: [this.state.user_email]
                }, this.get_messages)
            } else {
                friends_list = doc.data()["friends"];
                this.setState({
                    friends_list: [doc.data()["friends"]]
                }, this.get_messages)
            }

        });
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
                if (this.state.friends_list.includes(doc.docs[i].data()['email']) || friends_list.includes(doc.docs[i].data()['email'])) {
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
    // componentDidUpdate(prevState) {
    //     console.log("friends list", friends_list)
    // }

    render() {
        return (
        <div className="messages-screen">
            <MessagesNavbar
                user_name={this.state.user_name}
                user_pic={this.state.user_pic}
                login={this.login} logout={this.logout}
                user_friends={this.state.user_friends}
                user_strangers={this.state.user_strangers}
                everyone={this.state.everyone}
                get_friends_list={this.get_friends_list.bind(this)}
                friends_list={this.state.friends_list}
            />
            <ul className="messages-list">
            {this.state.user_friends.map((x) => (<Message sender_email={x.email} profile_url={x.photoURL} sender_name={x.name} user_email={this.state.user_email} streak_image={this.state.streak_image} />))}
            </ul>
        </div>
        );
    }
}

export default Messages;