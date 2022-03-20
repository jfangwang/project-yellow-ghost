import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { isMobile } from 'react-device-detect'
import { useDoubleTap } from 'use-double-tap'
import Capture from './Capture';
import Footer from '../../components/footer/Footer'
import './NewCam.css'
import { AspectRatio } from '@mui/icons-material';

export default function NewCam({ loggedIn, index, height, width, flipCamCounter, disableNavFootSlide, userDoc, setUserDoc, changeToIndex, toggleSnapShot, incFlipCam }) {
  const [img, setImg] = useState(null);
  const [screen, setScreen] = useState("camera");
  const [vidLoaded, setVidLoaded] = useState(false);
  const [arr, setArr] = useState([])
  const [camH, setcamH] = useState(null);
  const [camW, setcamW] = useState(null);
  const [ar, setAr] = useState(16/9.5);
  const [stream, setStream] = useState(null);
  const [portrait, setPortrait] = useState(false)
  const mirrorStyle = { transform: "scaleX(-1)" }

  const double_tap = useDoubleTap(() => {
    incFlipCam()
  });

  function capture() {
    const canvas = document.querySelector('#canvasCam');
    const video = document.querySelector("#cam");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    setArr([canvas.width, canvas.height, video.videoWidth, video.videoHeight])
    const ctx = canvas.getContext("2d");
    if ((isMobile && flipCamCounter % 2 === 0) || !isMobile) {
      ctx.scale(-1, 1);
      ctx.drawImage(video, canvas.width * -1, 0);
    } else {
      ctx.drawImage(video, 0, 0);
    }
    canvas.toBlob((blob) => {
      var url = URL.createObjectURL(blob)
      setImg(url)
    });
    setScreen('captured');
    disableNavFootSlide(true);
    // URL.revokeObjectURL(url);
  }
  function changedToSend() { setScreen('send') }
  function backToCapture() { setScreen('captured') }
  function save() { close() }
  function close() {
    if (img.startsWith('blob:')) {
      URL.revokeObjectURL(img);
    }
    setImg(null);
    setScreen('camera');
    disableNavFootSlide(false);
  }
  function sent() {
    if (loggedIn && img.startsWith('blob:')) {
      URL.revokeObjectURL(img);
    }
    setImg(null);
    setScreen('camera');
    disableNavFootSlide(false);
    changeToIndex(0);
  }
  const temp = {
    audio: false,
    video: {
      facingMode: flipCamCounter % 2 === 0 ? "user" : "environment",
      aspectRatio: {
        exact: isMobile ? (portrait ? height/width : width/height) : 9.5/16
      },
      height: {ideal: 1920},
      width: {ideal: 1920}
    }
  }

  function startCam() {
    setVidLoaded(false)
    document.querySelector(".camOverlay").classList.remove("fadeIn")
    document.querySelector(".camOverlay").classList.add("loading")
    navigator.mediaDevices.getUserMedia(temp).then((mediaStream) => {
      setStream(mediaStream)
      document.querySelector("#cam").srcObject = mediaStream;
      // console.log(mediaStream.getVideoTracks()[0].getSettings())
      var a = []
      a.push(`Camera height ${mediaStream.getVideoTracks()[0].getSettings().height} : ` + `Camera width ${mediaStream.getVideoTracks()[0].getSettings().width}`)
      a.push(`Max height ${mediaStream.getVideoTracks()[0].getCapabilities().height.max} : ` + `Max width ${mediaStream.getVideoTracks()[0].getCapabilities().width.max}`)
      a.push(`device height ${height} : ` + `device width ${width}`)
      setArr(a)
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

  useEffect(() => {
    if (isMobile && height > width) {
      setPortrait(true)
    } else {
      setPortrait(false)
    }
  }, [height, width])

  useEffect(() => {
    stopCam()
    startCam()
  }, [portrait])

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
            {/* <p style={{backgroundColor:"white"}}>{arr.map((i) => {
              return <div>{i}</div>
            })}</p> */}
            <button type="button" className="capture-button" onClick={(vidLoaded) && (img === null) ? capture : null }></button>
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
