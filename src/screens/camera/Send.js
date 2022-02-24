import React, {useEffect} from 'react';
import { isMobile } from 'react-device-detect';
import './Camera.css';
import '../../components/navbar/Navbar.css'
import '../../components/footer/Footer.css'

export default function Send({width, height, close, img, send, backToCapture}) {
  return (
    <div className="captured-screen" style={{height: height, width: width}}>
      <div className="floating-navbar main-navbar">
        <ul><li><button onClick={backToCapture}>Go Back</button></li></ul>
        <ul></ul>
      </div>
      <div className="captured-footer main-footer">
        <ul><li></li></ul>
        <ul><li><button onClick={send}>SEND</button></li></ul>
      </div>
    </div>
  )
}
