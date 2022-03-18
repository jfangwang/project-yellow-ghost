import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { isMobile } from 'react-device-detect'
import { useDoubleTap } from 'use-double-tap'
import Footer from '../../components/footer/Footer'
import './NewCam.css'

var stream = undefined;

export default function NewCam({height, width, flipCamCounter, index, incFlipCam}) {
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
      height: { min: 1280 / height * width , ideal: 1920 / height * width},
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
        var video = document.querySelector("#cam");
        video.srcObject = mediaStream;
      })
      .catch(function (err) {
        alert("Cam is denied")
      })
  }

  useEffect(() => {
    activateCam()
  }, [])

  useEffect(() => {
    if (stream !== undefined) {
      activateCam()
    }
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
      <div
        className="camOverlay"
        style={{position: "absolute", height: height, width: width}}
        {...double_tap}
      >
        <div>
        </div>
        <div>
          <div style={{display: "flex", justifyContent: "center"}}>
            <button className="capture-button"></button>
          </div>
          <Footer type="relative"/>
        </div>
      </div>
    </>

  )
}
