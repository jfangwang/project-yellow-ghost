import React, {useEffect, useState, useRef} from 'react'
import Navbar from '../navbar/Navbar';
import SwipeableViews from 'react-swipeable-views';
import { FillerNavbar, FloatingNavbar } from '../navbar/NavbarTypes';
import { virtualize, bindKeyboard } from 'react-swipeable-views-utils';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import './Settings.css';
import '../../screens/messages/Message.css';

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);
let item = <h1>Test</h1>
let list = []
for (let i = 0; i < 30; i++) {
  list.push(item);
}

export default function Settings({height, width, setSettings, toggleSettings}) {
  const [Yindex, setYindex] = useState(0);
  const [top, setTop] = useState(true);
  function handleChangeIndex(e) {
    setYindex(e)
  }
  function checkIndex() {
    if (Yindex === 0) {
      setSettings(false);
    }
  }
  function close() {
    handleChangeIndex(0);
    console.log("change")
  }
  useEffect(() => {
    handleChangeIndex(1);
  }, []);
  window.addEventListener('scroll', handleScroll, true);
  function handleScroll(e) {
    const target = e.target;
    if (target.scrollTop >= 0) {
      setTop(false);
    } else {
      setTop(true);
    }
  }

  return (
    <>
      <div style={{position:'absolute', top: 0, left: 0, height: height, zIndex: 2}}>
        <BindKeyboardSwipeableViews
          containerStyle={{height:height, WebkitOverflowScrolling: 'touch'}}
          axis="y"
          enableMouseEvents
          index={Yindex}
          onChangeIndex={handleChangeIndex}
          onTransitionEnd={checkIndex}
          disabled={!top}
        >
          <div style={{height:height, width:width}}>
          </div>
          <div style={{backgroundColor: 'lightgrey', height:height, width:width}}>
            <FillerNavbar show={true} title="Settings" custom={close} type="Settings"/>
            <div onScroll={handleScroll} className="settings-screen">
              <div className="container row">
                <img style={{height:'5rem', width:'5rem'}} src="https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"/>
                <div className="col">
                  <h1>Name</h1>
                  <h3>Username</h3>
                </div>
              </div>
              <div className="left container row">
                <p>Received: 10</p>
                <p>Send: 8</p>
              </div>
              <div className="center left container row">
                <button style={{backgroundColor: 'lightcoral', borderRadius:'0.5rem', padding: '1rem'}}><h1>Logout</h1></button>
              </div>
            </div>
          </div>
        </BindKeyboardSwipeableViews>
      </div>

    </>
  )
}
