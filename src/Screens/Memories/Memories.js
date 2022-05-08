import React, {useState} from 'react';
import styles from './Memories.module.css';
import PropTypes from 'prop-types';
import {editUser, editFakeDB} from '../../Actions/userActions';
import {connect} from 'react-redux';
import Memory from './Memory';

/**
 * @param {*} props
 * @return {*}
 */
function Memories(props) {
  const {
    handleScroll,
    user,
  } = props;
  const [edit, setEdit] = useState(false);

  /**
   *
   */
  function toggleEdit() {
    setEdit(!edit);
  }

  return (
    <div className={styles.background} onScroll={handleScroll}>
      {Object.keys(user.memories).length > 0 &&
        <button onClick={() => toggleEdit()}>
          {edit ? 'Cancel' : 'Edit'}
        </button>
      }
      <div className={styles.memoriesSection}>
        { Object.keys(user.memories).map((id) => (
          <Memory key={id} imgObj={user.memories[id]} edit={edit} user={user}/>
        ))}
        { Object.keys(user.memories).length <= 0 &&
          <h2>No Memories Found</h2>
        }
      </div>
    </div>
  );
}

Memories.propTypes = {
  handleScroll: PropTypes.func,
  user: PropTypes.object,
  fakeDB: PropTypes.object,
  editFakeDB: PropTypes.func,
  editUser: PropTypes.func,
};

Memories.defaultProps = {
  handleScroll: () => {},
  user: {},
  fakeDB: {},
  editFakeDB: () => {},
  editUser: () => {},
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
  editUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Memories);
