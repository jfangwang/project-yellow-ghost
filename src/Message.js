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

    // Check Firebase if user has any new messages

    const [img, setImg] = useState(null);
    const [imgid, setImgid] = useState(null);
    const [imgs_sent, setSentImg] = useState(null);
    const [imgs_received, setReceivedImg] = useState(null);
    const [status, setStatus] = useState("Received");
    const [streak_num, setStreakNum] = useState(null);
    const [time, setTime] = useState(null);
    const [friendSince, setFriendSince] = useState(null);
    var user_received_images = db.collection('posts')
                        .doc(props.user_email)
                        .collection("Received")
                        .doc(props.sender_email)
                        .collection("images");
    var sender_sent_images = db.collection('posts')
                        .doc(props.sender_email)
                        .collection("Sent");
    var user_latest_messages = db.collection("posts")
                        .doc(props.user_email)
                        .collection("Latest_Messages")
                        .doc(props.sender_email);
    var sender_latest_messages = db.collection("posts")
                        .doc(props.sender_email)
                        .collection("Latest_Messages")
                        .doc(props.user_email);
    var localImgURL = null;

    const update_messages = () => {
        if (props.sender_email !== "Guest@project-yellow-ghost.com") {
            user_latest_messages.onSnapshot((doc) => {
                setSentImg(doc.data()["imgs_sent"]);
                setReceivedImg(doc.data()["imgs_received"]);
                setStatus(doc.data()["status"]);
                setStreakNum(doc.data()["streak_num"]);
                try {
                    setTime(doc.data()["timeStamp"].toDate().toUTCString());
                } catch (error) {
                    // Nothing
                }
                setImgid(doc.data()["id"]);
                localImgURL = doc.data()["imageURL"];
                // setFriendSince(doc.data()["friend_since"])
            })
        }
    }
    update_messages();

    const open = () => {
        if (status == "New Snap") {
            setImg(localImgURL);
        }
    }

    const check_next_photo = () => {
        user_received_images.orderBy("timeStamp", "desc").get().then((doc) => {

            // Update the sender's latest messages list
            sender_latest_messages.update({
                id: null,
                imageURL: null,
                imgs_sent: 0,
                status: "Opened",
            })
            
            // Gets the next photo if there is another photo and
            // sets it to user's message list
            // console.log("about to update latest messages list")
            // console.log(doc.docs, doc.docs.length);
            if (doc.docs.length > 0) {
                user_latest_messages.update({
                    id: doc.docs[0].data()["id"],
                    imageURL: doc.docs[0].data()["imageURL"],
                    imgs_received: imgs_received + 1,
                    status: "New Snap",
                    timeStamp: doc.docs[0].data()["timeStamp"],
                })

            } else {
                user_latest_messages.update({
                    id: null,
                    imageURL: null,
                    imgs_received: imgs_sent + 1,
                    status: "Received",
                })
            }
        })
    }

    const remove_name = () => {
        sender_sent_images.doc(imgid).get().then((doc) => {
            if (!doc.data() || doc.data()["to"].length == 1) {
                // Delete from storage
                storage.ref(`posts/${imgid}`).delete();
                // Delete from firestore
                sender_sent_images.doc(imgid).delete();
                // Remove images from received folder
                user_received_images.doc(imgid).delete();
            } else {
                var arr = doc.data()["to"];
                arr.splice(arr.indexOf(props.user_email), 1);
                // Update Firestore with deleted to list
                sender_sent_images.doc(imgid).update({to: arr});
                // Remove images from received folder
                user_received_images.doc(imgid).delete();
            }
            check_next_photo();
        })
    }

    const close = () => {
        setImg(null);
        remove_name(); 
    }

    var status_output = <p>{status}</p>;
    var icon = <div className=""/>;

    if (status === "New Snap"){
        icon = <div className="message-new" />
        status_output = <p className="red"><b>{status}</b></p>
    } else if (status === "Received") {
        icon = <div className="message-received"/>
    } else if (status === "Sent") {
        icon = <div className="message-sent"/>
    } else if (status === "Opened") {
        icon = <div className="message-opened"/>
    } else if (status == "New Friend!") {
        icon = <div className="message-new-friend"/>
    }
    
    return (
        <>
        {img ? <div className="image-background" onClick={close}><img id="image" className="image-preview" src={img} /></div> :
            <li className="message-content" onClick={open}>
                <img className="message-avatar" src={props.profile_url} alt="Avatar"/>
                <ul className="message-info">
                    <h3>{props.sender_name}</h3>
                    <div className="message-sub-info">
                        {icon}
                        {status_output}
                        {time != null ? <p><ReactTimeAgo date={time} locale="en-US"/></p> : null }
                        {props.streak_num > 0 ? <p>{props.streak_num}{props.streak_emoji}</p> : null}
                    </div>
                </ul>
            </li>
        }
        </>
    );

}
