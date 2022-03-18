import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { isMobile } from 'react-device-detect'
import { useDoubleTap } from 'use-double-tap'
import Capture from './Capture';
import Footer from '../../components/footer/Footer'
import './NewCam.css'

var stream = undefined;

export default function NewCam({ index, height, width, flipCamCounter, disableNavFootSlide, userDoc, setUserDoc, changeToIndex, toggleSnapShot, incFlipCam }) {
  const [img, setImg] = useState("");
  const [screen, setScreen] = useState("camera");
  const desktopConstraints = {
    audio: false,
    video: {
      facingMode: "environment",
      width: { min: 720 * 0.5625, ideal: 1920 * 0.5625, max: 3840 * 0.5625 },
      height: { min: 720, ideal: 1920, max: 3840 }
    }
  }
  const mobileConstraints = {
    audio: false,
    video: {
      facingMode: flipCamCounter % 2 === 0 ? "user" : "environment",
      height: { min: 1280 / height * width, ideal: 1920 / height * width },
      width: { min: 1280, ideal: 1920 }
    }
  }

  const double_tap = useDoubleTap(() => {
    incFlipCam()
  });

  function activateCam() {
    navigator.mediaDevices.getUserMedia(isMobile ? mobileConstraints : desktopConstraints)
      .then(mediaStream => {
        stream = mediaStream;
        const video = document.querySelector("#cam");
        video.srcObject = mediaStream;
      })
      .catch(function (err) {
        alert("Cam is denied")
      })
  }

  function activateCanvas() {
    const ctx = canvas.getContext('2d');
    const canvas = document.querySelector('#canvasCam');
    const video = document.querySelector("#cam");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
  }

  useEffect(() => {
    activateCam()
    // activateCanvas()
  }, [])

  useEffect(() => {
    if (stream !== undefined) {
      activateCam()
    }
  }, [flipCamCounter])

  useEffect(() => {

    if (stream !== undefined) {
      if (index == 1) {
        activateCam()
      } else {
        stream.getTracks().forEach(function (track) {
          track.stop();
        });
      }
    }
  }, [index])

  function capture() {
    const canvas = document.querySelector('#canvasCam');
    const video = document.querySelector("#cam");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    if (isMobile && flipCamCounter % 2 === 0) {
      canvas.getContext("2d").scale(-1, 1);
      canvas.getContext("2d").drawImage(video, canvas.width * -1, 0);
    } else {
      canvas.getContext("2d").drawImage(video, 0, 0);
    }
    setImg(canvas.toDataURL("image/png"));
    setScreen('captured');
    disableNavFootSlide(true);
  }
  function changedToSend() { setScreen('send') }
  function backToCapture() { setScreen('captured') }
  function save() { close() }
  function close() {
    setImg(null);
    setScreen('camera');
    disableNavFootSlide(false);
  }
  function sent() {
    setImg(null);
    setScreen('camera');
    disableNavFootSlide(false);
    changeToIndex(0);
  }

  const mirrorStyle = { transform: "scaleX(-1)" }
  return (
    <>
      <video
        autoPlay
        playsInline
        style={flipCamCounter % 2 === 0 ? mirrorStyle : null}
        height="100%"
        width="100%"
        id="cam"
      />
      <canvas
        id="canvasCam"
        className='canvas'
        style={{ position: "absolute" }}
        height={height}
        width={width}
      />

      <div
        className="camOverlay"
        style={{ position: "absolute", height: height, width: width }}
        {...double_tap}
      >
        <div>
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button className="capture-button" onClick={capture}></button>
          </div>
          <Footer type="relative" />
        </div>
      </div>

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
          setUserDoc={setUserDoc}
          sent={sent}
          toggleSnapShot={toggleSnapShot}
        />
      }

    </>

  )
}
