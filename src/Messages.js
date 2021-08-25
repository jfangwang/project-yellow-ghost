import React from 'react';
// import React, { Component } from 'react';
import './Messages.css';
import Message from './Message';


export default function Messages(props) {
    return (
    <div className="messages-screen">
			<div className="navbar">
					{/* Placeholder */}
			</div>
			<ul className="messages-list">
				{props.loggedIn ? 
					null
					:<li className="welcome-statement">Welcome to Project Yellow Ghost, a web app version of SnapChat. This was a project developed by Jonathan Wang
						and this was his final project for school. Right now, you are on a local guest account for you to try out. Feel free to sign in at the top if
						you want to start using this product. Happy Snapping!
					</li>
				}
				{Object.keys(props.friends).sort().map((key) => (
					<Message
						friend={props.friends[key]}
						friends={props.friends}
						streak_emoji={props.streak_emoji}
						k={key}
						pic={props.pic}
						email={props.email}
						showNavbar={props.showNavbar}
      			showFooter={props.showFooter}
						loggedIn={props.loggedIn}
						setLocalDict={props.setLocalDict}
					/>
				))}	
			</ul>
			<div className="footer app-foot">
				{/* Placeholder */}
			</div>
    </div>
    );
}
