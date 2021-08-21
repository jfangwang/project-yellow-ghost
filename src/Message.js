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

    const [status, setStatus] = useState("Received");
    const [time, setTime] = useState(0);
    const [imgArr, setImgArr] = useState([]);

    const update_messages = () => {
        db.collection('posts')
        .doc(props.user_email)
        .collection("Received")
        .orderBy("timeStamp", "desc")
        .onSnapshot((snapshot) => {
            var i = 0;
            // Filters out all the photos sent by the sender
            while (i < snapshot.docs.length && snapshot.docs[i].data()["email"] != props.sender_email) { i = i + 1; }
            if (i < snapshot.docs.length) {
                if (snapshot.docs[i].data()["email"] == props.sender_email) {
                    setStatus("New Snap");
                    if (snapshot.docs[i].data()["timeStamp"] != null) {
                        setTime(snapshot.docs[i].data()["timeStamp"].toDate().toUTCString());
                    }
                } else {
                    setStatus("Received");
                }
            } else {
                setStatus("Received");
            }
        })
    }

    var status_output = <p>{status}</p>;
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
    const [imgid, setImgid] = useState(null);

    const open = () => {
        console.log("opening snap", props.user_email);
        db.collection('posts')
        .doc(props.user_email)
        .collection("Received")
        .orderBy("timeStamp", "desc")
        .get().then((snapshot) => {
            var i = 0;
            while (i < snapshot.docs.length && snapshot.docs[i].data()["email"] != props.sender_email) { i = i + 1; }
            if (i < snapshot.docs.length) {
                if (snapshot.docs[i].data()["email"] == props.sender_email) {
                    if (snapshot.docs[i].data() != null) {
                        setImg(snapshot.docs[i].data()["imageURL"]);
                        setImgid(snapshot.docs[i].data()["id"]);
                    }
                } else {
                    setStatus("Received");
                }
            } else {
                setStatus("Received");
            }
        })
    }

    const delete_photo = () => {
        storage.ref(`posts/${imgid}`).delete()
        .then((url) => {
            console.log("Deleted from storage: ", imgid);
        })
        .catch((error) => {
            console.log("TRIED DELETING: ", imgid)
        });
        db.collection('posts').doc(imgid).delete().then(() => {
          console.log("Deleted from firestore");
        }).catch((error) => {
          console.error("Error removing document: ", error);
        });
      }

    const close = () => {
        setImg(null);
        const img = db.collection('posts').doc(props.user_email).collection("Received").doc(imgid);
        img.delete().then(() => {
            console.log("Document deleted");
        }).catch((error) => {
            console.log("Error removing document: ", error);
        })
        update_messages();
        const sender = db.collection('posts').doc(props.sender_email).collection("Sent").doc(imgid);
        sender.get().then((doc) => {
            if (doc.data()["to"].length == 1) {
                sender.delete().then(() => {
                    console.log("sender document deleted, everyone saw the pic");
                }).catch((error) => {
                    console.log("Could not delete sender's document");
                })
                delete_photo();
            } else {
                // Update list if there are other people who have to see the post
                var i = 0;
                var arr = doc.data()["to"]
                arr.splice(arr.indexOf(props.user_email), 1)
                sender.update({to: arr}).then(() => {
                    console.log("Updated sender's list");
                }).catch((error) => {
                    console.log("could not update list: ", error);
                })
            }
        })
    }

    useEffect(() => {
        update_messages();
    })
    
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
                        {time != 0 ? <p><ReactTimeAgo date={time} locale="en-US"/></p> : null }
                        {props.streak_num > 0 ? <p>{props.streak_num}{props.streak_emoji}</p> : null}
                    </div>
                </ul>
            </li>
        }
        </>
    );

}
