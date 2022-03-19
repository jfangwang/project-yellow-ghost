import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { isMobile } from 'react-device-detect'
import { useDoubleTap } from 'use-double-tap'
import Capture from './Capture';
import Footer from '../../components/footer/Footer'
import './NewCam.css'
import { AspectRatio } from '@mui/icons-material';

export default function NewCam({ index, height, width, flipCamCounter, disableNavFootSlide, userDoc, setUserDoc, changeToIndex, toggleSnapShot, incFlipCam }) {
  const [img, setImg] = useState(null);
  const [screen, setScreen] = useState("camera");
  const [vidLoaded, setVidLoaded] = useState(false);
  const [arr, setArr] = useState([])
  const [camH, setcamH] = useState(null);
  const [camW, setcamW] = useState(null);
  const [ar, setAr] = useState(9.5/16);
  const [stream, setStream] = useState(null);
  const mirrorStyle = { transform: "scaleX(-1)" }

  const double_tap = useDoubleTap(() => {
    incFlipCam()
  });

  function capture() {
    const canvas = document.querySelector('#canvasCam');
    const video = document.querySelector("#cam");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    if ((isMobile && flipCamCounter % 2 === 0) || !isMobile) {
      canvas.getContext("2d").scale(-1, 1);
      canvas.getContext("2d").drawImage(video, canvas.width * -1, 0);
    } else if (isMobile) {
      // canvas.getContext("2d").scale(-1, 1);
      canvas.getContext("2d").drawImage(video, 0, 0);
    }
    // console.log(canvas.toDataURL("image/png"))
    var image = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
    console.log(image)
    // setImg(canvas.toDataURL("image/png"));
    // setScreen('captured');
    // disableNavFootSlide(true);
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
  const temp = {
    audio: false,
    video: {
      facingMode: flipCamCounter % 2 === 0 ? "user" : "environment",
    }
  }

  function startCam() {
    setVidLoaded(false)
    document.querySelector(".camOverlay").classList.remove("fadeIn")
    document.querySelector(".camOverlay").classList.add("loading")
    navigator.mediaDevices.getUserMedia(temp).then((mediaStream) => {
      setStream(mediaStream)
      if (mediaStream.getVideoTracks().length > 0) {
        if (isMobile) {
          setAr(width/height)
          setcamH(mediaStream.getVideoTracks()[0].getCapabilities().height.max)
          setcamW(mediaStream.getVideoTracks()[0].getCapabilities().width.max)
        } else {
          setcamH(mediaStream.getVideoTracks()[0].getCapabilities().height.max)
          setcamW(mediaStream.getVideoTracks()[0].getCapabilities().height.max * ar)
        }
        mediaStream.getVideoTracks()[0].applyConstraints({
          height: !isMobile ? mediaStream.getVideoTracks()[0].getCapabilities().height.max :
                              width/height * mediaStream.getVideoTracks()[0].getCapabilities().width.max,

          width: !isMobile ? mediaStream.getVideoTracks()[0].getCapabilities().height.max * ar :
          mediaStream.getVideoTracks()[0].getCapabilities().width.max,
        }).then(() => {
          document.querySelector("#cam").srcObject = mediaStream;
          console.log(mediaStream.getVideoTracks()[0].getCapabilities().height.max,
                      mediaStream.getVideoTracks()[0].getCapabilities().width.max)
        })
      }
    })
  }

  function stopCam() {
    if (stream !== null) {
      stream.getTracks().forEach(element => {
        element.stop()
      });
      document.querySelector("#cam").srcObject = null;
    }
  }

  useEffect(() => {
    startCam()
    const video = document.querySelector("video");
    video.addEventListener("loadeddata", function () {
      setVidLoaded(true)
      document.querySelector(".camOverlay").classList.remove("loading")
      document.querySelector(".camOverlay").classList.add("fadeIn")
    });
  }, [])

  useEffect(() => {
    if (index === 1 && screen === "camera") {
      stopCam()
      startCam()
    } else {
      stopCam()
    }
  }, [flipCamCounter, index, screen])

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
          <div className="captureFooter" style={{ display: "flex", justifyContent: "center" }}>
          <p>{arr}</p>
            <button className="capture-button" onClick={vidLoaded && img === null ? capture : null}></button>
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
