import React, { useEffect, useState } from 'react';
import { storage, db} from '../util/Firebase.js';
import TimeAgo from 'react-timeago';
import { isMobile } from 'react-device-detect';
import './Messages.css';
import PropTypes from 'prop-types';

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

	useEffect(() => {
		if (img !== null) {
			if (isMobile === false) {
				if (window.innerHeight/window.innerWidth > 16/9) {
				  document.getElementById('opened-image').style.height = 'auto';
				  document.getElementById('opened-image').style.width = '100%';
				} else {
				  document.getElementById('opened-image').style.height = '100%';
				  document.getElementById('opened-image').style.width = 'auto';
				}
			} else {
				document.getElementById('opened-image').style.height = '100%';
				document.getElementById('opened-image').style.width = 'auto';
			}
		}
	}, [window.innerHeight, window.innerWidth, img])

	const open = () => {
		// Gets the latest snap
		var tempimg = props.friend["snaps"][props.friend["snaps"].length - 1];
		props.showNavbar(false)
    	props.showFooter(false)
		setimgid(tempimg)
		props.disable_swiping(true);


		if (props.loggedIn) {
			db.collection("Photos").doc(tempimg).get().then((doc) => {
				console.log("tempimg ", tempimg);
				setImg(doc.data()["image_url"]);
				setSent(doc.data()["sent"]);
				setOpened(doc.data()["opened"]);
			})
			// Update the User's (Receiver) doc
			const time = new Date().toLocaleString();
			var receiver_dict = {};
			var user_doc = db.collection("Users").doc(props.email);
			user_doc.get().then((doc) => {
				receiver_dict = doc.data();
				if (receiver_dict["friends"][props.k]["snaps"].length <= 1) {
					receiver_dict["friends"][props.k]["status"] = "received";
					receiver_dict["friends"][props.k]["last_time_stamp"] = time;
				} else {
					receiver_dict["friends"][props.k]["status"] = "new";
				}
				receiver_dict["friends"][props.k]["snaps"]
				.splice(receiver_dict["friends"][props.k]["snaps"].length - 1, 1);

				// Update Sender's doc
				var sender_doc = db.collection("Users").doc(props.k);
				sender_doc.get().then((doc) => {
					var sender_dict = doc.data();
					
					sender_dict["friends"][props.email]["profile_pic_url"] = props.pic;
					if (receiver_dict["friends"][props.k]["status"] === "received") {
						sender_dict["friends"][props.email]["status"] = "opened";
						sender_dict["friends"][props.email]["last_time_stamp"] = time;
					}
					
					sender_doc.update({
						friends: sender_dict["friends"],
					})
					user_doc.update({
						friends: receiver_dict["friends"],
					})
				})
			})
		} else {
			// Guest Account
			setImg(tempimg);
			var newDict = props.friends;

			if (newDict[props.k]["snaps"].length === 1) {
				newDict[props.k]["status"] = "received";
			} else {
				newDict[props.k]["status"] = "new";
			}
			newDict[props.k]["last_time_stamp"] = new Date().toLocaleString();
			newDict[props.k]["snaps"].splice(newDict[props.k]["snaps"].length - 1, 1);
			props.setLocalDict(newDict);
		}
	}
	const delete_photo = () => {
		if (props.loggedIn) {
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
	}
	const close = () => {
		props.showNavbar(true)
    	props.showFooter(true)
		props.disable_swiping(false);
		setImg(null);
		delete_photo();
	}

	var icon_class = "message-" + props.friend["status"]
	var emoji = null;
	var status_dict = {
		"new-friend": "New Friend!",
		new: "New Snap",
		received: "Received",
		sent: "Sent",
		opened: "Opened",
		pending: "Pending",
		"not-friends": "Unfriended You",
		blocked: "Blocked",
	}
	var emoji_dict = {
		"not-friends": "\u{1F494}",
		blocked: "\u{26D4}",
		pending: "\u{23F3}"
	}
	var status = status_dict[props.friend["status"]]
	emoji = emoji_dict[props.friend["status"]]
	// console.log(status);
	return (
			<>
			{img ?
				<div className="background-opened-image" onClick={close}>
					<img id="opened-image" src={img} alt="opened"/>
				</div>
				:
				<li className="list-container" onClick={props.friend["status"] === "new" ? open : null}>
					<div className="pic-container">
						<img className="friend-profile-pic" src={props.friend["profile_pic_url"]} alt="friend-profile-pic"></img>
					</div>
					<div className="friend-info">
						<h3>{props.friend["name"]}</h3>
						<div className="message-info">
							<div className="message-info-container">
								{emoji ? <p>{emoji}</p> : <div className={icon_class}></div>}
								<h5>{status} </h5>
							</div>
							<h5 className="time-stamp">{props.friend["last_time_stamp"] ? <> <div className="separator"></div> <TimeAgo date={props.friend["last_time_stamp"]} /> </> : null}</h5>
							<div className="streak-container">
									{props.friend["streak"] === null ? null : <>
										<div className="separator" style={{marginRight:"0.3rem"}}></div>
										<h5>{props.friend["streak"]}</h5>
										<h5>{props.streak_emoji}</h5>
										</>
									}
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
Message.requiredProps = {
	friend: PropTypes.shape({
		created: PropTypes.string,
		profile_pic_url: PropTypes.string,
		name: PropTypes.string,
		status: PropTypes.string,
		streak: PropTypes.number,
		streak_ref: PropTypes.string,
		sent: PropTypes.number,
		received: PropTypes.number,
		last_time_stamp: PropTypes.string,
		snaps: PropTypes.arrayOf(PropTypes.string)
	}),
	friends: PropTypes.objectOf(PropTypes.shape({
		created: PropTypes.string,
		profile_pic_url: PropTypes.string,
		name: PropTypes.string,
		status: PropTypes.string,
		streak: PropTypes.number,
		streak_ref: PropTypes.string,
		sent: PropTypes.number,
		received: PropTypes.number,
		last_time_stamp: PropTypes.string,
		snaps: PropTypes.arrayOf(PropTypes.string)
	})),
	streak_emoji: PropTypes.string,
	k: PropTypes.string,
	pic: PropTypes.string,
	email: PropTypes.string,
	loggedIn: PropTypes.bool,
	key: PropTypes.string
}