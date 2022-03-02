import React, { Component, useEffect } from 'react'
import {auth, db, provider} from '../utils/Firebase'
import firebase from 'firebase/app'
import SwipeableViews from 'react-swipeable-views'
import { bindKeyboard } from 'react-swipeable-views-utils'
import {isMobile } from 'react-device-detect'
import MetaTags from 'react-meta-tags'
import './App.css'
import Navbar from '../components/navbar/Navbar'
import Footer from '../components/footer/Footer'
import Messages from '../screens/messages/Messages'
import Camera from '../screens/camera/Camera'


const list = [];

for (let i = 0; i < 30; i += 1) {
  list.push(<div key={i}>{`item n°${i + 1}`}</div>);
}

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: window.innerHeight,
      width: window.innerWidth,
      index: 1,
      flipCamCounter: 0,
    }
  }
  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
    console.log(this.state.width, this.state.height)
  };
  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }
	handleChangeIndex = index => {
    this.setState({
      index,
    });
  }
  changeToIndex(e) {
    this.setState({
      index: e,
    })
  }
  incFlipCam = () => {
    this.setState({flipCamCounter: this.state.flipCamCounter + 1})
  }
  render() {
		const { index, height, width, flipCamCounter, } = this.state;
    return (
      <>
        <MetaTags>
          <title>Yellow Ghost</title>
        </MetaTags>
				<Navbar position="absolute" index={index} incFlipCam={this.incFlipCam}/>
				<BindKeyboardSwipeableViews className="slide_container" index={index} onChangeIndex={this.handleChangeIndex} containerStyle={{height: this.state.height, WebkitOverflowScrolling: 'touch'}} enableMouseEvents>
					<div className="slide slide1"><Navbar index={index}/><Messages /></div>
					<div className="slide slide2"><Camera index={index} height={height} width={width} flipCamCounter={flipCamCounter}/></div>
					<div className="slide slide3"><Navbar index={index}/></div>
				</BindKeyboardSwipeableViews>
				<Footer index={index} changeToIndex={this.changeToIndex.bind(this)}/>
      </>
    );
  }
}
