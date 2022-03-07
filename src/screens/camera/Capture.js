import React, { useEffect, useState } from 'react';
import Footer from '../../components/footer/Footer';
import { isMobile } from 'react-device-detect';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SlidingMenu from '../../components/slidingMenu/SlidingMenu';
import CloseIcon from '../../assets/images/close.png'
import Send from './Send';
import Navbar from '../../components/navbar/Navbar';
import './Camera.css';
import '../../components/navbar/Navbar.css'
import '../../components/footer/Footer.css'
import zIndex from '@mui/material/styles/zIndex';

export default function Capture({ width, height, close, img, changedToSend, save, backToCapture, userDoc, setUserDoc }) {
	const [toggle, setToggle] = useState(false);
	const [swipe, setSwipe] = useState(false);
	const toggleSend = () => {
		setToggle(!toggle);
	}
	const toggleSwipe = (e) => {
		if (e === false) {
			setSwipe(e);
		}
		if (e === true) {
			setSwipe(e);
		}
	}
	useEffect(() => {
		if (isMobile === false) {
			if (height / width > 16 / 9) {
				document.getElementById('capturedImg').style.height = 'auto';
				document.getElementById('capturedImg').style.width = '100%';
			} else {
				document.getElementById('capturedImg').style.height = '100%';
				document.getElementById('capturedImg').style.width = 'auto';
			}
		} else if (document.getElementById('capturedImg') !== null) {
			if (height > width) {
				document.getElementById('capturedImg').style.height = '100%';
				document.getElementById('capturedImg').style.width = 'auto';
			} else {
				document.getElementById('capturedImg').style.height = '100%';
				document.getElementById('capturedImg').style.width = 'auto';
			}
		}
	}, [height, width])
	return (
		<>
			<div className="captured-screen" style={{ height: height, width: width }}>
				<div className="floating-navbar main-navbar capture-navbar" style={{ backgroundColor: 'transparent', zIndex: 1 }}>
					<button className="closeButton shadow" onClick={close}><CloseRoundedIcon className="closeIcon" style={{height: '2.5rem', width: '2.5rem'}} /></button>
					<ul></ul>
				</div>
				<div className="captured-footer main-footer">
					<button onClick={save}>Save</button>
					{/* <ul><li><button onClick={changedToSend}>Send</button></li></ul> */}
					<button onClick={toggleSend}>Send To</button>
				</div>
				<img id="capturedImg" src={img} />
			</div>
			<SlidingMenu open={toggle} close={toggleSend} title="Send" disabled={swipe} keyboard={false}>
				<Send height={height} width={width} img={img} close={close} backToCapture={backToCapture} userDoc={userDoc} setUserDoc={setUserDoc} toggleSwipe={toggleSwipe}/>
			</SlidingMenu>
		</>
	)
}
