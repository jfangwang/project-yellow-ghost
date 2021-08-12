import React from 'react';
import Helmet from 'react-helmet';
import SwipeableViews from 'react-swipeable-views';
import { bindKeyboard } from 'react-swipeable-views-utils';
// import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Messages from './Messages.js';
import Camera from './Camera.js';


const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      height: window.innerHeight,
      width: window.innerWidth
    }
    window.addEventListener("resize", this.update);
  }

  update = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  render() {
    return (
      <BindKeyboardSwipeableViews enableMouseEvents style={Object.assign({width: this.state.width, height: this.state.height, position: 'absolute', top: '0%', left: '0%'})}>
        <div style={Object.assign({backgroundColor: 'white', minHeight: '100vh', width: '100%'})}>
          <Helmet>
            <meta name="viewport" content="height=device-height, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
          </Helmet>
          <Messages/>
        </div>
        <div style={Object.assign({backgroundColor: 'Plum'})} >
          <Helmet>
            <meta name="viewport" content="height=device-height, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes"></meta>
          </Helmet>
          <Camera/>
        </div>
      </BindKeyboardSwipeableViews>
    );
  }
}

export default App;
