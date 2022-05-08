import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import GuestPic from '../../Assets/images/guest-profile-pic.png';
import styles from './SendItem.module.css';
import {Circle, CheckCircle} from 'phosphor-react';
import {connect} from 'react-redux';
import {updateSendList} from '../../Actions/cameraActions';


/**
 * Send item in a list
 * @param {*} props
 * @return {*}
 */
function SendItem(props) {
  const [selected, setSelected] = useState(false);
  const {
    friend,
    user,
    updateSendList,
    sendList,
  } = props;

  /**
   * Toggle
   */
  function toggle() {
    if (selected === false) {
      updateSendList([...sendList, friend.id]);
    } else {
      const a = sendList.filter((item) => item !== friend.id);
      updateSendList(a);
    }
  }

  useEffect(() => {
    setSelected(false);
    sendList.forEach((item) => {
      if (item === friend.id) {
        setSelected(true);
      }
    });
  }, [sendList]);

  return (
    <li
      onClick={toggle}
      className={styles.sendItem}
    >
      <div className={styles.row}>
        <img
          className={styles.profilePic}
          src={friend.profilePicUrl}
        />
        <div className={styles.col}>
          <h3>
            {friend.username ?
            friend.username :
            `${friend.firstName}`}
          </h3>
          <div className={styles.row}>
            <h4 style={{marginRight: '0.2rem'}}>{friend.streak}</h4>
            <h5>{user.streakEmoji}</h5>
          </div>
        </div>
      </div>
      { selected ?
        <CheckCircle size='3rem' color='rgb(38, 131, 189)' weight='fill'/> :
        <Circle size='3rem' color='grey'/>
      }
    </li>
  );
}

SendItem.propTypes = {
  friend: PropTypes.object,
  user: PropTypes.object,
  updateSendList: PropTypes.func,
  sendList: PropTypes.array,
};

SendItem.defaultProps = {
  friend: {
    username: 'User',
    profilePicUrl: GuestPic,
    status: 'unknown',
    streak: 0,
    lastTimeStamp: null,
    id: null,
  },
  user: {
    streakEmoji: '\u{1F525}',
  },
  updateSendList: () => {},
  sendList: [],
};

/**
 * @param {*} state
 * @return {*}
 */
function mapStateToProps(state) {
  return {
    sendList: state.camera.sendList,
  };
}

const mapDispatchToProps = {
  updateSendList,
};

export default connect(mapStateToProps, mapDispatchToProps)(SendItem);
