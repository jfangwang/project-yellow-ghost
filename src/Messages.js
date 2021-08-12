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
        this.state = {
            streak_image: "\u{1F525}",
            user_name: "Guest",
            user_email: "Guest",
            user_friends: ["Guest (Me)"],
            user_pic: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png",
        }
    }

    componentDidMount() {
        this.test();
    }

    test = () => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                this.setState({
                    user_name: user.displayName,
                    user_email: user.email,
                    user_pic: user.photoURL,
                })
            }
            
        }.bind(this))
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
            this.get_friends_list()
            const userdb = db.collection("users").doc(result.user.email);
            userdb.get().then((doc) => {
                if (!doc.exists) {
                    db.collection("users").doc(result.user.email).set({
                        email: result.user.email,
                        name: result.user.displayName,
                        photoURL: result.user.photoURL,
                        streak_emoji: this.state.streak_image,
                        friends: friends_list,
                    })
                    .catch((error) => {
                        console.log("Couldn't write user to DB, error: ", error);
                    });
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

    get_friends_list = () => {
        const friends = db.collection("users").doc(this.state.user_email);
        friends.get().then((doc) => {
            this.setState({
                user_friends: doc.data()["friends"]
            });
            friends_list = doc.data()["friends"];
        });
    }

    render() {
        const arr = this.state.user_friends;
        var i = 0;
        var newArr = [];
        for (i=0; i<arr.length; i= i + 1) {
            newArr[i] = arr[i];
        }


        return (
        <div className="messages-screen">
            <MessagesNavbar user_name={this.state.user_name} user_pic={this.state.user_pic} login={this.login} logout={this.logout} />
            <ul className="messages-list">
            {newArr.map((x) => (<Message sender_email={x} user_email={this.state.user_email} streak_image={this.state.streak_image} />))}
            </ul>
        </div>
        );
    }
}

export default Messages;