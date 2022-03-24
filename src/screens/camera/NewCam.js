import React, { useEffect, useState } from 'react'
import * as facemesh from '@tensorflow-models/face-landmarks-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import './NewCam.css'
import { isMobile } from 'react-device-detect';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import CancelIcon from '@mui/icons-material/Cancel';
import Stats from 'stats.js';
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';
import { TRIANGULATION } from './triangulation';
import { useDoubleTap } from 'use-double-tap';
import Face from './Face';
import Footer from '../../components/footer/Footer';
import Capture from './Capture';

export default function NewCam({
  loggedIn,
  index,
  height,
  width,
  flipCamCounter,
  disableNavFootSlide,
  userDoc,
  setUserDoc,
  changeToIndex,
  toggleSnapShot,
  incFlipCam
}) {
  const [screenMode, setScreenMode] = useState("camera")
  const [portrait, setPortrait] = useState(false);
  const [ar, setAr] = useState(16 / 9.5);
  const [TFLD, setTFLD] = useState(false);
  const [vidLoaded, setVidLoaded] = useState(false);
  const [stream, setStream] = useState(null);
  const [img, setImg] = useState(null);
  const [ctx, setCtx] = useState(null);

  const double_tap = useDoubleTap(() => {
    incFlipCam()
  });
  function changedToSend() { setScreenMode('send') }
  function backToCapture() { setScreenMode('captured') }
  function save() { close() }
  function close() {
    if (img.startsWith('blob:')) {
      URL.revokeObjectURL(img);
    }
    setImg(null);
    setScreenMode("camera")
    const canvas = document.getElementById('main-canvas');
    const video = document.getElementById("main-camera");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    disableNavFootSlide(false);
  }
  function toggleTFLD(e) {
    setTFLD(e)
    // if (e === false) {
    //   startCam()
    // } else {
    //   stopCam()
    // }
  }
  function capture() {
    const canvas = document.getElementById('main-canvas');
    const video = document.getElementById("main-camera");
    if (!canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height)
      .data.some(channel => channel !== 0)) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      if ((isMobile && flipCamCounter % 2 === 0) || !isMobile) {
        ctx.scale(-1, 1);
        ctx.drawImage(video, canvas.width * -1, 0);
      } else {
        ctx.drawImage(video, 0, 0);
      }
    }
    canvas.toBlob((blob) => {
      var url = URL.createObjectURL(blob)
      setImg(url)
    });
    setScreenMode('captured');
    disableNavFootSlide(true);
    // URL.revokeObjectURL(url);
  }
  function sent() {
    if (loggedIn && img.startsWith('blob:')) {
      URL.revokeObjectURL(img);
    }
    setImg(null);
    setScreenMode('camera');
    disableNavFootSlide(false);
    changeToIndex(0);
  }
  function startCam() {
    const canvas = document.getElementById('main-canvas');
    const video = document.getElementById("main-camera");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setAr(isMobile ? (portrait ? height / width : width / height) : 9.5 / 16)
    setVidLoaded(false)
    console.log("starting cam")
    document.querySelector(".cameraOverlay").classList.remove("fadeIn")
    document.querySelector(".cameraOverlay").classList.add("loading")
    const temp = {
      audio: false,
      video: {
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
    const video = document.querySelector("video");
    const canvas = document.getElementById('main-canvas');
    setCtx(canvas.getContext("2d"))
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
      console.log("portrait changed", portrait)
      startCam()
    }
  }, [portrait, flipCamCounter])

  useEffect(() => {
    if (index === 1 && screenMode === "camera") {
      stopCam()
      startCam()
    } else {
      toggleTFLD(false)
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
          transform: (flipCamCounter % 2 === 0 && isMobile) || (!isMobile) ? "scaleX(-1)" : "scaleX(1)",
          width: "100%",
          height: "100%",
          position: "absolute",
          display: "flex"
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
      {screenMode === "captured" &&
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
          ctx={ctx}
        />
      }
      {screenMode === "camera" && TFLD &&
        <Face
          height={height}
          width={width}
          flipCamCounter={flipCamCounter}
          incFlipCam={incFlipCam}
        />
      }
      {screenMode === "camera" &&
        <div
          className="cameraOverlay"
          style={{ position: "absolute", height: "100%", width: '100%' }}
          {...double_tap}
        >
          <div className="cameraFooter">
            <button style={{ visibility: 'hidden' }}>asdf</button>
            <button className="capture-button" type="button" onClick={screenMode === "camera" ? capture : close}>
            </button>
            {screenMode === "camera" &&
              <button type="button" id={TFLD ? "endFace" : "showFace"} onClick={TFLD ? () => toggleTFLD(false) : () => toggleTFLD(true)}>
                {TFLD ? <CancelIcon /> : <InsertEmoticonIcon />}
              </button>
            }
          </div>
          <Footer type="relative" />
        </div>
      }
    </div>
  )
}
