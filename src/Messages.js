import React, { Component } from 'react';
import './Messages.css';
import MessagesNavbar from './MessagesNavbar';
import Message from './Message';
import SwipeableViews from 'react-swipeable-views';
import { bindKeyboard } from 'react-swipeable-views-utils';

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);
var friends_list = [];
var dummy_dict = {name:"Guest (me)", email: "Guest@project-yellow-ghost.com", friends: ['Guest@project-yellow-ghost.com'], streak_emoji:"\u{1F525}",photoURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png"}


function Messages(props) {
    return (
    <div className="messages-screen">
        <MessagesNavbar
            user_email={this.state.user_email}
            user_name={this.state.user_name}
            user_pic={this.state.user_pic}
            login={this.login.bind(this)}
            logout={this.logout.bind(this)}
            user_friends={this.state.user_friends}
            user_strangers={this.state.user_strangers}
            everyone={this.state.everyone}
            get_friends_list={this.get_friends_list.bind(this)}
            friends_list={friends_list}
            logged_in={this.state.logged_in}
        />
        <ul className="messages-list">
        {this.state.logged_in ? null : 
        <li className="welcome-statement">Welcome to Project Yellow Ghost, a web app version of SnapChat. This was a project developed by Jonathan Wang
            and this was his final project for school. Right now, you are on a local guest account for you to try out. Feel free to sign in at the top if 
            you want to start using this product. Happy Snapping!
        </li>
        }
        {this.state.user_friends.map((x) => (
            <Message 
                sender_email={x.email} 
                profile_url={x.photoURL} 
                sender_name={x.name} 
                user_email={this.state.user_email} 
                streak_image={this.state.streak_image}
                logged_in={this.state.logged_in}
            />))
        }
        </ul>
    </div>
    );
}

export default Messages;