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
        <h1>Message</h1>
        </>
    )

}
