import React from 'react'
import './Footer.css';
import CameraIcon from '../images/camera-icon.png';
import ChatIcon from '../images/chat.png';


export default function Footer(props) {
  return (
    <>
		<div className="footer app-foot">
			<li className="footer-item" onClick={() => props.changeToIndex(0)}>{props.index === 0 ? <img className="footer-chat-icon" style={{backgroundColor: 'lightblue'}} src={ChatIcon} alt="footer" />  : <img className="footer-chat-icon"  src={ChatIcon} alt="footer" />}</li>
			<li className="footer-item"  onClick={() => props.changeToIndex(1)}>{props.index === 1 ? <img className="footer-camera-icon" style={{backgroundColor: 'yellow'}} src={CameraIcon} alt="footer" /> : <img className="footer-camera-icon" src={CameraIcon} alt="footer"/>}</li>
		</div>
		</>
  )
}
