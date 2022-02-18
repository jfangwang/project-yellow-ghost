import React, { Component } from 'react'
import {auth, db, provider} from '../../config/Firebase'
import firebase from 'firebase/app'
import SwipeableViews from 'react-swipeable-views'
import { bindKeyboard } from 'react-swipeable-views-utils'
import {isMobile } from 'react-device-detect'
import MetaTags from 'react-meta-tags'


export default class App extends Component {
  render() {
    return (
      <>
        <MetaTags>
          <title>Yellow Ghost</title>
        </MetaTags>
      </>
      
    )
  }
}
