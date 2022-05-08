import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import styles from './Signup.module.css';
import {changeToIndex} from '../../Actions/globalActions';
import PropTypes from 'prop-types';

/**
 * @param {*} props
 * @return {*}
 */
function Signup(props) {
  const {changeToIndex} = props;

  useEffect(() => {
    changeToIndex(0);
  }, []);

  return (
    <div className={styles.background}>
      <h1>Sign Up</h1>
      <form>
        <div>
          <label>Name</label>
          <input type='text' placeholder='First'/>
          <input type='text' placeholder='Last'/>
        </div>
        <div>
          <label>Username</label>
          <input type='text' placeholder=''/>
        </div>
        <input type="submit" value="Create Account"/>
      </form>
    </div>
  );
}

Signup.propTypes = {
  changeToIndex: PropTypes.func,
};

Signup.defaultProps = {
  changeToIndex: () => {},
};

/**
 *
 *
 * @param {*} state
 * @return {*}
 */
function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {
  changeToIndex,
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
