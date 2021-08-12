import React, { Component, useState, useEffect } from 'react';
import {auth, storage, db} from './Firebase.js';
import firebase from 'firebase/app';
import Friends from './Friends.js';
import './Messages.css';

export default function MessagesNavbar(props) {
	const [show_friends, setShow_Friends] = useState(false);
	const [f, setFriends] = useState([]);
	const [friends2, setFriends2] = useState([]);
	const [strangers, setStrangers] = useState([]);
	const [everyone, setEveryone] = useState([]);
	var user_email = null;

	const show_friends_button = () => {
		setShow_Friends(true);
		if (firebase.auth().currentUser != null) {
			user_email = firebase.auth().currentUser.email;
		}
		get_friends_list();
		get_all_users();
	}
	const hide_friends_button = ()=> {
		setShow_Friends(false);
	}
	const get_all_users = () => {
		const all = db.collection("users");
		all.get().then((doc) => {

		});
	}
	const get_friends_list = () => {
		if (user_email != null) {
			db.collection('users')
			.doc(user_email)
			.onSnapshot((snapshot) => {

		})
		}
	}

	return (
		<>
		{ !show_friends ? 
		<div className="navbar">
		<div className="nav-box-1">
			<ul>
				<li>
					{props.user_name == "Guest" ?
					<a onClick={props.login}>Sign In</a> :
					<img className="profile-pic" src={props.user_pic} onClick={props.logout} alt="Profile Picture" />
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
					<li><a onClick={show_friends_button}>Add Friend</a></li>
					<li><a>New Chat</a></li>
				</ul>
			</div>
		</div>
		: null}
		{ show_friends ?
		<div className="add-friends">
			<div className="add-navbar">
				<div className="nav-box-1"><ul><li><a onClick={hide_friends_button}><b>Close</b></a></li></ul></div>
				<div className="nav-box-2"><h1>Add Friends</h1></div>
				<div className="nav-box-3"><ul><li><a><b>. . .</b></a></li></ul></div>
			</div>
			<div className="search-bar"><input type="search" placeholder="Find Friends"></input></div>
			<div className="add-navbar"><h3 className="quick-add">Quick Add</h3></div>
			<ul className="add-list list-container">
			{friends2.map((x) => (<Friends stranger_pic={x.photoURL} stranger_name={x.name} stranger_username={x.email} />))}
			</ul>
		</div>
		 : null}
		</>
	);
}
