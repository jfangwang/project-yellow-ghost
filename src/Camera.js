import React from 'react';
// import React, { Component, useEffect, useState } from 'react';
import Webcam from "react-webcam";
import './Camera.css';
// import {storage, db} from './Firebase.js';
// import firebase from 'firebase/app';
// import { v4 as uuid } from "uuid";

export default function Camera(props) {
  const webcamRef = React.useRef(null);
  // const capture = React.useCallback(
  //   () => {
  //     // const img = webcamRef.current.getScreenshot({width:props.width, height:props.height});
  //     const img = webcamRef.current.getScreenshot();
  //   },
  //   [webcamRef]
  // );
  return (
    <>
    <div className="webcam-screen">
      <div className="navbar">
        {/* Placeholder */}
      </div>
      <Webcam
        id="imageElement"
        className="image-desktop"
        ref={webcamRef}
        audio={false}
        mirrored={true}
        forceScreenshotSourceSize={false}
        screenshotFormat="image/png"
        screenshotQuality={1}
        videoConstraints={{facingMode: props.faceMode}}
        />
      <div className="footer">
	  	  {/* Placeholder */}
			</div>
    </div>
    </>
  );
}
