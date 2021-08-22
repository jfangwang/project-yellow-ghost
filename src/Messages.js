import React, { Component } from 'react';
import './Messages.css';
import Message from './Message';


function Messages(props) {
    return (
    <div className="messages-screen">
        <div className="navbar">
		<div className="nav-box-2">
			<h1>Chat</h1>
		</div>
		</div>
        <ul className="messages-list">
        {props.logged_in ? null :
        <li className="welcome-statement">Welcome to Project Yellow Ghost, a web app version of SnapChat. This was a project developed by Jonathan Wang
            and this was his final project for school. Right now, you are on a local guest account for you to try out. Feel free to sign in at the top if 
            you want to start using this product. Happy Snapping!
        </li>
        }
        {props.user_friends_dict.map((x) => (
            <Message 
                sender_email={x.email} 
                profile_url={x.photoURL} 
                sender_name={x.name} 
                user_email={props.user_email}
                streak_emoji={props.streak_emoji}
                logged_in={props.logged_in}
            />))
        }
        </ul>
    </div>
    );
}

export default Messages;