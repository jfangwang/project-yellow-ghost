import React, { useEffect, useState } from 'react';
import './Message.css';
import { auth, db, provider, storage } from '../../utils/Firebase';
import PropTypes from 'prop-types';
import Guest from '../../assets/images/guest-profile-pic.png';
import ReactTimeago from 'react-timeago';
import { isMobile } from 'react-device-detect';
import firebase from 'firebase/app';
import { Store } from '@mui/icons-material';

export default function Message({ friend, streak_emoji, disableNavFootSlide, userDoc, height, width, loggedIn }) {
	const [ar, setar] = useState(9 / 16);
	const [opened, setOpened] = useState([]);
	const [img, setImg] = useState(null);
	const [snapId, setsnapId] = useState(null);
	const [lastUser, setLU] = useState(false);
	var icon_class = "message-" + friend["status"]
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
	var status = status_dict[friend["status"]]
	emoji = emoji_dict[friend["status"]]

	const open = () => {
		if (loggedIn) {
			if (Object.keys(friend.snaps).length > 0) {
				let firstSnapId = friend.snaps[Object.keys(friend.snaps)[0]].id;
				setsnapId(firstSnapId);
				// Get Image
				db.collection("Photos").doc(firstSnapId).get().then((doc) => {
					setImg(doc.data()['image_url'])
					disableNavFootSlide(true);
				})
				// Delete snap from userdoc
				let temp = userDoc;
				let key = Object.keys(friend.snaps)[0];
				delete temp['friends'][friend['id']]['snaps'][key]
				db.collection("Users").doc(userDoc['id']).update({
					[`friends.${friend['id']}.snaps`]: temp['friends'][friend['id']]['snaps']
				}).then(() => {
					if (Object.keys(temp['friends'][friend['id']]['snaps']).length <= 0) {
						const ts = new Date().toLocaleString();
						// Update Friend and User Doc if user is on last snap
						db.collection("Users").doc(friend['id']).update({
							[`friends.${userDoc['id']}.status`]: 'opened',
							[`friends.${userDoc['id']}.last_time_stamp`]: ts,
							[`friends.${userDoc['id']}.streakRef`]: ts,
						})

						// Update User Doc
						db.collection("Users").doc(userDoc['id']).update({
							[`friends.${friend['id']}.status`]: 'received',
							[`friends.${friend['id']}.last_time_stamp`]: ts,
							[`friends.${friend['id']}.snaps`]: [],
							[`friends.${friend['id']}.streakRef`]: ts,
						})
					}
				})
				// Update Photo Doc
				db.collection("Photos").doc(firstSnapId).get().then((doc) => {
					if (doc.data()['sent'].length <= 1) {
						setLU(true)
						// Move Photo id to deleteSnaps for pending delete
						db.collection("Users").doc(userDoc['id']).update({
							deleteSnaps: firebase.firestore.FieldValue.arrayUnion(firstSnapId),
						})
					} else {
						setLU(false)
						// Update Photo Doc
						db.collection("Photos").doc(firstSnapId).update({
							sent: firebase.firestore.FieldValue.arrayRemove(userDoc['id']),
						})
					}
				})
			} else {
				const ts = new Date().toLocaleString();
				db.collection("Users").doc(userDoc['id']).update({
					[`friends.${friend['id']}.status`]: 'received',
					[`friends.${friend['id']}.snaps`]: [],
				})
			}
		} else {
			// Guest Account
			let k = Object.keys(friend['snaps']).sort()[0];
			setImg(friend['snaps'][k]['src'])
			disableNavFootSlide(true);
		}
	}
	const close = () => {
		if (loggedIn) {
			if (snapId && lastUser) {
				deletePhoto(snapId)
				db.collection("Users").doc(userDoc['id']).update({
					deleteSnaps: firebase.firestore.FieldValue.arrayRemove(snapId),
				})
			}
			if (Object.keys(friend.snaps).length <= 0) {
				setImg(null);
				disableNavFootSlide(false);
			} else {
				open()
			}
		} else {
			// Guest Account
			let k = Object.keys(friend['snaps']).sort()[0];
			delete friend['snaps'][k]
			if (Object.keys(friend['snaps']).length > 0) {
				open();
			} else {
				friend['status'] = 'received'
				setImg(null);
				disableNavFootSlide(false);
			}
		}
	}
	const deletePhoto = (id) => {
		db.collection("Photos").doc(id).delete();
		storage.ref(`posts/${id}`).delete();
	}

	useEffect(() => {
		setar(9 / 16);
		if (img) {
			if (isMobile === false) {
				// setbh(null);
				// setbw(null);
				// console.log(window.innerHeight/window.innerWidth, 16/9)
				if (window.innerHeight / window.innerWidth > 16 / 9) {
					document.getElementById('receivedImg').style.height = 'auto';
					document.getElementById('receivedImg').style.width = '100%';
				} else {
					document.getElementById('receivedImg').style.height = '100%';
					document.getElementById('receivedImg').style.width = 'auto';
				}
			} else if (document.getElementById('receivedImg') !== null) {
				if (height > width) {
					setar(height / width);
					document.getElementById('receivedImg').style.height = '100%';
					document.getElementById('receivedImg').style.width = 'auto';
				} else {
					setar(height / width * 1.7);
					document.getElementById('receivedImg').style.height = '100%';
					document.getElementById('receivedImg').style.width = 'auto';
				}
			}
		}
	}, [height, width, img])

	return (
		<>
			{img ?
				<div className="img-overlay" style={{ height: height, width: width }} onClick={close}>
					<img id="receivedImg" src={img} />
				</div>
				:
				<li className="message-main row" onClick={friend["status"] === "new" ? open : null}>
					<div className="row">
						<img className="friend-profile-pic" src={friend["profile_pic_url"] === null ? Guest : friend["profile_pic_url"]} alt=""></img>
					</div>
					<div className="col">
						<h3>{friend["name"]}</h3>
						<div className="message-info">
							<div className="message-info-container">
								{emoji ? <p>{emoji}</p> : <div className={icon_class}></div>}
								<h5>{status}</h5>
							</div>
							<h5 className="time-stamp">{friend["last_time_stamp"] && friend['status'] !== 'not-friends' ? <> <div className="separator"></div> <ReactTimeago date={friend["last_time_stamp"]} /> </> : null}</h5>
							<div className="row">
								{friend["streak"] === null ? null : <>
									<div className="separator" style={{ marginRight: "0.3rem" }}></div>
									<h5>{friend["streak"]}</h5>
									<h5>{userDoc.streak_emoji ? userDoc.streak_emoji : streak_emoji}</h5>
								</>
								}
							</div>
						</div>
					</div>
				</li>
			}
		</>
	)
}
Message.defaultProps = {
	friend: {
		created: "today",
		profile_pic_url: Guest,
		name: "Guest",
		status: "new-friend",
		streak: 0,
		sent: 0,
		received: 0,
		last_time_stamp: null,
		snaps: [],
	},
	streak_emoji: "\u{1F525}",
	pic: "Guest",
	email: "Guest@Guest.com,",
	key: "Guest@Guest.com,"


}
Message.requiredProps = {
	friend: PropTypes.shape({
		created: PropTypes.string,
		profile_pic_url: PropTypes.string,
		name: PropTypes.string,
		status: PropTypes.string,
		streak: PropTypes.number,
		sent: PropTypes.number,
		received: PropTypes.number,
		last_time_stamp: PropTypes.string,
		snaps: PropTypes.arrayOf(PropTypes.string)
	}),
	streak_emoji: PropTypes.string,
	pic: PropTypes.string,
	email: PropTypes.string,
	key: PropTypes.string
}