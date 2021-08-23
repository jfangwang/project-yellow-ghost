import React, { Component, useState, useEffect } from 'react';
import {auth, storage, db} from './Firebase.js';
import ReactTimeAgo from 'react-timeago';
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
	return (
			<>
			<li className="list-container">
				<div className="pic-container">
					<img className="friend-profile-pic" src={props.friend["profile_pic_url"]}></img>
				</div>
				<div className="friend-info">
					<h3>{props.friend["name"]}</h3>
					<h5>{props.friend["status"]}</h5>
				</div>
				<div className="friend-info">
					<h3>{props.friend["streak"]}{props.streak_emoji}</h3>
				</div>
			</li>
			
			</>
	)

}
