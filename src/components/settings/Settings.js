import React, {useEffect, useState} from 'react'
import SwipeableViews from 'react-swipeable-views';
import { FillerNavbar} from '../navbar/NavbarTypes';
import { bindKeyboard } from 'react-swipeable-views-utils';
import SlidingDownMenu from '../slidingDownMenu/SlidingDownMenu';
import './Settings.css';
import '../../screens/messages/Message.css';

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);

export default function Settings({toggleSettings}) {
  return (
    <>
      <SlidingDownMenu closeMenu={toggleSettings} title="Settings">
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
      </SlidingDownMenu>
    </>
  )
}
