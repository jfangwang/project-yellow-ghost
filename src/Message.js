import React, { Component } from 'react';
import {auth, storage, db} from './Firebase.js';
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

    var user = null;

    // Get the current user
    user = firebase.auth().currentUser;
    if (user === null) {
        user = "Guest";
    }



    const status = props.message_status;
    // const test1 = document.getElementById('icon');
    // console.log("test", test1);
    var icon = <div className="message-received"/>;

    if (status === "New Snap"){
        icon = <>
        <div className="message-new" />
        <p className="red"><b>{props.message_status}</b></p>
        </>
    }
    if (status === "Received") {
        icon = <>
        <div className="message-received"/>
        <p>{props.message_status}</p>
        </>
    }

    return (
        <>
        <li className="message-content">
            <img className="message-avatar" src={props.sender_image} alt="Avatar"/>
            <ul className="message-info">
                <h3>{props.sender_name}</h3>
                <div className="message-sub-info">
                    {icon}
                    <p>{props.time_sent} ago</p>
                    {props.streak_num > 0 ? <p>{props.streak_num}{props.streak_image}</p> : null}
                </div>
            </ul>
        </li>
        </>
    )
}
