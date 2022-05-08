/* eslint-disable */
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {forwardRef, useImperativeHandle} from 'react';
import SwipeableViews from 'react-swipeable-views';
import styles from './SlidingMenu.module.css';
import {IconContext, CaretLeft, CaretDown} from 'phosphor-react';
import {connect} from 'react-redux';

const list =[];
for (let i=0; i<50; i += 1) {
  list.push(<h1>User {i}</h1>)
}

const SlidingMenu = forwardRef((props, ref) => {
  const {height, width, axis, children, toggleSlide, title, backgroundColor} = props;
  const [show, setShow] = useState(false);
  const [index, setIndex] = useState(0);
  const [disabled, setDisabled] = useState(false);
  useImperativeHandle(ref, () => ({
    toggle(e = !show) {
      setShow(e);
      toggleSlide();
    },
  }));

  useEffect(() => {
    if (show) {
      changeToIndex(1);
    }
  }, [show]);

  function changeToIndex(e) {
    setIndex(e);
  }

  function checkIndex(e) {
    if (index === 0) {
      setShow(false);
      toggleSlide();
    }
  }
  const close = () => {
    console.log('close');
    changeToIndex(0);
  };
  const handleScroll = (e) => {
    console.log('shadow');
    if (e.currentTarget.scrollTop > 0 && axis === 'y') {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  return (
    <>
      {show &&
        <SwipeableViews
          disabled={disabled}
          index={index}
          onChangeIndex={changeToIndex}
          onTransitionEnd={checkIndex}
          enableMouseEvents
          axis={axis}
          containerStyle={{height: height, width: width}}
          style={{zIndex: 5,}}
        >
          <div style={{height: height, width: width}}></div>
          <div
            className={styles.background}
            style={{height: height, width: width, backgroundColor: backgroundColor}}
          >
            <header className={styles.slidingMenuNavbar}>
              <IconContext.Provider
                value={{
                  color: 'black',
                  size: '1.5rem',
                  weight: 'bold',
                }}
              >
                <div>
                  <button onClick={close}>{axis === 'y' ? <CaretDown/> : <CaretLeft/>}</button>
                </div>
                <div>
                  <h1>{title}</h1>
                </div>
                <div>
                  <button style={{opacity: 0}}><CaretLeft/></button>
                </div>
              </IconContext.Provider>
            </header>
            <div
              onScroll={handleScroll}
              style={{
                height: height,
                width: width,
                overflowY: 'auto',
              }}
            >
              {children}
            </div>
          </div>
        </SwipeableViews>
      }
    </>
  );
});

SlidingMenu.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  backgroundColor: PropTypes.string,
  axis: PropTypes.string,
  title: PropTypes.string,
  toggleSlide: PropTypes.func,
  children: PropTypes.any,
};
SlidingMenu.defaultProps = {
  height: window.innerHeight,
  width: window.innerWidth,
  backgroundColor: 'white',
  axis: 'y',
  title: '',
  toggleSlide: () => { },
};

/**
 *
 *
 * @param {*} state
 * @return {*}
 */
 function mapStateToProps(state) {
  return {
    height: state.global.height,
    width: state.global.width,
  };
}

const mapDispatchToProps = {
  // setCameraPermissions,
  // toggleFacingMode,
  // toggleSlide,
  // toggleNavFoot,
  // setScreen,
  // captureImage,
  // updateSendList,
};

export default connect(mapStateToProps, mapDispatchToProps, null, {forwardRef: true})(SlidingMenu);
