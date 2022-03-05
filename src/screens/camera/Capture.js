import React, { useEffect, useState } from 'react';
import Footer from '../../components/footer/Footer';
import { isMobile } from 'react-device-detect';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SlidingMenu from '../../components/slidingMenu/SlidingMenu';
import Send from './Send';
import Navbar from '../../components/navbar/Navbar';
import './Camera.css';
import '../../components/navbar/Navbar.css'
import '../../components/footer/Footer.css'

export default function Capture({ width, height, close, img, changedToSend, save, backToCapture, userDoc }) {
	const [toggle, setToggle] = useState(false);
	const toggleSend = () => {
		setToggle(!toggle);
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
				<div className="floating-navbar main-navbar">
					<ul><li><button onClick={close} style={{ backgroundColor: 'transparent' }}><CloseRoundedIcon /></button></li></ul>
					<ul></ul>
				</div>
				<div className="captured-footer main-footer">
					<ul><li><button onClick={save}>Save</button></li></ul>
					{/* <ul><li><button onClick={changedToSend}>Send</button></li></ul> */}
					<ul><li><button onClick={toggleSend}>Send</button></li></ul>
				</div>
				<img id="capturedImg" src={img} />
			</div>
			<SlidingMenu open={toggle} close={toggleSend} title="Send">
				<Send height={height} width={width} img={img} close={close} backToCapture={backToCapture} userDoc={userDoc} />
			</SlidingMenu>
		</>
	)
}
