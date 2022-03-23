import React, { useEffect, useState } from 'react'
import * as facemesh from '@tensorflow-models/face-landmarks-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import './NewCam.css'
import { isMobile } from 'react-device-detect';
import Stats from 'stats.js';
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';
import { TRIANGULATION } from './triangulation';
import Face from './Face';
import Footer from '../../components/footer/Footer'

export default function NewCam({ height, width, flipCamCounter, incFlipCam, index, }) {
  const [screenMode, setScreenMode] = useState("camera")
  const [portrait, setPortrait] = useState(false);
  const [ar, setAr] = useState(16 / 9.5);
  const [TFLD, setTFLD] = useState(false);
  const [vidLoaded, setVidLoaded] = useState(false);
  const [stream, setStream] = useState(null);

  function capture() {
    setScreenMode("capture")
  }
  function close() {
    setScreenMode("camera")
  }
  function toggleTFLD(e) {
    setTFLD(e)
  }
  function startCam() {
    setVidLoaded(false)
    console.log("starting cam")
    document.querySelector(".cameraOverlay").classList.remove("fadeIn")
    document.querySelector(".cameraOverlay").classList.add("loading")
    const temp = {
      audio: false,
      video: {
        facingMode: 'user',
        facingMode: flipCamCounter % 2 === 0 ? "user" : "environment",
        aspectRatio: {
          exact: isMobile ? (portrait ? height / width : width / height) : 9.5 / 16,
        },
        width: { ideal: 1920 },
        height: { ideal: 1920 },
      },
    }
    navigator.mediaDevices.getUserMedia(temp).then((mediaStream) => {
      setStream(mediaStream)
      document.querySelector("#main-camera").srcObject = mediaStream;
      // console.log(mediaStream.getVideoTracks()[0].getSettings())
    })
  }
  function stopCam() {
    if (stream !== null) {
      stream.getTracks().forEach(element => {
        element.stop()
      });
      document.querySelector("#main-camera").srcObject = null;
    }
  }

  useEffect(() => {
    setAr(isMobile ? (portrait ? height / width : width / height) : 9.5 / 16)
    const video = document.querySelector("video");
    video.onloadeddata = () => {
      console.log("Video loaded")
      setVidLoaded(true)
      document.querySelector(".cameraOverlay").classList.remove("loading")
      document.querySelector(".cameraOverlay").classList.add("fadeIn")
    }
  }, [])

  useEffect(() => {
    if (isMobile && height > width) {
      setPortrait(true)
    } else {
      setPortrait(false)
    }
  }, [height, width])

  useEffect(() => {
    if (isMobile) {
      setAr(isMobile ? (portrait ? height / width : width / height) : 9.5 / 16)
    }
  }, [portrait, flipCamCounter])

  useEffect(() => {
    if (index === 1 && screenMode === "camera") {
      stopCam()
      startCam()
    } else {
      stopCam()
    }
  }, [flipCamCounter, index, screenMode])

  return (
    <div
      className="main2"
      id="main"
      style={{
        width: width,
        height: height
      }}
    >
      <video
        autoPlay
        playsInline
        id="main-camera"
        style={{
          transform: "scaleX(-1)",
          width: "100%",
          height: "100%",
          position: "absolute",
          display: TFLD ? "none" : "flex"
        }}
      />
      <canvas
        id="main-canvas"
        style={{
          width: isMobile ? '100%' : (width / height < ar ? "100%" : "auto"),
          height: isMobile ? '100%' : (width / height > ar ? "100%" : "auto"),
          position: "absolute",
        }}
      >
      </canvas>
      {screenMode === "camera" && TFLD &&
        <Face
          height={height}
          width={width}
          flipCamCounter={flipCamCounter}
          incFlipCam={incFlipCam}
        />
      }
      <div
        className="cameraOverlay"
        style={{ position: "absolute", height: "100%", width: '100%' }}
      >
        {!TFLD &&
          <button type="button" onClick={screenMode === "camera" ? capture : close}>
            {screenMode === "camera" ? <p>Capture</p> : <p>Close</p>}
          </button>
        }
        <button type="button" id={TFLD ? "endFace" : "showFace"} onClick={TFLD ? () => toggleTFLD(false) : () => toggleTFLD(true)}>
          {TFLD ? <p>End Face</p> : <p>Show Face</p>}
        </button>
        <Footer type="relative" />
      </div>
    </div>
  )
}
