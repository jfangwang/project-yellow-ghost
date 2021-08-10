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



    var status = "New Snap"
    // const test1 = document.getElementById('icon');
    // console.log("test", test1);
    var icon = <div className="message-received"/>;

    if (status === "New Snap"){
        icon = <div className="message-new" />
        status = <p className="red"><b>{status}</b></p>
    } else if (status === "Received") {
        icon = <div className="message-received"/>
    } else if (status === "Sent") {
        icon = <div className="message-sent"/>
    } else if (status === "Opened") {
        icon = <div className="message-opened"/>
    }
    status = <p>{status}</p>;

    const open = () => {
        console.log("opening snap");
    }

    return (
        <>
        <li className="message-content" onClick={open}>
            <img className="message-avatar" src={props.sender_image} alt="Avatar"/>
            <ul className="message-info">
                <h3>{props.sender_name}</h3>
                <div className="message-sub-info">
                    {icon}
                    {status}
                    <p>Time ago</p>
                    {props.streak_num > 0 ? <p>{props.streak_num}{props.streak_image}</p> : null}
                </div>
            </ul>
        </li>
        </>
    )
}
