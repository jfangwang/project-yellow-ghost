import React, { Component } from 'react';
import {auth, storage, db, provider} from './Firebase.js';
import firebase from 'firebase/app';
import './Messages.css';
import MessagesNavbar from './MessagesNavbar';
import Message from './Message';
import { bindKeyboard } from 'react-swipeable-views-utils';

class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sender_image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png",
            sender_name: "Guest",
            message_status: "New Snap",
            time_sent: '2 mins',
            streak_num: 0,
            streak_image: "\u{1F525}",
            user_name: "Guest",
            user_email: "Guest",
            user_pic: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png",
        }
    }

    login = () => {
        auth.signInWithPopup(provider)
        .then((result) => {
            this.setState({
                user_name: "Jonny",
                user_email: result.user.email,
                user_pic: result.user.photoURL,
            },
            console.log(this.state.user_name)
            )
        })
        .catch((error) => console.log(error.message));
    }

    logout = () => {
        firebase.auth().signOut()
        this.setState({
            user_name: "Guest",
            user_email: "Guest",
            user_pic: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png",
        },
        console.log(this.state.user_name)
        )
    }

    load_user = () => {

    }

    render() {
        return ( 
        <div className="messages-screen">
            <div className="navbar">
                <div className="nav-box-1">
                    <ul>
                        <li>
                            {this.state.user_name == "Guest" ?
                            <a onClick={this.login}>Sign In</a> :
                            <img class="profile-pic" src={this.state.user_pic} onClick={this.logout} alt="Profile Picture" />
                            }
                        </li>
                        <li><a>Search</a></li>
                    </ul>
                </div>
                <div className="nav-box-2">
                    <h1>Chat</h1>
                </div>
                <div className="nav-box-3">
                    <ul>
                        <li><a>Add Friend</a></li>
                        <li><a>New Chat</a></li>
                    </ul>
                </div>
            </div>
            <ul className="messages-list">
                <Message sender_image={this.state.sender_image}
                    sender_name={this.state.sender_name}
                    message_status={this.state.message_status}
                    time_sent={this.state.time_sent}
                    streak_num={this.state.streak_num}
                    streak_image={this.state.streak_image}
                />
            </ul>
        </div>
        );
    }
}

export default Messages;