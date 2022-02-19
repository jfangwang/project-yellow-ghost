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
      index: 0,
    }
  }
  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };
  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }
	handleChangeIndex = index => {
    this.setState({
      index,
    });
  };
  render() {
		const { index } = this.state;
    return (
      <>
        <MetaTags>
          <title>Yellow Ghost</title>
        </MetaTags>
				<Navbar position="absolute" index={index}/>
				<BindKeyboardSwipeableViews className="slide_container" index={index} onChangeIndex={this.handleChangeIndex} containerStyle={{height: this.state.height, WebkitOverflowScrolling: 'touch'}} enableMouseEvents>
					<div className="slide"><Navbar index={index}/><Messages /></div>
					<div className="slide">slide n°2</div>
					<div className="slide">slide n°3</div>
				</BindKeyboardSwipeableViews>
				<Footer index={index}/>
      </>
    );
  }
}
