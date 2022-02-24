import React from 'react';
import './Message.css';
import PropTypes from 'prop-types';
import TimeAgo from 'javascript-time-ago';
import Guest from '../../assets/images/guest-profile-pic.png';

export default function Message({friend, streak_emoji}) {
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
  return (
    <li className="message-main row" onClick={friend["status"] === "new" ? null : null}>
        <div className="row">
            <img className="friend-profile-pic" src={friend["profile_pic_url"] === null ? Guest : friend["profile_pic_url"]} alt="friend-profile-pic"></img>
        </div>
        <div className="col">
            <h3>{friend["name"]}</h3>
            <div className="message-info">
                <div className="message-info-container">
                    {emoji ? <p>{emoji}</p> : <div className={icon_class}></div>}
                    <h5>{status} </h5>
                </div>
                {/* <h5 className="time-stamp">{friend["last_time_stamp"] ? <> <div className="separator"></div> <TimeAgo date={friend["last_time_stamp"]} /> </> : null}</h5> */}
                <div className="row">
                        {friend["streak"] === null ? null : <>
                            <div className="separator" style={{marginRight:"0.3rem"}}></div>
                            <h5>{friend["streak"]}</h5>
                            <h5>{streak_emoji}</h5>
                            </>
                        }
                </div>
            </div>
        </div>
    </li>
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