import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styles from './Send.module.css';
import {toggleSlide, toggleNavFoot} from '../../Actions/globalActions';
import {setScreen} from '../../Actions/cameraActions';
import {
  IconContext,
  PaperPlaneRight,
} from 'phosphor-react';

const list = [];
for (let i = 0; i < 200; i++) {
  list.push(<h1>{'User ' + i.toString()}</h1>);
}

/**
 * @param {*} props
 * @return {*}
 */
function Send(props) {
  const {
    setScreen,
    toggleNavFoot,
    toggleSlide,
  } = props;

  /**
   * Send image
   */
  function send() {
    setScreen('camera');
    toggleSlide();
    toggleNavFoot();
  }

  return (
    <IconContext.Provider
      value={{
        color: 'black',
        size: '1.5rem',
        weight: 'bold',
      }}
    >
      {list}
      <footer>
        <div className={styles.names}>
          <h1>Footer</h1>
        </div>
        <div>
          <button
            className={styles.sendButton}
            onClick={send}
          >
            <h2 style={{marginRight: '0.2rem'}}>Send</h2>
            <PaperPlaneRight />
          </button>
        </div>
      </footer>
    </IconContext.Provider>
  );
}

Send.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  toggleSlide: PropTypes.func,
  toggleNavFoot: PropTypes.func,
  setScreen: PropTypes.func,
};

Send.defaultProps = {
  height: window.innerHeight,
  width: window.innerWidth,
  toggleSlide: () => { },
  toggleNavFoot: () => { },
  setScreen: () => { },
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
  };
}

const mapDispatchToProps = {
  toggleSlide,
  toggleNavFoot,
  setScreen,
};

export default connect(mapStateToProps, mapDispatchToProps)(Send);
