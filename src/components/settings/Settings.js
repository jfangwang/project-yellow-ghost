import React from 'react'
import Navbar from '../navbar/Navbar';
import SwipeableViews from 'react-swipeable-views';
import { FillerNavbar, FloatingNavbar } from '../navbar/NavbarTypes';
import { bindKeyboard } from 'react-swipeable-views-utils';

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);

export default function Settings({height, width}) {
  return (
    <>
      <div style={{position:'absolute', top: 0, left: 0, height: height, zIndex: 1}}>
        <BindKeyboardSwipeableViews
          containerStyle={{height:height, WebkitOverflowScrolling: 'touch'}}
          axis="y"
          enableMouseEvents
        >
          <div style={{height:height, width:width}}>
            <FillerNavbar/>
            <h1>Camera</h1>
          </div>
          <div style={{backgroundColor: 'lightblue', height:height, width:width}}>
            <FillerNavbar/>
            <h1>Settings</h1>
          </div>
        </BindKeyboardSwipeableViews>
      </div>

    </>
  )
}
