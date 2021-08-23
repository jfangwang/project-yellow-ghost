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
	// Screens
	const [showProfileScreen, setShowProfileScreen] = useState(false);
	const [showAddFriendScreen, setShowAddFriendScreen] = useState(false);
	// Show/Hide Navbar contents
	const [showLogin, setShowLogin] = useState(true);
	const [showSearch, setShowSearch] = useState(true);
	const [showTitle, setShowTitle] = useState(true);
	const [showAddFriend, setShowAddFriend] = useState(true);
	const [showNewChat, setShowNewChat] = useState(true);
	const [showMore, setShowMore] = useState(false);
	const [showClose, setShowClose] = useState(false);
	const [showFlipCam, setShowFlipCam] = useState(null);
	// Navbar content
	const [navTitle, setNavTitle] = useState("Chat")

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
		setShowProfileScreen(true);
		setShowLogin(false);
		setShowSearch(false);
		setShowAddFriend(false);
		setShowNewChat(false)
		setShowMore(true);
		setShowClose(true);
		setNavTitle("Profile");
		props.disable_swiping(true);
	}

	const toggleAddFriend = () => {
		setShowAddFriendScreen(true);
		setShowLogin(false);
		setShowSearch(false);
		setShowAddFriend(false);
		setShowNewChat(false)
		setShowMore(true);
		setShowClose(true);
		setNavTitle("Add Friends");
		props.disable_swiping(true);
	}

	const resetNav = () => {
		setShowProfileScreen(false);
		setShowAddFriendScreen(false);
		// Navbar contents
		setShowLogin(true);
		setShowSearch(true);
		setShowTitle(true);
		setShowAddFriend(true);
		setShowNewChat(true);
		setShowMore(false);
		setShowClose(false);
		setNavTitle("Chat");
		props.disable_swiping(false);
	}

	useEffect(() => {
    check_user();
		console.log("index: ", props.index)
		if (props.index == 0) {
			setShowNewChat(true);
			setShowFlipCam(false);
		} else if (props.index == 1) {
			setShowNewChat(false);
			setShowFlipCam(true);
		}
  },[props.index]);

	return (
		<>
		<div className="navbar app-nav">
		<div className="nav-box-1">
			<ul>		
				{showLogin ?
					loggedIn ?
						<li><img className="profile-pic" onClick={toggleProfile} src={pic}/></li>
						: <li><a onClick={login}>Sign In</a></li>
					: null}
				
				{showClose ? 
					<li><a onClick={resetNav}>Close</a></li>
					: null
				}
				
				{showSearch ? <li><a>Search</a></li> : null}
			</ul>
		</div>
		<div className="nav-box-2">
			{props.index == 0 ?
				showTitle ? 
					<h1>{navTitle}</h1>
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
					{showAddFriend ? <li onClick={toggleAddFriend}><a>Add Friend</a></li> : null}
					{showNewChat ? <li><a>New Chat</a></li> : null}
					{showMore ? <li><a><b>. . .</b></a></li> : null}
					{showFlipCam ? <li><a>Flip Cam</a></li> : null}
				</ul>
			</div>
		</div>
		{showProfileScreen ? 
			<ProfileModal
				pic={pic}
				name={name}
				email={email}
				toggleProfile={toggleProfile}
				logout={logout}
			/>
			: null
		}
		{showAddFriendScreen ? 
			<AddFriend

			/>
			: null
		}
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

function AddFriend(props) {
	return (
		<div className="screen">
			<div className="navbar">
					{/* Placeholder */}
			</div>
			<h1>Add Friends Here</h1>

			<div className="footer">
				{/* Placeholder */}
			</div>
		</div>
	)
}

export {NavBar, ProfileModal, AddFriend}