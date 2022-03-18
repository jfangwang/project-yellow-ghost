import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { isMobile } from 'react-device-detect'
import Footer from '../../components/footer/Footer'
import './NewCam.css'

var stream = undefined;

export default function NewCam({height, width, flipCamCounter, index}) {
  const desktopConstraints = {
    audio: false,
    video: {
      facingMode: "environment",
      height: height,
      width: width * 0.5625,
    }
  }
  const mobileConstraints = {
    audio: false,
    video: {
      facingMode: flipCamCounter % 2 === 0 ? "user" : "environment",
      height: width,
      width: height,
    }
  }
  const [devices, setDevices] = useState([{ label: "Nothing" }])
  const [constraints, setConstraints] = useState(desktopConstraints)

  // console.log(navigator.mediaDevices.getSupportedConstraints())

  function activateCam() {
    navigator.mediaDevices.getUserMedia(isMobile ? mobileConstraints : desktopConstraints)
      .then(mediaStream => {
        stream = mediaStream;
        // navigator.mediaDevices.enumerateDevices()
        //   .then(function (devices) {
        //     setDevices({
        //       devices: devices.map(({ deviceId, groupId, kind, label }) =>
        //         ({ deviceId, groupId, kind, label })
        //       )
        //     })
        //   })
        var video = document.querySelector("#cam");
        video.srcObject = mediaStream;
      })
      .catch(function (err) {
        alert("Cam is denied")
      })
  }

  useEffect(() => {
    activateCam()
  }, [flipCamCounter])

  useEffect(() => {
    if(index == 1) {
      activateCam()
    } else {
      stream.getTracks().forEach(function(track) {
        track.stop();
      });
    }
  }, [index])

  const mirrorStyle = {transform: "scaleX(-1)"}
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
      <div className="camOverlay" style={{position: "absolute", height: height, width: width}}>
        <div>
          <h1>Footer</h1>
        </div>
        <div>
          <div style={{display: "flex", justifyContent: "center"}}>
            <h1>Capture</h1>
          </div>
          <Footer type="relative"/>
        </div>
      </div>
    </>

  )
}
