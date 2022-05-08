/* eslint-disable */
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  cloneElement,
} from 'react';
import PropTypes from 'prop-types';
import {BrowserRouter as Route, useLocation} from 'react-router-dom';
import SwipeableRoutes from 'react-swipeable-routes';
import styles from './SlidingMenu.module.css';
import {IconContext, CaretLeft, CaretDown} from 'phosphor-react';
import {connect} from 'react-redux';

export const SampleContext = React.createContext();

const list = [];
for (let i = 0; i < 50; i += 1) {
  list.push(<h1>asdf {i}</h1>)
}


const SlidingMenuRouting = forwardRef((props, ref) => {
  const {height, width, axis, children, toggleSlide, title, path, backgroundColor} = props;
  const [show, setShow] = useState(false);
  const [index, setIndex] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [prevPath, setPrevPath] = useState('/');
  const location = useLocation();
  useImperativeHandle(ref, () => ({
    toggle() {
      setPrevPath(location.pathname);
      setShow(true);
      toggleSlide(true);
    },
  }));
  useEffect(() => {
    if (show) {
      setTimeout(() => changeToIndex(1), 100);
    }
  }, [show]);
  useEffect(() => {
    if (location.pathname === path) {
      setShow(true);
      toggleSlide(true);
    }
  }, [location.pathname, path, toggleSlide]);
  function changeToIndex(e) {
    setIndex(e);
  }
  function checkIndex(e) {
    if (index === 0) {
      setShow(false);
      toggleSlide(false);
    }
    if (index === 1 && title === 'Search') {
      var input = document.getElementById('searchbar');
      input.focus();
      // input.select();
    }
  }
  const close = () => {
    changeToIndex(0);
  };
  const handleScroll = (e) => {
    if (e.currentTarget.scrollTop > 0 && axis === 'y') {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
    if (e.currentTarget.scrollTop > 0) {
      document.querySelector('#searchHeader').classList.add(styles.shadow);
    } else {
      document.querySelector('#searchHeader').classList.remove(styles.shadow);
    }
  };
  return (
    <>
      {show &&
        <SwipeableRoutes
          disabled={disabled}
          index={index}
          onChangeIndex={changeToIndex}
          onTransitionEnd={checkIndex}
          enableMouseEvents
          axis={axis}
          containerStyle={{height: height, width: width}}
          style={{
            position: 'absolute',
            top: 0,
          }}
          replace
        >
          <Route path={prevPath}>
            <div style={{height: height, width: width}}></div>
          </Route>
          <Route path={path}>
            {title !== '' ?
              <div
                className={styles.background}
                style={{height: height, width: width, backgroundColor: backgroundColor}}
              >
                <header id='searchHeader'>
                  <IconContext.Provider
                    value={{
                      color: 'black',
                      size: '2rem',
                      weight: 'bold',
                    }}
                  >
                    <button onClick={close}>
                      {axis === 'y' ? <CaretDown/> : <CaretLeft/>}
                    </button>
                    <input
                      id='searchbar'
                      type='search'
                      autoComplete='on'
                      placeholder={title + '...'}
                    ></input>
                  </IconContext.Provider>
                </header>
                <div
                  style={{
                    height: height,
                    width: width,
                    overflowY: 'auto',
                  }}
                  className={styles.body}
                >
                  {/* <h2>{title}</h2> */}
                  {cloneElement(children, {handleScroll: handleScroll})}
                </div>
              </div> : <></>}
          </Route>
        </SwipeableRoutes>
      }
    </>
  );
});

SlidingMenuRouting.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  backgroundColor: PropTypes.string,
  axis: PropTypes.string,
  title: PropTypes.string,
  path: PropTypes.string,
  toggleSlide: PropTypes.func,
};
SlidingMenuRouting.defaultProps = {
  height: 0,
  width: 0,
  backgroundColor: 'rgb(233, 233, 233)',
  axis: 'y',
  title: '',
  path: '/error',
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

export default connect(mapStateToProps, mapDispatchToProps, null, {forwardRef: true})(SlidingMenuRouting);
