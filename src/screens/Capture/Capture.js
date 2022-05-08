import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import styles from './Capture.module.css';
import {connect} from 'react-redux';
import {toggleSlide, toggleNavFoot} from '../../Actions/globalActions';
import {setScreen} from '../../Actions/cameraActions';
import SendSlidingMenu from '../Send/SendSlidingMenu';
import SlidingMenu from '../../Components/SlidingMenu/SlidingMenu';
import {create} from 'simple-drawing-board';
import {isMobile} from 'react-device-detect';
import {
  IconContext,
  X,
  PaperPlaneRight,
  DownloadSimple,
  Export,
  TextT,
  PencilSimple,
  Crop,
  Paperclip,
  Alarm,
  CaretLeft,
  ArrowCounterClockwise,
  ArrowClockwise,
} from 'phosphor-react';
import {MetaTags} from 'react-meta-tags';
import Timer from '../Timer/Timer';
import {HueSlider} from 'react-slider-color-picker';
import SwipeableViews from 'react-swipeable-views/lib/SwipeableViews';
import filter1 from '../../Assets/images/filters/patagonia_logo.png';
import filter2 from '../../Assets/images/filters/Wendys-Logo.png';
import filter3 from '../../Assets/images/filters/Rick-And-Morty-Logo.png';
import filter4 from '../../Assets/images/filters/color-paint-border.png';

let sdb = null;

/**
 * @param {*} props
 * @return {*}
 */
function Capture(props) {
  const {
    setScreen,
    toggleSlide,
    toggleNavFoot,
    height,
    width,
    aspectRatio,
    camH,
    camW,
    user,
    sendList,
    orientation,
    screen,
  } = props;
  const sendMenu = useRef();
  const toolTime = useRef();
  const [activeTool, setActiveTool] = useState(null);
  const [hideUI, setHideUI] = useState(false);
  const [color, setColor] = useState({h: 56, s: 100, l: 50, a: 1});
  const [localIndex, setLocalIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(true);

  /**
   * Close
   */
  function close() {
    setScreen('camera');
    toggleSlide(false);
    toggleNavFoot(false);
  }

  /**
   * Update Drawing Canvas
   */
  function updateDrawingCanvas() {
    const vec = document.getElementById('drawingCanvas');
    const dc = document.getElementById('defaultCanvas');
    const cw = (width/height) > aspectRatio ? height * aspectRatio : width;
    const ch = (width/height) >
    aspectRatio ? height : width * (aspectRatio ** -1);
    if (camH != null && camW != null) {
      vec.width = Math.min(cw, camW);
      vec.height = Math.min(ch, camH);
      dc.width = Math.min(cw, camW);
      dc.height = Math.min(ch, camH);
    } else {
      vec.width = cw;
      vec.height = ch;
      dc.width = cw;
      dc.height = ch;
    }
  }

  /**
   * Toggle Text
   */
  function toggleText() {
    if (activeTool == null) {
      setActiveTool('text');
    } else {
      setActiveTool(null);
    }
  }

  /**
   * Toggle Draw
   */
  function toggleDraw() {
    if (activeTool == null) {
      setActiveTool('draw');
      if (sdb == null) {
        sdb = create(document.getElementById('drawingCanvas'));
      }
      sdb.setLineSize(5);
      sdb.setLineColor(hslToHex(color['h'], color['s'], color['l']));
      sdb.observer.on('drawBegin', (coords) => {
        setHideUI(true);
      });
      sdb.observer.on('drawEnd', (coords) => {
        setHideUI(false);
      });
    } else {
      setActiveTool(null);
      // sdb.destroy();
    }
  }

  /**
   * Undo draw
   */
  async function undo() {
    await sdb.undo();
  }

  /**
   * Redo draw
   */
  async function redo() {
    await sdb.redo();
  }

  /**
   * Toggle Crop
   */
  function toggleCrop() {
    if (activeTool == null) {
      setActiveTool('crop');
    } else {
      setActiveTool(null);
    }
  }

  /**
   * Toggle Link
   */
  function toggleLink() {
    if (activeTool == null) {
      setActiveTool('link');
    } else {
      setActiveTool(null);
    }
  }

  /**
   * Toggle Time
   */
  function toggleTime() {
    if (activeTool == null) {
      setActiveTool(null);
      toolTime.current.toggle();
    } else {
      setActiveTool(null);
    }
  }

  /**
   * Close whatever tool is open
   */
  function closeTool() {
    activeTool === 'text' && toggleText();
    activeTool === 'draw' && toggleDraw();
    activeTool === 'crop' && toggleCrop();
    activeTool === 'link' && toggleLink();
    setActiveTool(null);
  }

  /**
   * Handle Change Color
   * @param {*} newColor
   */
  function handleChangeColor(newColor) {
    setColor(newColor);
    sdb.setLineColor(hslToHex(newColor['h'], newColor['s'], newColor['l']));
  }

  /**
   * @param {*} h
   * @param {*} s
   * @param {*} l
   * @return {*}
   */
  function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  useEffect(() => {
    updateDrawingCanvas();
    if (sdb !== null) {
      sdb.setLineSize(5);
      sdb.setLineColor(hslToHex(color['h'], color['s'], color['l']));
      if (!isMobile) {
        undo();
        redo();
      }
    }
  }, [height, width]);

  useEffect(() => {
    if (sdb !== null) {
      undo();
      redo();
    }
  }, [orientation]);

  useEffect(() => {
    if (screen === 'capture' || screen === 'camera') {
      sdb = null;
    }
  }, [screen]);
  return (
    <>
      <MetaTags>
        <meta
          name = "viewport"
          content = "width=device-width, \
          minimum-scale=1, maximum-scale=1, user-scalable=no"
        />
      </MetaTags>
      <div
        className={styles.background}
      >
        <SwipeableViews
          enableMouseEvents
          index={localIndex}
          containerStyle={{
            width: (width/height) <= (aspectRatio) ?
              width : height * aspectRatio,
            height: (width/height) <= (aspectRatio) ?
              width * (aspectRatio ** -1) : height,
          }}
          style={{
            position: 'absolute',
            width: (width/height) <= (aspectRatio) ? '100%' : 'auto',
            height: (width/height) <= (aspectRatio) ? 'auto' : '100%',
            zIndex: 1,
          }}
          slideStyle={{
            height: '100%',
            width: '100%',
            display: showFilters ? 'block' : 'none',
          }}
        >
          <div/>
          <div className={styles.screen1}>
            <img id='imgFilter1' src={filter1}/>
          </div>
          <div className={styles.screen2}>
            <img id='imgFilter2' src={filter2}/>
          </div>
          <div className={styles.screen3}>
            <img id='imgFilter3' src={filter3}/>
          </div>
          <div className={styles.screen4}>
            <img style={{height: height * 0.99}} id='imgFilter4' src={filter4}/>
          </div>
        </SwipeableViews>
        <SwipeableViews
          enableMouseEvents
          index={localIndex}
          onChangeIndex={(e) => setLocalIndex(e)}
          onSwitching={() => setShowFilters(false)}
          onTransitionEnd={() => setShowFilters(true)}
          containerStyle={{
            width: (width/height) <= (aspectRatio) ?
              width : height * aspectRatio,
            height: (width/height) <= (aspectRatio) ?
              width * (aspectRatio ** -1) : height,
          }}
          style={{
            position: 'absolute',
            width: (width/height) <= (aspectRatio) ? '100%' : 'auto',
            height: (width/height) <= (aspectRatio) ? 'auto' : '100%',
            zIndex: 4,
          }}
          slideStyle={{
            height: '100%',
            width: '100%',
            display: !showFilters ? 'block' : 'none',
          }}
        >
          <div/>
          <div className={styles.screen1}>
            <img src={filter1}/>
          </div>
          <div className={styles.screen2}>
            <img id='imgFilter2' src={filter2}/>
          </div>
          <div className={styles.screen3}>
            <img id='imgFilter3' src={filter3}/>
          </div>
          <div className={styles.screen4}>
            <img style={{height: height * 0.99}} id='imgFilter4' src={filter4}/>
          </div>
        </SwipeableViews>
        {/* Canvas for drawing with marker tool */}
        <canvas
          id='drawingCanvas'
          className={styles.drawingCanvas}
          style={{
            width: (width/height) <= (aspectRatio) ? '100%' : 'auto',
            height: (width/height) <= (aspectRatio) ? 'auto' : '100%',
            zIndex: activeTool === 'draw' ? 4 : 1,
            // border: '4px blue solid',
            position: 'absolute',
          }}
        />
        {/* Default canvas */}
        <canvas
          id='defaultCanvas'
          className={styles.defaultCanvas}
          style={{
            width: (width/height) <= (aspectRatio) ? '100%' : 'auto',
            height: (width/height) <= (aspectRatio) ? 'auto' : '100%',
            zIndex: activeTool === null ? 0 : 0,
            // border: '2px red solid',
            position: 'absolute',
          }}
        />
        { !hideUI &&
          <>
            <header
              style={{
                zIndex: 4,
              }}
            >
              <IconContext.Provider
                value={{
                  color: 'white',
                  size: '2rem',
                  weight: 'bold',
                }}
              >
                <div
                  className={styles.toolbar}
                  style={{
                    flexDirection: orientation === 'landscape' ?
                      'column':'column',
                  }}
                >
                  <button
                    onClick={activeTool == null ? close : closeTool}
                  >
                    { activeTool == null ?
                      <X /> : <CaretLeft />
                    }
                  </button>
                </div>
                <div
                  className={styles.toolbar}
                  style={{
                    flexDirection: orientation === 'landscape' ?
                      'row':'column',
                    zIndex: 4,
                  }}
                >
                  { activeTool == null || activeTool === 'text' ?
                    <button
                      onClick={toggleText}
                    ><TextT /></button>: null}
                  { activeTool == null || activeTool === 'draw' ?
                    <div className={styles.drawToolContainer}>
                      { activeTool === 'draw' &&
                        <>
                          <button onClick={undo}>
                            <ArrowCounterClockwise />
                          </button>
                          <button onClick={redo}>
                            <ArrowClockwise />
                          </button>
                          <div className={styles.slider}>
                            <HueSlider
                              handleChangeColor={handleChangeColor}
                              color={color}
                              style={{
                                backgroundColor: 'transparent',
                              }}
                            />
                          </div>
                        </>
                      }
                      <button onClick={toggleDraw}>
                        <PencilSimple />
                      </button>
                    </div> :
                    null}
                  { activeTool == null || activeTool === 'crop' ?
                    <button
                      onClick={toggleCrop}
                    ><Crop /></button> : null}
                  { activeTool == null || activeTool === 'link' ?
                    <button
                      onClick={toggleLink}
                    ><Paperclip /></button> : null}
                  { activeTool == null || activeTool === 'time' ?
                  <button
                    onClick={toggleTime}
                  ><Alarm /></button> : null}
                </div>
              </IconContext.Provider>
            </header>

            <footer
              style={{
                zIndex: 4,
              }}
              className={styles.captureFooter}
            >
              <IconContext.Provider
                value={{
                  color: 'black',
                  size: '1.5rem',
                  weight: 'bold',
                }}
              >
                <div>
                  <button disabled><DownloadSimple /></button>
                  <button disabled><Export /></button>
                </div>
                <div>
                  <button
                    className={styles.sendButton}
                    onClick={() => sendMenu.current.toggle()}
                  >
                    <h2 style={{marginRight: '0.2rem'}}>Send</h2>
                    <PaperPlaneRight />
                  </button>
                </div>
              </IconContext.Provider>
            </footer>
          </>
        }
      </div>
      <SendSlidingMenu
        ref={sendMenu}
        height={height}
        width={width}
        title="Send"
        setScreen={setScreen}
        toggleSlide={toggleSlide}
        toggleNavFoot={toggleNavFoot}
        user={user}
        sendList={sendList}
        localIndex={localIndex}
      />
      <SlidingMenu
        ref={toolTime}
        axis='x'
        backgroundColor='rgba(0, 0, 0, 0.7)'
      >
        <Timer />
      </SlidingMenu>
    </>
  );
}

Capture.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  toggleSlide: PropTypes.func,
  toggleNavFoot: PropTypes.func,
  setScreen: PropTypes.func,
  screen: PropTypes.string,
  aspectRatio: PropTypes.number,
  camH: PropTypes.number,
  camW: PropTypes.number,
  user: PropTypes.object,
  sendList: PropTypes.array,
  orientation: PropTypes.string,
  screen: PropTypes.string,
};

Capture.defaultProps = {
  height: window.innerHeight,
  width: window.innerWidth,
  toggleSlide: () => { },
  toggleNavFoot: () => { },
  setScreen: () => { },
  screen: 'camera',
  aspectRatio: 9.5/16,
  camH: null,
  camW: null,
  user: {},
  sendList: [],
  screen: 'camera',
  orientation: window.innerHeight > window.innerWidth ?
  'portrait':'landscape',
};

/**
  * @param {*} state
  * @return {*}
  */
function mapStateToProps(state) {
  return {
    height: state.global.height,
    width: state.global.width,
    screen: state.camera.screen,
    user: state.user.user,
    sendList: state.camera.sendList,
    orientation: state.global.orientation,
    screen: state.camera.screen,
  };
}

const mapDispatchToProps = {
  toggleSlide,
  toggleNavFoot,
  setScreen,
};

export default connect(mapStateToProps, mapDispatchToProps)(Capture);
