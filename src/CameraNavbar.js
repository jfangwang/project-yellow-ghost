import React from 'react';
import './Camera.css';
import './Messages.css';
import Camera from './Camera';

export default function CameraNavbar() {
    return (
        <div className="webcam-navbar">
					<div className="nav-box-1 webcam-nav-box">
					<ul>
						<li><a>Profile pic</a></li>
						<li><a>Search bar</a></li>
					</ul>
					</div>
					<div className="nav-box-3 webcam-nav-box">
					<ul>
						<li><a>Add Friends</a></li>
						<li><a>Flip Camera</a></li>
					</ul>
					</div>
        </div>
    )
}
