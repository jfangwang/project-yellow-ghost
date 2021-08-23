import React, { Component, useState, useEffect } from 'react';
import {auth, storage, db} from './Firebase.js';
import TimeAgo from 'react-timeago';
import firebase from 'firebase/app';
import './Messages.css';

/*
 * Function - Message(sender_name)
 * @sender_name: Name of person who sent the image
 * Return: Loaded images requested from Firebase
 * 
 * Description:
 * A request (/post/current_user/) is sent to Firebase to get current_user's received images.
*/

export default function Message(props) {
	var icon_class = "message-" + props.friend["status"]
	var status_dict = {
		["new-friend"]: "New Friend!",
		received: "Received",
		sent: "Sent",
		opened: "Opened",
		pending: "Pending",
		["not-friends"]: "Unfriended You",
		blocked: "Blocked",
	}
	var status = status_dict[props.friend["status"]]
	return (
			<>
			<li className="list-container">
				<div className="pic-container">
					<img className="friend-profile-pic" src={props.friend["profile_pic_url"]}></img>
				</div>
				<div className="friend-info">
					<h3>{props.friend["name"]}</h3>
					<div className="message-info">
						<div className="message-info">
							<div className={icon_class} />
							<h5>{status}</h5>
						</div>
						<h5>{props.friend["last_time_stamp"] ? <> - <TimeAgo date={props.friend["last_time_stamp"]} /> - </> : null}</h5>
						<div>
							<h5>{props.friend["streak"]}{props.streak_emoji}</h5>
						</div>
					</div>
				</div>
				<div className="friend-info">
					
				</div>
			</li>
			
			</>
	)

}
