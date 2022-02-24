import React, {useEffect} from 'react';
import { isMobile } from 'react-device-detect';
import Navbar from '../../components/navbar/Navbar';
import './Camera.css';
import '../../components/navbar/Navbar.css'
import '../../components/footer/Footer.css'

export default function Send({width, height, img, send, backToCapture, userDoc}) {
  let view;
  if (Object.keys(userDoc).length > 0) {
    view = (
      <div className="send-screen" style={{height: height, width: width}}>
        <Navbar />
        <div className="floating-navbar main-navbar">
          <ul><li><button onClick={backToCapture}>Go Back</button></li></ul>
          <ul></ul>
        </div>
        <div className="captured-footer main-footer">
          <ul><li></li></ul>
          <ul><li><button onClick={send}>SEND</button></li></ul>
        </div>
        <div>
          {Object.keys(userDoc['friends']).sort().map((key) => (
            <h1>{userDoc['friends'][key]['name']}</h1>
          ))}
        </div>
      </div>
    )
  }
  return (
    <>
      {view}
    </>
  )
}
