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
	const [img, setImg] = useState(null);
	const [sent, setSent] = useState([]);
	const [opened, setOpened] = useState([]);
	const [imgid, setimgid] = useState([]);
	

	const open = () => {
		// Gets the latest snap
		var tempimg = props.friend["snaps"][props.friend["snaps"].length - 1];
		props.showNavbar(false)
    props.showFooter(false)
		setimgid(tempimg)
		db.collection("Photos").doc(tempimg).get().then((doc) => {
			setImg(doc.data()["image_url"]);
			setSent(doc.data()["sent"]);
			setOpened(doc.data()["opened"]);
		})
		

		// Update Sender's doc
		const time = new Date().toLocaleString();
		var sender_doc = db.collection("Users").doc(props.k);
		sender_doc.get().then((doc) => {
			var sender_dict = doc.data();
			sender_dict["friends"][props.email]["last_time_stamp"] = time;
			sender_dict["friends"][props.email]["profile_pic_url"] = props.pic;
			sender_dict["friends"][props.email]["status"] = "opened";
			sender_doc.update({
				friends: sender_dict["friends"],
			})
		})
		// Update the User's (Receiver) doc
		var user_doc = db.collection("Users").doc(props.email);
		user_doc.get().then((doc) => {
			var receiver_dict = doc.data();
			receiver_dict["friends"][props.k]["last_time_stamp"] = time;

			if (receiver_dict["friends"][props.k]["snaps"].length <= 1) {
				receiver_dict["friends"][props.k]["status"] = "received";
			} else {
				receiver_dict["friends"][props.k]["status"] = "new";
			}
			receiver_dict["friends"][props.k]["snaps"]
			.splice(receiver_dict["friends"][props.k]["snaps"].length - 1, 1);
			user_doc.update({
				friends: receiver_dict["friends"],
			})
		})

	}
	const delete_photo = () => {
		// Delete photo if it is the last user to see it
		if (sent.length <= 1) {
			// Delete from storage
			storage.ref(`posts/${imgid}`).delete().catch((error) => {});
			// Delete from Firestore
			db.collection("Photos").doc(imgid).delete().catch((error) => {});
			console.log("deleted")
		} else {
			// Update Photo document
			var newSent = sent;
			var newOpened = opened;
			db.collection("Photos").doc(imgid).update({
				sent: newSent.splice(newSent.indexOf(props.email), 1),
				opened: newOpened.push(props.email),
			})
			console.log("updated")
		}
	}
	const close = () => {
		props.showNavbar(true)
    props.showFooter(true)
		setImg(null);
		delete_photo();
	}

	var icon_class = "message-" + props.friend["status"]
	var status_dict = {
		["new-friend"]: "New Friend!",
		new: "New Snap",
		received: "Received",
		sent: "Sent",
		opened: "Opened",
		pending: "Pending",
		["not-friends"]: "Unfriended You",
		blocked: "Blocked",
	}
	var status = status_dict[props.friend["status"]]
	// console.log(status);
	return (
			<>
			{img ?
				<div className="background-opened-image" onClick={close}>
					<img className="opened-image" src={img} />
				</div>
				:
				<li className="list-container" onClick={props.friend["status"] === "new" ? open : null}>
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
			}
			
			
			</>
	)

}
