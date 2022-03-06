import React, { useEffect, useState } from 'react';
import './Message.css';
import PropTypes from 'prop-types';
import Guest from '../../assets/images/guest-profile-pic.png';
import ReactTimeago from 'react-timeago';
import { isMobile } from 'react-device-detect';

export default function Message({ friend, streak_emoji, disableNavFootSlide, userDoc, height, width }) {
	const [ar, setar] = useState(9 / 16);
	const [opened, setOpened] = useState([]);
	const [img, setImg] = useState(null);
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
		setImg("https://firebasestorage.googleapis.com/v0/b/ghost-f8b34.appspot.com/o/posts%2F01f43a64-b528-420b-abdb-e022c57493ac?alt=media&token=513aa215-8c3b-4a96-87cc-9df2c13b7c6e");
		disableNavFootSlide();
	}
	const close = () => {
		setImg(null);
		disableNavFootSlide();
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
				<div className="img-overlay" style={{height:height, width: width}} onClick={close}>
					<img id="receivedImg" src={img}/>
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