import React, { Component, useEffect, useState } from 'react';
import Webcam from "react-webcam";
import './Camera.css';
// import {storage, db} from './Firebase.js';
// import firebase from 'firebase/app';
// import { v4 as uuid } from "uuid";

export default function Camera(props) {
  const [img, setImg] = useState(null);
  const [screen, setScreen] = useState("camera");
  const [aspectRatio, setAspectRatio] = useState(16/9);

  const webcamRef = React.useRef(null);
  const capture = React.useCallback(
    () => {
      // const img = webcamRef.current.getScreenshot({width:props.width, height:props.height});
      setImg(webcamRef.current.getScreenshot());
      setScreen("captured")
      props.showNavbar(false)
      props.showFooter(false)
      props.disable_swiping(true)
    },
    [webcamRef]
  );
  const sendTo = () => {
    setScreen("send");
  }
  const send = () => {
    setImg(null);
    setScreen("camera");
    props.disable_swiping(false)
    props.showNavbar(true)
    props.showFooter(true)
  }
  const back = () => {
    setScreen("captured")
  }
  const close = () => {
    setImg(null);
    setScreen("camera");
    props.disable_swiping(false)
    props.showNavbar(true)
    props.showFooter(true)
  }

  return (
    <>
    <div className="webcam-screen">
      <div className="navbar" />

      <Webcam
        id="webcam"
        className="image-desktop"
        ref={webcamRef}
        audio={false}
        mirrored={true}
        forceScreenshotSourceSize={false}
        screenshotFormat="image/png"
        screenshotQuality={1}
        videoConstraints={{facingMode: props.faceMode}}
      />

      {screen === "camera" ? 
        <div className="webcam-overlay">
          <div className="navbar" />
          <button onClick={capture}>Capture</button>
        </div>
        : null
      }

      {screen === "captured" ?
        <>
        <div className="captured-overlay">
          <div className="navbar" />
          <img className="image-desktop" src={img} />
          <button onClick={sendTo}>Send to</button>
          <button onClick={close}>Close</button>
        </div>
        </>
        : null
      }

      {screen === "send" ?
        <div className="captured-overlay">
          <div className="navbar" />
          <button onClick={send}>Send</button>
          <button onClick={back}>Back</button>
        </div>
        : null
      }



      <div className="footer">
	  	  {/* Placeholder */}
			</div>
    </div>
    </>
  );
}
