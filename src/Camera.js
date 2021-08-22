import React, { Component, useEffect, useState } from 'react';
import Webcam from "react-webcam";
import { v4 as uuid } from "uuid";
import './Camera.css';
import {storage, db} from './Firebase.js';
import firebase from 'firebase/app';

export default function Camera(props) {
  const webcamRef = React.useRef(null);
  const capture = React.useCallback(
    () => {
      // const img = webcamRef.current.getScreenshot({width:props.width, height:props.height});
      const img = webcamRef.current.getScreenshot();
    },
    [webcamRef]
  );
  return (
    <>
    <div className="webcam-screen">
    <div className="navbar">
    <div className="nav-box-2">
      <h1>Chat</h1>
    </div>
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
        videoConstraints={{facingMode: "User"}}
      />
    </div>
    </>
  );
}
