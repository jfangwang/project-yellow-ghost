import React, { Component, useState, useEffect } from 'react';
import {auth, storage, db} from './Firebase.js';
import firebase from 'firebase/app';
import './Messages.css';

function Friends(props) {

	const [removed, setRemoved] = useState(false);
	const friends = db.collection("users").doc(props.user_email);

	const remove_friend = () => {
		props.friends_list.splice(props.friends_list.indexOf(props.friend_username), 1)
		// console.log(props.friends_list, props.friends_list.indexOf(props.friend_username), props.friend_username);
		friends.update({friends: props.friends_list})
	}
	const remove = () => {
		remove_friend();
		// props.get_friends_list();
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

function Strangers(props) {

	const [added, setAdded] = useState(false);
	const friends = db.collection("users").doc(props.user_email);
	
	const add_friend = () => {
		props.friends_list.push(props.stranger_username);
		// console.log("adding stranger", props.stranger_username, props.user_email, props.friends_list);
		friends.update({friends: props.friends_list})
	}

	const add_true = () => {
		add_friend();
		// props.get_friends_list();
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
						   {/* <button><b>Remove</b></button> */}
					   </div>
	   </li>
   )
}
export {Friends, Strangers, Everyone}