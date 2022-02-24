import React, {useEffect} from 'react';
import Footer from '../../components/footer/Footer';
import { isMobile } from 'react-device-detect';
import Send from './Send';
import './Camera.css';
import '../../components/navbar/Navbar.css'
import '../../components/footer/Footer.css'

export default function Capture({width, height, close, img, setScreen}) {
    useEffect(() => {
		if (isMobile === false) {
			if (height/width > 16/9) {
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
    <div className="captured-screen" style={{height: height, width: width}}>
		<div className="floating-navbar main-navbar">
			<ul><li><button onClick={close}>Close</button></li></ul>
			<ul></ul>
		</div>
		{/* <div className="floating-footer main-navbar">
			<ul><li><button>Save</button></li></ul>
			<ul><li><button onClick={setScreen("send")}>Send</button></li></ul>
		</div> */}
        <img id="capturedImg" src={img} />
    </div>
  )
}
