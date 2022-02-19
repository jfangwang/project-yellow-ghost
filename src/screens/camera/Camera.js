import {React, useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import { useDoubleTap } from 'use-double-tap';
import Webcam from 'react-webcam';
import logo from '../../assets/images/snapchat-logo.png';
import './Camera.css';


function Camera({index, height, width, flipCamCounter}) {
	const [ar, setar] = useState(9/16);
	const [img, setImg] = useState(null);
	const [faceMode, setFaceMode] = useState('environment');
	const flippy = useRef(null);
	const webcamRef = useRef(null);

	const double_tap = useDoubleTap(() => {
		if (faceMode === 'user') {
			setFaceMode('environment')
		} else {
			setFaceMode('user')
		}
		if (flippy) {
			flippy.current.toggle();
		}
	});

	useEffect(() => {
		if (faceMode === 'user') {
			setFaceMode('environment')
		} else {
			setFaceMode('user')
		}
		if (flippy) {
			flippy.current.toggle();
		}
		
	}, [flipCamCounter]);

	useEffect(() => {
		setar(9/16);
		if (isMobile === false) {
			// setbh(null);
			// setbw(null);
			// console.log(window.innerHeight/window.innerWidth, 16/9)
			if (window.innerHeight/window.innerWidth > 16/9) {
				document.getElementById('webcam').style.height = 'auto';
				document.getElementById('webcam').style.width = '100%';
				document.getElementById('webcam2').style.height = 'auto';
				document.getElementById('webcam2').style.width = '100%';
			} else {
				document.getElementById('webcam').style.height = '100%';
				document.getElementById('webcam').style.width = 'auto';
				document.getElementById('webcam2').style.height = '100%';
				document.getElementById('webcam2').style.width = 'auto';
			}
		} else if (document.getElementById('webcam') !== null) {
			if (height > width) {
				setar(height/width * 1.1);
				document.getElementById('webcam').style.height = '100%';
				document.getElementById('webcam').style.width = 'auto';
			} else {
				setar(height/width * 1.7);
				document.getElementById('webcam').style.height = '100%';
				document.getElementById('webcam').style.width = 'auto';
			}
		}
	}, [height, width])

  return (
	<div className='webcam-screen' style={{height:height, width:width}}>
		{/* <div id="webcam"></div><div id="webcam2"></div> */}
		<Flippy
			flipOnHover={false} // default false
			flipOnClick={true} // default false
			flipDirection="horizontal" // horizontal or vertical
			ref={flippy}
			style={{height:window.innerHeight, width: width}} /// these are optional style, it is not necessary
		>
			{isMobile ?
			<>
			<FrontSide id="flip1" style={{backgroundImage: `url(${logo})`}} >
				{faceMode === "environment" &&
					<Webcam
					id="webcam"
					ref={webcamRef}
					audio={false}
					forceScreenshotSourceSize={false}
					screenshotFormat="image/png"
					screenshotQuality={1}
					videoConstraints={{facingMode: faceMode, aspectRatio: ar}}
				/>
				}
			</FrontSide>
			<BackSide id="flip2" style={{backgroundImage: `url(${logo})`}}>
				{faceMode === "user" &&
					<Webcam
						id="webcam"
						ref={webcamRef}
						audio={false}
						mirrored={true}
						forceScreenshotSourceSize={false}
						screenshotFormat="image/png"
						screenshotQuality={1}
						videoConstraints={{facingMode: faceMode, aspectRatio: ar}}
					/>
				}
			</BackSide>
			</> 
			:
			<>
			<FrontSide id="flip1" style={{backgroundImage: `url(${logo})`}} >
					<Webcam
						id="webcam"
						ref={webcamRef}
						audio={false}
						forceScreenshotSourceSize={false}
						screenshotFormat="image/png"
						screenshotQuality={1}
						videoConstraints={{facingMode: "environment", aspectRatio: ar}}
					/>
			</FrontSide>
			<BackSide id="flip2" style={{backgroundImage: `url(${logo})`}}>
					<Webcam
						id="webcam2"
						ref={webcamRef}
						audio={false}
						mirrored={true}
						forceScreenshotSourceSize={false}
						screenshotFormat="image/png"
						screenshotQuality={1}
						videoConstraints={{facingMode: "user", aspectRatio: ar}}
					/>
			</BackSide>
			</>
			}
		</Flippy>
		<div id='flip1' style={{height: height, width: width, position: 'absolute', backgroundColor: 'transparent'}} {...double_tap}>
		</div>
	</div>
  )
}

Camera.propTypes = {}

export default Camera;
