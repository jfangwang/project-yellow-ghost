import React from 'react';
import styles from './Search.module.css';
import PropTypes from 'prop-types';


/**
 * @param {*} props
 * @return {*}
 */
export function BestFriends(props) {
  const {friend} = props;
  return (
    <li className={styles.bestFriends}>
      <button>
        <img src={friend.profilePicUrl}/>
        {friend.username !== null ?
          <h3>{friend.username}</h3> :
          <h3>{friend.firstName}</h3>
        }
      </button>
    </li>
  );
}

BestFriends.propTypes = {
  friend: PropTypes.object,
};

/**
 * @param {*} props
 * @return {*}
 */
export function Recent(props) {
  const {friend} = props;
  let status;

  switch (friend.status) {
    case 'new-friend':
      status = 'New Friend';
      break;
    case 'pending':
      status = 'Pending';
    case 'not-friends':
      status = 'Not Friends';
    case 'blocked':
      status = 'Blocked';
    default:
      status = friend.status;
      break;
  }
  return (
    <li className={styles.recent}>
      <button>
        <img src={friend.profilePicUrl}/>
        {friend.username !== null ?
          <h3>{friend.username}</h3> :
          <h3>{friend.firstName}</h3>
        }
        <h3 className={styles.status}>{status}</h3>
      </button>
    </li>
  );
}

Recent.propTypes = {
  friend: PropTypes.object,
};
