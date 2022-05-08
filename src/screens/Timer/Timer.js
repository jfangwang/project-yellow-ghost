import React from 'react';
import PropTypes from 'prop-types';
import {updateSnapTime} from '../../Actions/cameraActions';
import {connect} from 'react-redux';
import styles from './Timer.module.css';

const list = [];
for (let i = 0; i < 10; i += 1) {
  list.push(
      <option
        value={i + 1}
        key={`option:${i}`}
      >
        {i + 1} {i == 0 ? 'second' : 'seconds'}
      </option>,
  );
}

/**
 * @param {*} props
 * @return {*}
 */
function Timer(props) {
  const {
    updateSnapTime,
    snapTime,
  } = props;
  return (
    <div className={styles.background}>
      <select
        onChange={(e) => updateSnapTime(parseInt(e.target.value))}
        className={styles.timerSelect}
        defaultValue={snapTime}
      >
        {list}
        <option key={-1} value={-1}>No Limit</option>
      </select>
      <p></p>
    </div>
  );
}

Timer.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  snapTime: PropTypes.number,
  updateSnapTime: PropTypes.func,
};

Timer.defaultProps = {
  height: window.innerHeight,
  width: window.innerWidth,
  snapTime: -1,
  updateSnapTime: () => {},
};

/**
 * @param {*} state
 * @return {*}
 */
function mapStateToProps(state) {
  return {
    height: state.global.height,
    width: state.global.width,
    snapTime: state.camera.snapTime,
  };
}

const mapDispatchToProps = {
  updateSnapTime,
};

export default connect(mapStateToProps, mapDispatchToProps)(Timer);
