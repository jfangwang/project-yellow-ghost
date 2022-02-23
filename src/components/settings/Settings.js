import React, {useEffect, useState} from 'react'
import SwipeableViews from 'react-swipeable-views';
import { StaticNavbar} from '../navbar/NavbarTypes';
import { bindKeyboard } from 'react-swipeable-views-utils';
import SlidingDownMenu from '../slidingDownMenu/SlidingDownMenu';
import {auth, db, provider} from '../../utils/Firebase';
import firebase from 'firebase/app';
import './Settings.css';
import '../../screens/messages/Message.css';

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);

export default function Settings({toggleSettings, loggedIn, userInfo, userDoc}) {
  function GoogleSignIn() {
    auth.signInWithPopup(provider)
  }
  function GoogleSignOut() {
    firebase.auth().signOut();
    console.log("sign out");
  }
  return (
    <>
      <SlidingDownMenu closeMenu={toggleSettings} title="Settings">
        <div className="container row">
          <img style={{height:'5rem', width:'5rem'}} src={userInfo.photoURL ? userInfo.photoURL : "https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"}/>
          <div className="col">
            <h1>{userInfo.displayName ? userInfo.displayName : "Guest"}</h1>
            <h3>{userInfo.email ? userInfo.email : "Guest@Guest.com"}</h3>
          </div>
        </div>
        <div className="left container row">
          <p>Received: {userDoc['received'] ? userDoc['received'] : 0}</p>
          <p>Sent: {userDoc['sent'] ? userDoc['sent'] : 0}</p>
          <p>Streak Emoji: {userDoc['streak_emoji'] ? userDoc['streak_emoji'] : "\u{1F525}"} </p>
          <p>Created: {userDoc['created'] ? userDoc['created'] : "N/A"} </p>
        </div>
        <div className="center left container row">
          {loggedIn ? <button style={{backgroundColor: 'lightcoral', borderRadius:'0.5rem', padding: '1rem'}} onClick={GoogleSignOut}><h1>Logout</h1></button>
          : <>
            <button style={{backgroundColor: 'yellow', borderRadius:'0.5rem', padding: '1rem'}} onClick={GoogleSignIn}><h1>Login</h1></button>
            <button style={{backgroundColor: 'yellow', borderRadius:'0.5rem', padding: '1rem'}} onClick={GoogleSignIn}><h1>Sign Up</h1></button>
          </>
          }
        </div>
      </SlidingDownMenu>
    </>
  )
}
