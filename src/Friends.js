import React, { Component, useState, useEffect } from 'react';
import {auth, storage, db} from './Firebase.js';
import firebase from 'firebase/app';
import './Messages.css';

function Friends(props) {

	const [removed, setRemoved] = useState(false);

	const remove = () => {
		setRemoved(true);
		props.get_friends_list();
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
						{removed ? <p className="removed"><b>Removed!</b></p> : <button onClick={remove}><b>Remove</b></button>}
						</div>
        </li>
    )
}

function Strangers(props) {

	const [added, setAdded] = useState(false);
	const friends = db.collection("users").doc(props.user_email);
	const new_friends_list = props.friends_list;

	const add_friend = () => {
		// console.log("adding stranger", props.stranger_username, props.friends_list);
		new_friends_list.push(props.stranger_username);
		friends.update({friends: new_friends_list})
	}

	const add = () => {
		add_friend()
		setAdded(true);
		// props.get_friends_list();
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
						   {added ? <p className="added"><b>Added!</b></p> : <button onClick={add}><b>Add</b></button>}
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