import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'

export default function NewCam() {
  const [devices, setDevices] = useState([{label: "Nothing"}])
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(mediaStream => {
        // Do something with the stream.
        navigator.mediaDevices.enumerateDevices()
          .then(function (devices) {
            setDevices({
              devices: devices.map(({deviceId, groupId, kind, label}) =>
              ({deviceId, groupId, kind, label})
            )
            })
            devices.map(({deviceId, groupId, kind, label}) =>
              console.log({deviceId, groupId, kind, label})
            )
          })
        // const tracks = mediaStream.getVideoTracks()
        // console.log(tracks, tracks[0].getCapabilities());
      })
      .catch(function (err) {
        alert("Cam is denied")
      })
  }, [])
  return (
    <>
    <div>
      Device List: asdfasdf
    </div>
      <video id="cam">

      </video>
    </>

  )
}
