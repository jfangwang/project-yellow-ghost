import React from 'react';
import PropTypes from 'prop-types';
import {editUser, editFakeDB} from '../../Actions/userActions';
import {connect} from 'react-redux';
import styles from './Memory.module.css';
import {db, storage} from '../../Firebase/Firebase';
import {
  IconContext,
  XCircle,
} from 'phosphor-react';

/**
 * @param {*} props
 * @return {*}
 */
function Memory(props) {
  const {imgObj, edit, isUserLoggedIn, user, editUser} = props;

  /**
   *
   */
  function remove() {
    const updated = {...user};
    const d = imgObj.date;
    const ref = storage.ref(`posts/${updated.memories[d]['id']}`);
    if (isUserLoggedIn) {
      delete updated.memories[imgObj.date];
      ref.delete().then(async () => {
        await db.collection('Users').doc(user.id).update(updated);
      });
    } else {
      delete user.memories[imgObj.date];
      editUser(updated);
    }
  }

  return (
    <IconContext.Provider
      value={{
        color: 'red',
        size: '3rem',
        weight: 'fill',
      }}
    >
      <div className={styles.background}>
        <img
          src={imgObj['url']}
          className={imgObj['orientation'] === 'landscape' ?
            styles.landscape : styles.portrait}
        />
        {edit &&
          <button
            onClick={() => remove()}
            className={styles.removeButton}
          ><XCircle /></button>
        }
      </div>
    </IconContext.Provider>
  );
}

Memory.propTypes = {
  edit: PropTypes.bool,
  imgObj: PropTypes.object,
  user: PropTypes.object,
  fakeDB: PropTypes.object,
  editFakeDB: PropTypes.func,
  editUser: PropTypes.func,
  isUserLoggedIn: PropTypes.bool,
  user: PropTypes.object,
};

Memory.defaultProps = {
  imgObj: {},
  user: {},
  fakeDB: {},
  edit: false,
  editFakeDB: () => {},
  editUser: () => {},
  isUserLoggedIn: false,
  user: {},
};

/**
 *
 *
 * @param {*} state
 * @return {*}
 */
function mapStateToProps(state) {
  return {
    fakeDB: state.user.fakeDB,
    isUserLoggedIn: state.user.isUserLoggedIn,
  };
}

const mapDispatchToProps = {
  editFakeDB,
  editUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Memory);
