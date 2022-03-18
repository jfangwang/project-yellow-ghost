import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { isMobile } from 'react-device-detect'
import { useDoubleTap } from 'use-double-tap'
import Capture from './Capture';
import Footer from '../../components/footer/Footer'
import './NewCam.css'
import { AspectRatio } from '@mui/icons-material';

var stream = undefined;

export default function NewCam({ index, height, width, flipCamCounter, disableNavFootSlide, userDoc, setUserDoc, changeToIndex, toggleSnapShot, incFlipCam }) {
  const [img, setImg] = useState(null);
  const [screen, setScreen] = useState("camera");
  const [vidLoaded, setVidLoaded] = useState(false);
  const desktopConstraints = {
    audio: false,
    video: {
      facingMode: "user",
      width: { min: 720 * 0.5625, ideal: 1920 * 0.5625, max: 3840 * 0.5625 },
      height: { min: 720, ideal: 1920, max: 3840 },
      aspectRatio: 9.5 / 16,
    }
  }
  var mobileConstraints = {
    audio: false,
    video: {
      facingMode: flipCamCounter % 2 === 0 ? "user" : "environment",
      height: { min: 1280 / width * height, ideal: 1920 / width * height },
      width: { min: 1280, ideal: 1920 },
      aspectRatio: height / width,
    }
  }

  const double_tap = useDoubleTap(() => {
    incFlipCam()
  });

  function activateCam() {
    setVidLoaded(false)
    document.querySelector(".camOverlay").classList.remove("fadeIn")
    document.querySelector(".camOverlay").classList.add("loading")
    console.log("Camera Activated")
    navigator.mediaDevices.getUserMedia(isMobile ? mobileConstraints : desktopConstraints)
      .then(mediaStream => {
        stream = mediaStream;
        const video = document.querySelector("#cam");
        video.srcObject = mediaStream;
      })
      .catch(function (err) {
        alert("Camera is disabled")
      })
  }

  function fixOrientation() {
    if (isMobile && width > height) {
      mobileConstraints = {
        audio: false,
        video: {
          facingMode: flipCamCounter % 2 === 0 ? "user" : "environment",
          height: { min: 1280 / width * height, ideal: 1920 / width * height },
          width: { min: 1280, ideal: 1920 },
          aspectRatio: 9.5 / 16,
        }
      }
      if (screen === "camera") {
        activateCam()
      }
    } else {
      mobileConstraints = {
        audio: false,
        video: {
          facingMode: flipCamCounter % 2 === 0 ? "user" : "environment",
          height: { min: 1280 / width * height, ideal: 1920 / width * height },
          width: { min: 1280, ideal: 1920 },
          aspectRatio: height / width,
        }
      }
      if (screen === "camera") {
        activateCam()
      }
    }
  }

  useEffect(() => {
    activateCam()
    const video = document.querySelector("video");
    video.addEventListener("loadeddata", function () {
      setVidLoaded(true)
      document.querySelector(".camOverlay").classList.remove("loading")
      document.querySelector(".camOverlay").classList.add("fadeIn")
    });
  }, [])

  useEffect(() => {
    if (stream !== undefined) {
      if (isMobile) {
        fixOrientation()
      } else {
        activateCam()
      }
    }
  }, [flipCamCounter])

  useEffect(() => {
    if (isMobile) {
      fixOrientation()
    }
  }, [height, width])

  useEffect(() => {

    if (stream !== undefined) {
      if (index === 1 && screen === "camera") {
        if (isMobile) {
          fixOrientation()
        } else {
          activateCam()
        }
      } else {
        stream.getTracks().forEach(function (track) {
          track.stop();
        });
      }
    }
  }, [index, screen])

  function capture() {
    const canvas = document.querySelector('#canvasCam');
    const video = document.querySelector("#cam");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    if (isMobile && flipCamCounter % 2 === 0) {
      canvas.getContext("2d").scale(-1, 1);
      canvas.getContext("2d").drawImage(video, canvas.width * -1, 0);
    }
    canvas.getContext("2d").drawImage(video, 0, 0);
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
        style={(flipCamCounter % 2 === 0 && isMobile) || (!isMobile) ? mirrorStyle : null}
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
            <button className="capture-button" onClick={vidLoaded ? capture : null}></button>
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
