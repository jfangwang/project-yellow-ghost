import React, { Component, useState, useEffect } from 'react';
import {db} from './Firebase.js';
import './Messages.css';

function Friends(props) {

	const [removed, setRemoved] = useState(false);
	const friends = db.collection("users").doc(props.user_email);

	const remove_friend = () => {

		props.friends_list.splice(props.friends_list.indexOf(props.friend_username), 1)
		friends.update({friends: props.friends_list})

	}
	const remove = () => {
		if (props.friend_username != "Guest@project-yellow-ghost.com") {
			remove_friend();
		}
		setRemoved(true);
	}

    return (
        <li className="add-friends-content">
						<div className="add-box-1">
						<img className="message-avatar" src={props.friend_pic} alt="Avatar"/>
						<ul className="message-info">
								<h3>{props.friend_name}</h3>
								<p>{props.friend_username}</p>
						</ul>
						</div>
						<div className="add-box-2">
						{removed ? <p className="removed"><b>Removed!</b></p> : <button onClick={remove}><b>Remove</b></button>}
						</div>
        </li>
    )
}

function SendFriends(props) {

	const [added, setAdded] = useState(false);
	const friends = db.collection("users").doc(props.user_email);
	// const remove_friend = () => {

	// 	props.friends_list.splice(props.friends_list.indexOf(props.friend_username), 1)
	// 	friends.update({friends: props.friends_list})

	// }
	// const remove = () => {
	// 	if (props.friend_username != "Guest@project-yellow-ghost.com") {
	// 		remove_friend();
	// 	}
	// 	setRemoved(true);
	// }
	const add_friend = () => {
		setAdded(true);
		props.send_list.push(props.friend_username);
		console.log(props.send_list);
	}
	const remove_friend = () => {
		setAdded(false);
		props.send_list.splice(props.send_list.indexOf(props.friend_username), 1)
		console.log(props.send_list);
	}

    return (
        <li className="add-friends-content">
						<div className="add-box-1">
						<img className="message-avatar" src={props.friend_pic} alt="Avatar"/>
						<ul className="message-info">
								<h3>{props.friend_name}</h3>
								<p>{props.friend_username}</p>
						</ul>
						</div>
						<div className="add-box-2">
						{added ? <button className="selected" onClick={remove_friend}></button> : <button className="unselected" onClick={add_friend}></button>}
						</div>
        </li>
    )
}

function Strangers(props) {


	const [added, setAdded] = useState(false);
	const friends = db.collection("users").doc(props.user_email);
	
	const add_friend = () => {
		props.friends_list.push(props.stranger_username);
		friends.update({friends: props.friends_list})
	}

	const add_true = () => {
		if (props.friend_username != "Guest@project-yellow-ghost.com") {
			add_friend();
		}
		setAdded(true);
	}

   return (
	   <li className="add-friends-content">
					   <div className="add-box-1">
					   <img className="message-avatar" src={props.stranger_pic} alt="Avatar"/>
					   <ul className="message-info">
							   <h3>{props.stranger_name}</h3>
							   <p>{props.stranger_username}</p>
					   </ul>
					   </div>
					   <div className="add-box-2">
						   {added ? <p className="added"><b>Added!</b></p> : <button onClick={add_true}><b>Add</b></button>}
					   </div>
	   </li>
   )
}

function Everyone(props) {

   return (
	   <li className="add-friends-content">
					   <div className="add-box-1">
					   <img className="message-avatar" src={props.stranger_pic} alt="Avatar"/>
					   <ul className="message-info">
							   <h3>{props.stranger_name}</h3>
							   <p>{props.stranger_username}</p>
					   </ul>
					   </div>
					   <div className="add-box-2">
					   </div>
	   </li>
   )
}
export {SendFriends, Friends, Strangers, Everyone}