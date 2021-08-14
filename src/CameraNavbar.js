import React from 'react';
import './Camera.css';
import './Messages.css';
import Camera from './Camera';

export default function CameraNavbar(props) {
    return (
        <div className="webcam-navbar">
					<div className="nav-box-1 webcam-nav-box">
					<ul>
					<li>
					{props.user_name == "Guest" ?
					<a onClick={props.login}>Sign In</a> :
					<img className="profile-pic" src={props.user_pic} onClick={props.logout} alt="Profile Picture" />
					}
				</li>
						<li><a>Search</a></li>
					</ul>
					</div>
					<div className="nav-box-3 webcam-nav-box">
					<ul>
						<li><a>Add Friend</a></li>
						<li><a>Flip Camera</a></li>
					</ul>
					</div>
        </div>
    )
}
