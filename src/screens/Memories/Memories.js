import React from 'react';
import styles from './Memories.module.css';
import PropTypes from 'prop-types';
import {editFakeDB} from '../../Actions/userActions';
import {connect} from 'react-redux';

/**
 * @param {*} props
 * @return {*}
 */
function Memories(props) {
  const {
    handleScroll,
    user,
  } = props;
  return (
    <div className={styles.background} onScroll={handleScroll}>
      { Object.keys(user.memories).map((id) => (
        <img key={id} src={user.memories[id]['url']}/>
      ))}
      { Object.keys(user.memories).length <= 0 &&
        <h2>No Memories Found</h2>
      }
    </div>
  );
}

Memories.propTypes = {
  handleScroll: PropTypes.func,
  user: PropTypes.object,
  fakeDB: PropTypes.object,
  editFakeDB: PropTypes.func,
};

Memories.defaultProps = {
  handleScroll: () => {},
  user: {},
  fakeDB: {},
  editFakeDB: () => {},
};

/**
 *
 *
 * @param {*} state
 * @return {*}
 */
function mapStateToProps(state) {
  return {
    user: state.user.user,
    fakeDB: state.user.fakeDB,
  };
}

const mapDispatchToProps = {
  editFakeDB,
};

export default connect(mapStateToProps, mapDispatchToProps)(Memories);
