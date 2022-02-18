import React, { Component } from 'react'
import {auth, db, provider} from '../utils/Firebase'
import firebase from 'firebase/app'
import SwipeableViews from 'react-swipeable-views'
import { bindKeyboard } from 'react-swipeable-views-utils'
import {isMobile } from 'react-device-detect'
import MetaTags from 'react-meta-tags'
import './App.css'

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);
const styles = {
  slide1: {
    backgroundColor: '#FEA900',
  },
  slide2: {
    backgroundColor: '#B3DC4A',
  },
  slide3: {
    backgroundColor: '#6AC0FF',
  },
};
const list = [];

for (let i = 0; i < 100; i += 1) {
  list.push(<div key={i}>{`item n°${i + 1}`}</div>);
}
export default class App extends Component {
  render() {
    return (
      <>
        <MetaTags>
          <title>Yellow Ghost</title>
        </MetaTags>
				<BindKeyboardSwipeableViews className="slide_container" containerStyle={{height: '100vh', WebkitOverflowScrolling: 'touch'}} enableMouseEvents>
					<div className="slide">{list}</div>
					<div className="slide">slide n°2</div>
					<div className="slide">slide n°3</div>
				</BindKeyboardSwipeableViews>
      </>
    );
  }
}
