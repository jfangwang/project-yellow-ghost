import React, { Component, useState, useEffect } from 'react';
import {auth, storage, db} from './Firebase.js';
import firebase from 'firebase/app';
import './Messages.css';

export default function Friends(props) {

     // Check for all users on firebase 

     const [status, setStatus] = useState("Received");
     const [time, setTime] = useState(0);
     const [imgArr, setImgArr] = useState([]);
     
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
							<button><b>Add</b></button>
							<a>x</a>
						</div>
        </li>
    )
}
