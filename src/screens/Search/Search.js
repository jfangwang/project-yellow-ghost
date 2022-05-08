import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styles from './Search.module.css';
import {BestFriends, Recent} from './SearchItem';


/**
 * @param {*} props
 * @return {*}
 */
function Search(props) {
  const {user, handleScroll} = props;
  return (
    <div className={styles.background} onScroll={handleScroll}>
      <h2>Best Friends</h2>
      <ul className={styles.bestFriendsContainer}>
        {Object.keys(user.friends).slice(0, 6).map((id) => (
          <BestFriends key={id} friend={user.friends[id]}/>
        ))}
      </ul>
      <h2>Recents</h2>
      <ul className={styles.recentContainer}>
        {Object.keys(user.friends).map((id) => (
          <Recent key={id} friend={user.friends[id]}/>
        ))}
      </ul>
    </div>
  );
}

Search.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  user: PropTypes.object,
  handleScroll: PropTypes.func,
};

Search.defaultProps = {
  height: window.innerHeight,
  width: window.innerWidth,
  user: {},
  handleScroll: () => {},
};


/**
 * @param {*} state
 * @return {*}
 */
function mapStateToProps(state) {
  return {
    height: state.global.height,
    width: state.global.width,
    user: state.user.user,
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
