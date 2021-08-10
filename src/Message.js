import React, { Component, useState } from 'react';
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

    // Check Firebase if user has any new messages

    const [status, setStatus] = useState("Received");
    const [time, setTime] = useState(0);
    db.collection('posts').doc(props.user_email).collection("Received").orderBy("timeStamp").limit(1).get().then((doc) => {
        doc.forEach((x) => {
            if (x.exists) {
                console.log("Timestamp: ", x.data());
                setStatus("New Snap");
                setTime(x.data()["timeStamp"].toDate().toUTCString())
            } else {
                console.log("doc does not exist");
            }
        })

    }).catch((error) => {
        console.log("User does not exist: ", error)
    })

    var status_output = <p>{status}</p>;
    // const test1 = document.getElementById('icon');
    // console.log("test", test1);
    var icon = <div className="message-received"/>;

    if (status === "New Snap"){
        icon = <div className="message-new" />
        status_output = <p className="red"><b>{status}</b></p>
    } else if (status === "Received") {
        icon = <div className="message-received"/>
    } else if (status === "Sent") {
        icon = <div className="message-sent"/>
    } else if (status === "Opened") {
        icon = <div className="message-opened"/>
    }

    const [img, setImg] = useState(null);

    const open = () => {
        console.log("opening snap", props.user_email);
        const received = db.collection('posts').doc(props.user_email).collection("Received");
        received.get().then((snapshot) => {
            snapshot.forEach((doc) => {
                if (!doc.empty) {
                    setStatus("New Snap");
                    console.log("img", doc.data()["imageURL"]);
                    setImg(doc.data()["imageURL"])
                } else {
                    console.log("doc does not exist");
                }
            })
            
        })
    }

    const close = () => {
        setImg(null);
    }

    const [profile_url, setURL] = useState("https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png");
    const [sender_name, setName] = useState("Guest (Me)");
    const sender = db.collection("users").doc(props.sender_email);
    sender.get().then((doc) => {
        if (doc.exists) {
            setURL(doc.data()["photoURL"]);
            setName(doc.data()["name"]);
        } else {
            setURL("https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png");
            setName("Guest (Me)");
        }
    });
    return (
        <>
        {img ? <div className="image-background" onClick={close}><img className="image" src={img} /></div> :
            <li className="message-content" onClick={open}>
                <img className="message-avatar" src={profile_url} alt="Avatar"/>
                <ul className="message-info">
                    <h3>{sender_name}</h3>
                    <div className="message-sub-info">
                        {icon}
                        {status_output}
                        <p><ReactTimeAgo date={time} locale="en-US"/></p>
                        {props.streak_num > 0 ? <p>{props.streak_num}{props.streak_image}</p> : null}
                    </div>
                </ul>
            </li>
        }
        </>
    );

}
