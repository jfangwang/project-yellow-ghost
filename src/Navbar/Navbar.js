import React, { useState, useEffect } from 'react';
import './Navbar.css';
// import {auth, storage, db, provider} from './Firebase.js';
// import firebase from 'firebase/app';
// import {Test2} from './Camera.js';
import SearchIcon from '../images/search-icon.png';
import AddFriendIcon from '../images/add-friend-icon.png';
import ChatIcon from '../images/chat-icon.png';
import FlipIcon from '../images/flip-icon.png';
import DownArrowIcon from '../images/down-arrow-icon.png';


function NavBar(props) {
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
		setShowFlipCam(false);
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
		if (props.index === 0) {
			setShowNewChat(true);
		} else if (props.index === 1) {
			setShowFlipCam(true);
		}
		setShowMore(false);
		setShowClose(false);
		setNavTitle("Chat");
		props.disable_swiping(false);
	}

	useEffect(() => {
    // check_user();
		// console.log("index: ", props.index);
		if (props.index === 0) {
			setShowNewChat(true);
			setShowFlipCam(false);
			setShowTitle(true);
		} else if (props.index === 1) {
			setShowNewChat(false);
			setShowFlipCam(true);
			setShowTitle(false);
		}
		
		// document.getElementById("nav-item-search").style.opacity = 1.3 - props.navbarBackground;
		// document.getElementById("nav-item-add-friend").style.opacity = 1.3 - props.navbarBackground;
		// document.getElementById("nav-item-new-chat").style.opacity = 1.3 - props.navbarBackground;
		// document.getElementById("nav-item-flip-cam").style.opacity = 1.3 - props.navbarBackground;
	

  },[props.navbarBackground]);

	return (
		<>
		<div className="app-nav">
		<div className="nav-box-1">
			<ul>
				{showLogin ?
					props.loggedIn ?
						<li className="nav-item"><img className="nav-item" onClick={toggleProfile} src={props.pic} alt="nav-item"/></li>
						: <li className="sign-in"><a onClick={props.login}>Sign In</a></li>
					: null}
				
				{showClose ? 
					<li><img className="close-icon" src={DownArrowIcon} onClick={resetNav} alt="clsoe-icon"></img></li>
					: null
				}
				
				{showSearch ? <li id="nav-item-search" className="nav-item"><img className="search-icon" src={SearchIcon} alt="search-icon" /></li> : null}
			</ul>
		</div>
		<div className="nav-box-2">
			{props.index === 0 ?
				showTitle ? 
					<h1>{navTitle}</h1>
					: null
				: null
			}
			{props.index === 1 ? 
				showTitle ? 
					null
					// <h1>Camera</h1>
					: null
				: null
			}
		</div>
		<div className="nav-box-3">
				<ul>
					{showAddFriend ? <li id="nav-item-add-friend" className="nav-item" onClick={toggleAddFriend}><img className="add-friend-icon" src={AddFriendIcon} alt="add friend icon"/></li> : null}
					{showNewChat ? <li id="nav-item-new-chat" className="nav-item"><img src={ChatIcon} className="chat-icon" alt="chat icon"/></li> : null}
					{showMore ? <li><a><b>. . .</b></a></li> : null}
					{showFlipCam ? <li id="nav-item-flip-cam" className="nav-item" onClick={props.flipCamera}><img className="flip-icon" src={FlipIcon} alt="flip icon"/></li> : null}
				</ul>
			</div>
		</div>
		{showProfileScreen ? 
			<ProfileModal
			// User Info
				pic={props.pic}
				name={props.name}
				email={props.email}
				received={props.received}
				sent={props.sent}
				created={props.created}
				// functions
				resetNav={resetNav}
				logout={props.logout}
			/>
			: null
		}
		{showAddFriendScreen ? 
			<>
			
			<AddFriend
				friends={props.friends}
				pending={props.pending}
				strangers={props.strangers}
				everyone={props.everyone}
				edit_friends={props.edit_friends}
				email={props.email}
				added_me={props.added_me}
			/>
			{/* <div className="screen">
				<div className="navbar">
				</div>
				<button onClick={() => props.edit_friends("remove", "key", "value")}>Remove</button>
			</div> */}
			
			</>
			: null
		}
		</>
	);
}

function ProfileModal(props) {
	const logout = () => {
		props.resetNav();
		props.logout();
	}
	return (
		<div className="screen profile-modal">
			<div className="navbar">
					{/* Placeholder */}
			</div>
			<img src={props.pic} className="profile-pic" alt="profile-pic"/>
			<h1>{props.name}</h1>
			<h3>{props.email}</h3>
			<h3>{"\u{1F4ED}"} {props.received} | {props.sent} {"\u{2709}"}</h3>
			<h3>Total: {props.received + props.sent}</h3>
			<h3>Created by Jonathan Wang {"\u{1F603}"}</h3>
			<h3>Joined: {props.created}</h3>
			<button onClick={logout} style={{backgroundColor: "red"}}><h1>Logout</h1></button>
		</div>
	)
}

function AddFriend(props) {
	var filtered_strangers = props.strangers;
	Object.keys(props.added_me).forEach(item => {
		delete filtered_strangers[item];
	})

	return (
		<div className="screen">
			<div className="navbar"/>
			<input type="search" placeholder="Find Friends" className="friend-search" />
			<h3 className="friend-head">Quick Add ({Object.keys(props.strangers).length})</h3>
			<ul className="friend-list-container">
				{Object.keys(filtered_strangers).sort().map((key) => (
					<Stranger
						strangers={filtered_strangers}
						k={key}
						edit_friends={props.edit_friends}
					/>
				))}
			</ul>
			{Object.keys(filtered_strangers).length === 0 ? 
				<p>You are friends with everyone</p>
				: null
			}
			{Object.keys(props.added_me).length === 0 ? null :
				<>
					<h3 className="friend-head">Added Me ({Object.keys(props.added_me).length})</h3>
					<ul className="friend-list-container">
						{Object.keys(props.added_me).sort().map((key) => (
							<AddedMe
								added_me={props.added_me}
								k={key}
								edit_friends={props.edit_friends}
							/>
						))}
					</ul>
				</>
			}
			<h3 className="friend-head">Friends ({Object.keys(props.friends).length - 1})</h3>
			<ul className="friend-list-container">
				{Object.keys(props.friends).sort().map((key) => (
					<Friend
						friends={props.friends}
						k={key}
						edit_friends={props.edit_friends}
						email={props.email}
					/>
				))}
			</ul>
			{Object.keys(props.friends).length - 1 === 0 ? 
				<p>Add some friends!</p>
				: null
			}
			<h3 className="friend-head">Everyone ({Object.keys(props.everyone).length})</h3>
			<ul className="friend-list-container">
				{/* <h3>List: {Object.keys(props.strangers)}</h3> */}
				{Object.keys(props.everyone).sort().map((key) => (
					<Everyone
						everyone={props.everyone}
						k={key}
						edit_friends={props.edit_friends}
					/>
				))}
			</ul>
			<div className="footer">
				{/* Placeholder */}
			</div>
		</div>
	)
}

function Friend(props) {
	var friends = props.friends;
	var key = props.k;
	return (
		<>	
			{props.email === key ? null : 
				<li className="item-container">
					<div className="pic-info-mix">
						<div className="pic-container">
							<img className="friend-profile-pic" src={friends[key].profile_pic_url} alt="friend profile pic"/>
						</div>	
						<div className="friend-info">
							<h2>{friends[key].name}</h2>
							<p style={{fontSize: "0.9rem"}}>{key}</p>
						</div>
					</div>
					<div className="friend-button">
					{props.email === key ?  null :
						friends[key].status === "pending" ?
							<button onClick={() => props.edit_friends("remove pending", key, friends[key])}>Remove Request</button> 
							: <button onClick={() => props.edit_friends("remove", key, friends[key])}>Remove</button>	
					}
					</div>
				</li>
			}
		</>
	)
}

function AddedMe(props) {
	var addedMe = props.added_me;
	var key = props.k;
	return (
		<>
			<li className="item-container">
				<div className="pic-info-mix">
					<div className="pic-container">
						<img className="friend-profile-pic" src={addedMe[key].profile_pic_url} alt="friend profile pic"/>
					</div>	
					<div className="friend-info">
						<h2>{addedMe[key].name}</h2>
						<p>{key}</p>
					</div>
				</div>
				<div className="friend-button">
					<button onClick={() => props.edit_friends("add", key, addedMe[key])}><img alt="add friend" className="add-friend-list-icon" src={AddFriendIcon} />Add</button>
				</div>
			</li>
		</>
	)
}

function Stranger(props) {
	var strangers = props.strangers;
	var key = props.k;

	return (
		<>
			<li className="item-container">
				<div className="pic-info-mix">
					<div className="pic-container">
						<img className="friend-profile-pic" src={strangers[key].profile_pic_url} alt="friend profile pic"/>
					</div>	
					<div className="friend-info">
						<h2>{strangers[key].name}</h2>
						<p>{key}</p>
					</div>
				</div>
				<div className="friend-button">
					<button onClick={() => props.edit_friends("pending", key, strangers[key])}><img className="add-friend-list-icon" src={AddFriendIcon} alt="add friend list icon"/>Add</button>
				</div>
			</li>
		</>
	)
}

function Everyone(props) {
	var everyone = props.everyone;
	var key = props.k;

	return (
		<>
			<li className="item-container">
				<div className="pic-info-mix">
					<div className="pic-container">
						<img className="friend-profile-pic" src={everyone[key].profile_pic_url} alt="friend-profile-pio"/>
					</div>	
					<div className="friend-info">
						<h2>{everyone[key].name}</h2>
						<p>{key}</p>
					</div>
				</div>
				<div className="friend-button">
				</div>
			</li>
		</>
	)
}

export {NavBar, ProfileModal, AddFriend}