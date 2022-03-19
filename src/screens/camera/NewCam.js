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
  const [desktopConstraints, setdesktopConstraints] = useState({
    audio: false,
    video: {
      aspectRatio: 9.5 / 16,
      facingMode: "user",
      width: { ideal: 4096 },
      height: { ideal: 2160 },
    }
  })
  const [mobileConstraints, setmobileConstraints] = useState({
    audio: false,
    video: {
      facingMode: flipCamCounter % 2 === 0 ? "user" : "environment",
      aspectRatio: width / height,
      width: { ideal: 4096 },
      height: { ideal: 2160 },
    }
  })

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
        if (!isMobile && Object.keys(desktopConstraints['video']['width']).includes('ideal')) {
          // Get Resolution of user's camera
          setdesktopConstraints({
            audio: false,
            video: {
              aspectRatio: 9.5 / 16,
              facingMode: "user",
              width: 9.5 / 16 * mediaStream.getVideoTracks()[0].getSettings().height,
              height: mediaStream.getVideoTracks()[0].getSettings().height,
            }
          })
        } else if (isMobile && Object.keys(mobileConstraints['video']['width']).includes('ideal')) {
          // setmobileConstraints({
          //   audio: false,
          //   video: {
          //     aspectRatio: height/width,
          //     facingMode: flipCamCounter % 2 === 0 ? "user" : "environment",
          //     width: width/height * mediaStream.getVideoTracks()[0].getSettings().width,
          //     height: mediaStream.getVideoTracks()[0].getSettings().width,
          //   }
          // })
        }
      })
      .catch(function (err) {
        alert("Camera is disabled")
      })
  }

  function fixOrientation() {
    if (isMobile && width > height) {
      setmobileConstraints({
        audio: false,
        video: {
          facingMode: flipCamCounter % 2 === 0 ? "user" : "environment",
          height: { min: 1280 / width * height, ideal: 1920 / width * height },
          width: { min: 1280, ideal: 1920 },
          aspectRatio: 9.5 / 16,
        }
      })
      if (screen === "camera") {
        activateCam()
      }
    } else if (isMobile) {
      setmobileConstraints({
        audio: false,
        video: {
          facingMode: flipCamCounter % 2 === 0 ? "user" : "environment",
          height: { min: 1280 / width * height, ideal: 1920 / width * height },
          width: { min: 1280, ideal: 1920 },
          aspectRatio: height / width,
        }
      })
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
    fixOrientation()
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

  useEffect(() => {
    activateCam();
  }, [desktopConstraints, mobileConstraints])

  function capture() {
    const canvas = document.querySelector('#canvasCam');
    const video = document.querySelector("#cam");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    if (isMobile && flipCamCounter % 2 === 0) {
      canvas.getContext("2d").scale(-1, 1);
      canvas.getContext("2d").drawImage(video, canvas.width * -1, 0);
    } else if (isMobile) {
      // canvas.getContext("2d").scale(-1, 1);
      canvas.getContext("2d").drawImage(video, 0, 0);
    } else {
      canvas.getContext("2d").scale(-1, 1);
      canvas.getContext("2d").drawImage(video, canvas.width * -1, 0);
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
