import React, { Component, useState, useEffect } from 'react';
import './Navbar.css';
import {auth, storage, db, provider} from './Firebase.js';
import firebase from 'firebase/app';

function NavBar(props) {
	// User Info
	const [loggedIn, setLoggedIn] = useState(null);
	const [name, setName] = useState(null);
	const [email, setEmail] = useState(null);
	const [pic, setPic] = useState(null);
	const [showProfile, setShowProfile] = useState(false);
	// Navbar contents
	const [showSearch, setShowSearch] = useState(true);
	const [showTitle, setShowTitle] = useState(true);
	const [showAddFriend, setShowAddFriend] = useState(true);
	const [showNewChat, setShowNewChat] = useState(true);
	const [showMore, setShowMore] = useState(false);

	const check_user = () => {
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				setLoggedIn(true);
				setName(user.displayName);
				setEmail(user.email);
				setPic(user.photoURL)
			} else {
				setLoggedIn(false);
				setName("Guest");
				setEmail("Guest@Guest.com");
				setPic(props.default_pic)
			}
		})
	}

	const login = () => {
    auth.signInWithPopup(provider)
    .then((result) => {
			setLoggedIn(true);
			setName(result.user.displayName);
			setEmail(result.user.email);
			setPic(result.user.photoURL)
    })
  }
	const logout = () => {
    firebase.auth().signOut()
		setLoggedIn(false);
		setName("Guest");
		setEmail("Guest@Guest.com");
		setPic(props.default_pic)
  }

	const toggleProfile = () => {
		setShowProfile(!showProfile);
		setShowSearch(!showSearch);
		setShowAddFriend(!showAddFriend);
		setShowNewChat(!showNewChat)
		setShowMore(!showMore);
	}

	useEffect(() => {
    check_user();
  });

	return (
		<>
		<div className="navbar app-nav">
		<div className="nav-box-1">
			<ul>
				<li>
					{loggedIn ? <img className="profile-pic" onClick={toggleProfile} src={pic}/> : <a onClick={login}>Sign In</a>}
				</li>
				{showSearch ? <li><a>Search</a></li> : null}
			</ul>
		</div>
		<div className="nav-box-2">
			{props.index == 0 ?
				showTitle ? 
					<h1>Chat</h1>
					: null
				: null
			}
			{props.index == 1 ? 
				showTitle ? 
					<h1>Camera</h1>
					: null
				: null
			}
		</div>
		<div className="nav-box-3">
				<ul>
					{showAddFriend ? <li><a>Add Friend</a></li> : null}
					{showNewChat ? <li><a>New Chat</a></li> : null}
					{showMore ? <li><a><b>. . .</b></a></li> : null}
				</ul>
			</div>
		</div>
		{showProfile ? 
			<ProfileModal
				pic={pic}
				name={name}
				email={email}
				toggleProfile={toggleProfile}
				logout={logout}
			/>
		: null}
		</>
	);
}

function ProfileModal(props) {
	const logout = () => {
		props.toggleProfile();
		props.logout();
	}
	return (
		<div className="screen">
			<div className="navbar">
					{/* Placeholder */}
			</div>
			<img src={props.pic} style={{borderRadius: "1rem",width:"8rem", margin:"1rem"}} />
			<h1>{props.name}</h1>
			<h3>{props.email}</h3>
			<h3>Received | Sent</h3>
			<h3>Joined Project Yellow Ghost on August 9, 2021</h3>
			<button onClick={logout} style={{backgroundColor: "red"}}><h1>Logout</h1></button>

			<div className="footer">
				{/* Placeholder */}
			</div>
		</div>
	)
}

export {NavBar, ProfileModal}