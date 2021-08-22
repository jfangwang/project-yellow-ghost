import React, { Component, useState, useEffect } from 'react';
import {db} from './Firebase.js';
import './Messages.css';
import checkmark from './images/black-checkmark.png';
import firebase from 'firebase/app';

function Friends(props) {

	const [removed, setRemoved] = useState(false);
	const friends = db.collection("users").doc(props.user_email);

	const remove_friend = () => {
		props.friends_list.splice(props.friends_list.indexOf(props.friend_username), 1)
		friends.update({friends: props.friends_list})
		db.collection("posts").doc(props.user_email).collection("Latest_Messages").doc(props.friend_username).delete();
		
		var friend_arr = [];

		db.collection("posts").doc(props.friend_username).collection("Latest_Messages").get().then((doc) => {
			doc.docs.forEach((element) => {
				friend_arr.push(element.data().email);
			})
			if (friend_arr.includes(props.user_email)) {
				// Friend still has user as a friend
				// updating friend's latest messages list
				db.collection("posts").doc(props.friend_username).collection("Latest_Messages").doc(props.user_email).update({
					friend_since: null,
					status: "Friend broke up",
					streak_num: 0,
					timeStamp: null
				})
			}
		})
	}
	const remove = () => {
		if (props.friend_username != "Guest@project-yellow-ghost.com") {
			remove_friend();
		}
		setRemoved(true);
	}

    return (<>
        {props.friend_username == props.user_email ? null : 
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
		}
		</>
    )
}

function SendFriends(props) {

	const [added, setAdded] = useState(false);
	const friends = db.collection("users").doc(props.user_email);

	const add_friend = () => {
		setAdded(true);
		var arr = props.send_list;
		arr.push(props.friend_username)
		props.handle_send_list(arr);
	}
	const remove_friend = () => {
		setAdded(false);
		var arr = props.send_list;
		arr.splice(arr.indexOf(props.friend_username), 1);
		props.handle_send_list(arr);
	}

    return (
			<>
			{added ?
				<li className="add-friends-content" onClick={remove_friend}>
				<div className="add-box-1">
				<img className="message-avatar" src={props.friend_pic} alt="Avatar"/>
				<ul className="message-info">
						<h2 className="selected">{props.friend_name}</h2>
						{/* <p>{props.friend_username}</p> */}
				</ul>
				</div>
				<div className="add-box-2">
				<div className="selected selected-circle"><img className="checkmark" src={checkmark} alt="U+2713"></img></div>
				</div>
			</li>
			:
			<li className="add-friends-content" onClick={add_friend}>
				<div className="add-box-1">
				<img className="message-avatar" src={props.friend_pic} alt="Avatar"/>
				<ul className="message-info">
						<h2>{props.friend_name}</h2>
						{/* <p>{props.friend_username}</p> */}
				</ul>
				</div>
				<div className="add-box-2">
				<div className="unselected-circle"><img className="checkmark" src={checkmark} alt="U+2713"></img></div>
				</div>
			</li>
			}
			</>
    )
}

function Strangers(props) {


	const [added, setAdded] = useState(false);
	const friends = db.collection("users").doc(props.user_email);


	
	const add_friend = () => {
		props.friends_list.push(props.stranger_username);
		friends.update({friends: props.friends_list})
		var stranger_arr = [];

		db.collection("posts").doc(props.stranger_username).collection("Latest_Messages").get().then((doc) => {
			doc.docs.forEach((element) => {
				stranger_arr.push(element.data().email);
			})
			if (stranger_arr.includes(props.user_email)) {
				// Stranger already added user as a friend
				// updating user's latest messages list
				console.log("New Friend Added!")
				var fire_time = firebase.firestore.FieldValue.serverTimestamp();
				db.collection("posts").doc(props.user_email).collection("Latest_Messages").doc(props.stranger_username).set({
					email: props.stranger_username,
					name: props.stranger_name,
					photoURL: props.stranger_pic,
					imgs_sent: 0,
					imgs_received: 0,
					friend_since: fire_time,
					status: "New Friend!",
					streak_num: 0,
					timeStamp: null
				})
				// updating stranger's latest messages list
				db.collection("posts").doc(props.stranger_username).collection("Latest_Messages").doc(props.user_email).update({
					friend_since: fire_time,
					status: "New Friend!",
				})
			} else {
				console.log("Pending...")
				// Stranger has not added user as a friend yet
				db.collection("posts").doc(props.user_email).collection("Latest_Messages").doc(props.stranger_username).set({
					email: props.stranger_username,
					name: props.stranger_name,
					photoURL: props.stranger_pic,
					imgs_sent: 0,
					imgs_received: 0,
					friend_since: null,
					status: "Pending",
					streak_num: 0,
					timeStamp: null
				})
			}
		})
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
					   		{props.stranger_username == props.user_email ?
								<h3>{props.stranger_name} (Me)</h3> 
								:
								<h3>{props.stranger_name}</h3> 
							}
							<p>{props.stranger_username}</p>
					   </ul>
					   </div>
					   <div className="add-box-2">
					   </div>
	   </li>
   )
}
export {SendFriends, Friends, Strangers, Everyone}