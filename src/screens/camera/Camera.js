import {React, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import { useDoubleTap } from 'use-double-tap';
import Webcam from 'react-webcam';
import logo from '../../assets/images/snapchat-logo.png';
import './Camera.css';

function Camera({index, height, width}) {
	const [ar, setar] = useState(9/16);
	const [img, setImg] = useState(null);

	useEffect(() => {
		if (isMobile === false) {
			setar(9/16);
			// setbh(null);
			// setbw(null);
			// console.log(window.innerHeight/window.innerWidth, 16/9)
			if (window.innerHeight/window.innerWidth > 16/9) {
				document.getElementById('webcam').style.height = 'auto';
				document.getElementById('webcam').style.width = '100%';
			} else {
				document.getElementById('webcam').style.height = '100%';
				document.getElementById('webcam').style.width = 'auto';
			}
		} else {
			if (window.innerHeight > window.innerWidth) {
				setar(window.innerHeight/window.innerWidth * 0.99);
				document.getElementById('webcam').style.height = '100%';
				document.getElementById('webcam').style.width = 'auto';
			} else {
				setar(window.innerHeight/window.innerWidth * 1.7);
				document.getElementById('webcam').style.height = '100%';
				document.getElementById('webcam').style.width = 'auto';
			}
		}
	}, [height, width])

  return (
	<div className='webcam-screen' style={{height:height, width:width}}>
		<Webcam
			id="webcam"
			audio={false}
			screenshotFormat="image/png"
			videoConstraints={{aspectRatio: ar, facingMode: "user"}}
		/>
	</div>
  )
}

Camera.propTypes = {}

export default Camera;
