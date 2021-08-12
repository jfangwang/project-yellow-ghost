import React, { Component, useState, useEffect } from 'react';
import {auth, storage, db} from './Firebase.js';
import firebase from 'firebase/app';
import {Friends, Strangers, Everyone} from './Friends.js';
import './Messages.css';

export default function MessagesNavbar(props) {
	const [show_friends, setShow_Friends] = useState(false);

	const show_friends_button = () => {
		setShow_Friends(true);
		props.get_friends_list();
	}
	const hide_friends_button = ()=> {
		setShow_Friends(false);
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
			<div className="add-body">
				<div className="search-bar"><input type="search" placeholder="Find Friends"></input></div>
				<div className="add-title-navbar"><h3 className="quick-add">Quick Add ({props.user_strangers.length})</h3></div>
				<ul className="add-list list-container">
				{props.user_strangers.map((x) => (<Strangers stranger_pic={x.photoURL} stranger_name={x.name} stranger_username={x.email} friends_list={props.friends_list} get_messages={props.get_messages}/>))}
				</ul>
				<div className="add-title-navbar"><h3 className="quick-add">Friends ({props.user_friends.length})</h3></div>
				<ul className="add-list list-container">
				{props.user_friends.map((x) => (<Friends stranger_pic={x.photoURL} stranger_name={x.name} stranger_username={x.email} user_email={props.user_email} friends_list={props.friends_list} get_friends_list={props.get_friends_list()}/>))}
				</ul>
				<div className="add-title-navbar"><h3 className="quick-add">Everyone ({props.everyone.length})</h3></div>
				<ul className="add-list list-container">
				{props.everyone.map((x) => (<Everyone stranger_pic={x.photoURL} stranger_name={x.name} stranger_username={x.email} />))}
				</ul>
				<div className="add-footer">

				</div>
			</div>
		</div>
		 : null}
		</>
	);
}