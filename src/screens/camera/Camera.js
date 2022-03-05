import React, { useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import { useDoubleTap } from 'use-double-tap';
import Webcam from 'react-webcam';
import logo from '../../assets/images/snapchat-background.gif';
import './Camera.css';
import './Send.css';
import Footer from '../../components/footer/Footer'
import Capture from './Capture';
import Send from './Send';


function Camera({index, height, width, flipCamCounter, disableNavFootSlide, userDoc}) {
	const [ar, setar] = useState(9/16);
	const [img, setImg] = useState(null);
	const [faceMode, setFaceMode] = useState('environment');
	const flippy = useRef(null);
	const webcamRef = useRef(null);
	const [screen, setScreen] = useState("camera");

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

	const capture = React.useCallback(
		() => {
			// document.getElementById("capture-audio").play()
			setImg(webcamRef.current.getScreenshot());
			setScreen('captured');
			disableNavFootSlide(true);
		},
		[webcamRef]
	);
	function changedToSend() { setScreen('send') }
	function backToCapture() { setScreen('captured') }
	function save() { close() }
	function close() {
		setImg(null);
		setScreen('camera');
		disableNavFootSlide(false);
	}

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
				setar(height/width);
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
				flipOnClick={false} // default false
				flipDirection="horizontal" // horizontal or vertical
				ref={flippy}
				style={{height:window.innerHeight, width: width}} /// these are optional style, it is not necessary
				{...double_tap}
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
		{screen === "camera" &&
			<div className="cam-footer">
				<button className="capture-button" onClick={capture}></button>
				<Footer type="relative"/>
			</div>
		}
		{screen === "captured" &&
			<Capture
				height={height}
				width={width}
				img={img}
				close={close}
				changedToSend={changedToSend}
				save={save}
				backToCapture={backToCapture}
				userDoc={userDoc}
			/>
		}
		{screen === "send" && (null)
			// <Send height={height} width={width} img={img} close={close} backToCapture={backToCapture} userDoc={userDoc}/>
		}
	</div>
  )
}

Camera.propTypes = {}

export default Camera;
