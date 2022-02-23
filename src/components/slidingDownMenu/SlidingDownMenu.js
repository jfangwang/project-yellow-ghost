import React, {useEffect, useState} from 'react'
import SwipeableViews from 'react-swipeable-views';
import { FillerNavbar} from '../navbar/NavbarTypes';
import { bindKeyboard } from 'react-swipeable-views-utils';
import '../settings/Settings.css';
import '../../screens/messages/Message.css';

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);

export default function SlidingDownMenu({title, closeMenu, children}) {
  const [Yindex, setYindex] = useState(0);
  const [top, setTop] = useState(true);
  const [height, setH] = useState(window.innerHeight);
  const [width, setW] = useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener('resize', updateDimensions);
  }, [])
  function updateDimensions() {
    setW(window.innerWidth);
    setH(window.innerHeight);
  };
  function handleChangeIndex(e) {
    setYindex(e)
  }
  function checkIndex() {
    if (Yindex === 0) {
      // setSettings(false);
      closeMenu();
    }
  }
  function close() {
    handleChangeIndex(0);
  }
  function handleScroll(e) {
    const target = e.target;
    if (target.scrollTop >= 0) {
      setTop(false);
    } else {
      setTop(true);
    }
  }
  useEffect(() => {
    handleChangeIndex(1);
    window.addEventListener('scroll', handleScroll, true);
  }, []);
  return (
    <>
      <div style={{position:'absolute', top: 0, left: 0, minHeight: height, zIndex: 2}}>
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
            <FillerNavbar show={true} title={title} custom={close} type="SlidingMenu"/>
            <div onScroll={handleScroll} className="settings-screen">
              {children}
            </div>
          </div>
        </BindKeyboardSwipeableViews>
      </div>

    </>
  )
}
