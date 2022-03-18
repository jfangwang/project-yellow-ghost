import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { isMobile } from 'react-device-detect'
import Footer from '../../components/footer/Footer'
import './NewCam.css'

var stream = undefined;

export default function NewCam({height, width, flipCamCounter, index}) {
  console.log(height, width, 720/height * width )
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
      height: { min: 720 / height * width , ideal: 3840 / height * width},
      width: { min: 720, ideal: 3840 }
    }
  }
  const [devices, setDevices] = useState([{ label: "Nothing" }])
  const [constraints, setConstraints] = useState(desktopConstraints)

  function activateCam() {
    navigator.mediaDevices.getUserMedia(isMobile ? mobileConstraints : desktopConstraints)
      .then(mediaStream => {
        stream = mediaStream;
        // console.log(mediaStream.getVideoTracks()[0].getSettings())
        // setCamHeight(mediaStream.getVideoTracks()[0].getSettings().height)
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

    if (stream !== undefined) {
      if(index == 1) {
        activateCam()
      } else {
        stream.getTracks().forEach(function(track) {
          track.stop();
        });
      }
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
