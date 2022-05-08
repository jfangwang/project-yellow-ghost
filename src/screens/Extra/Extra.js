import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styles from './Extra.module.css';


/**
 * @param {*} props
 * @return {*}
 */
function Extra(props) {
  const {handleScroll} = props;
  return (
    <div className={styles.background} onScroll={handleScroll}>
      <h1>Extra</h1>
    </div>
  );
}

Extra.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  handleScroll: PropTypes.func,
};

Extra.defaultProps = {
  height: window.innerHeight,
  width: window.innerWidth,
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
  };
}

const mapDispatchToProps = {
};


export default connect(mapStateToProps, mapDispatchToProps)(Extra);
