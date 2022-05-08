import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styles from './Account.module.css';
import {editFakeDB} from '../../Actions/userActions';
import {auth} from '../../Firebase/Firebase';

const {version} = require('../../../package.json');

/**
 *
 *
 * @param {*} props
 * @return {*}
 */
function Account(props) {
  const {
    user,
    camRes,
    // camVideo,
    // camMic,
    handleScroll,
    isUserLoggedIn,
    snapTime,
  } = props;


  /**
   *
   */
  function logout() {
    auth.signOut();
  }

  return (
    <div id='background' className={styles.background} onScroll={handleScroll}>
      <div className={styles.account}>
        <img src={user.profilePicUrl} alt='img' className={styles.profilePic} />
        <div className={styles.info}>
          <h2><b>{user.firstName} {user.lastName}</b></h2>
          <h4><i>{user.username}</i></h4>
        </div>
        <div className={styles.info}>
          <h4>Received: {user.received}</h4>
          <h4>Sent: {user.sent}</h4>
          <h4>Total: {user.sent + user.received}</h4>
        </div>
      </div>

      <div className={styles.acountSettings}>
        <h1>Account Settings</h1>
        <ul>
          <li>
            <h3>Full Name</h3>
            <p>{user.firstName} {user.lastName}</p>
            <button>Update</button>
          </li>
          <li>
            <h3>Username</h3>
            <p>{user.username === null ? 'NULL' : user.username}</p>
            <button>Update</button>
          </li>
          <li>
            <h3>Streak Emoji</h3>
            <p>{user.streakEmoji}</p>
            <button>Update</button>
          </li>
          <li>
            <h3>Phone Number</h3>
            <p>{user.phoneNumber === null ? 'NULL' : user.phoneNumber}</p>
            <button>Update</button>
          </li>
          <li>
            <h3>Face ID</h3>
            <p>{user.faceID === null ? 'NULL' : user.faceID}</p>
            <button>Update</button>
          </li>
        </ul>
      </div>

      <div className={styles.uiSettings}>
        <h1>UI Settings</h1>
        <ul>
          <li>
            <h3>Themes</h3>
            <p>Light Mode</p>
          </li>
        </ul>
      </div>

      <div className={styles.messagesSettings}>
        <h1>Messages Settings</h1>
        <ul>
          <li>
            <h3>Default Time Limit</h3>
            <p>{snapTime === - 1 ? 'No Limit' : snapTime}</p>
            <button>Update</button>
          </li>
        </ul>
      </div>

      <div className={styles.cameraSettings}>
        <h1>Camera Settings</h1>
        <ul>
          <li>
            <h3>Resolution</h3>
            <p>{camRes}</p>
          </li>
        </ul>
      </div>
      {isUserLoggedIn &&
        <div className={styles.logout}>
          <button onClick={logout}><h1>Log Out</h1></button>
        </div>
      }
      <div>
        <p>Project Yellow Ghost {version}</p>
      </div>
    </div>
  );
}

Account.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  user: PropTypes.object,
  camRes: PropTypes.number,
  camVideo: PropTypes.string,
  camMic: PropTypes.string,
  showStats: PropTypes.bool,
  cameraButton: PropTypes.string,
  handleScroll: PropTypes.func,
  isUserLoggedIn: PropTypes.bool,
  snapTime: PropTypes.number,
};

Account.defaultProps = {
  height: window.innerHeight,
  width: window.innerWidth,
  user: {},
  camRes: null,
  camVideo: null,
  camMic: null,
  showStats: false,
  cameraButton: 'bottom',
  handleScroll: () => {},
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
    user: state.user.user,
    camRes: state.camera.cameraResolution,
    camVideo: state.camera.cameraVideoOutput,
    camMic: state.camera.cameraAudioInput,
    showStats: state.camera.showStats,
    cameraButton: state.camera.cameraButton,
    isUserLoggedIn: state.user.isUserLoggedIn,
    snapTime: state.camera.snapTime,
  };
}

const mapDispatchToProps = {
  editFakeDB,
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);
