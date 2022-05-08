import React from 'react';
import PropTypes from 'prop-types';
import styles from './AddFriendItem.module.css';
import {connect} from 'react-redux';
import {editUser, editFakeDB} from '../../Actions/userActions';
import {db} from '../../Firebase/Firebase';
import {
  IconContext,
  UserMinus,
  UserPlus,
  HourglassMedium,
  X,
} from 'phosphor-react';

const friendContent = {
  lastTimeStamp: null,
  messages: {},
  newSnaps: {},
  nickname: null,
  openedByMe: {
    lastTimeStamp: null,
    opened: 0,
  },
  openedByFriend: {
    lastTimeStamp: null,
    opened: 0,
  },
  readSnaps: [],
  received: {
    lastTimeStamp: null,
    receivedSnaps: 0,
  },
  sent: {
    lastTimeStamp: null,
    sentSnaps: 0,
  },
  status: 'new-friend',
  streak: 0,
  streakRef: null,
};

/**
 * @param {*} props
 * @return {*} ;
 */
function AddFriendItem(props) {
  const {
    type,
    friend,
    user,
    isUserLoggedIn,
    fakeDB,
    editUser,
    editFakeDB,
    everyone,
  } = props;

  let buttonType;

  if (type === 'pending') {
    buttonType = (<><HourglassMedium /><p><b>Pending</b></p></>);
  } else if (type === 'addedMe') {
    buttonType = (<><UserPlus /><p><b>Accept</b></p></>);
  } else if (type === 'quickAdd') {
    buttonType = (<><UserPlus /><p><b>Add</b></p></>);
  } else if (type === 'friends') {
    buttonType = (<><UserMinus /><p><b>Remove</b></p></>);
  } else {
    buttonType = (<></>);
  }

  /**
   * Remove Pending
   */
  function removePending() {
    const update = {...user};
    const fakeUpdate = {...fakeDB};
    if (isUserLoggedIn === false) {
      delete fakeUpdate[friend.id]['addedMe'][user.id];
      delete update['pending'][friend.id];
      editUser(update);
      editFakeDB(fakeUpdate);
    } else {
      delete update['pending'][friend.id];
      db.collection('Users').doc(user.id).update(update);
      db.collection('Users').doc(friend.id).get().then((friendDoc) => {
        const doc = friendDoc.data();
        delete doc['addedMe'][user.id];
        db.collection('Users').doc(friend.id).update(doc);
      });
    }
    console.log('remove pending');
  }

  /**
   * Change FakeDB
   */
  function changeFakeDB() {
    const update = {...user};
    const fakeUpdate = {...fakeDB};
    if (type === 'addedMe') {
      if (!Object.keys(user.brokeup).includes(friend.id)) {
        const newDate = new Date().toLocaleString();
        update.friends[friend.id] = {
          ...update.addedMe[friend.id],
          ...friendContent,
          friendship: newDate,
        };
        fakeUpdate[friend.id]['friends'][update.id] = {
          ...update.pending[friend.id],
          ...friendContent,
          friendship: newDate,
        };
        delete update.addedMe[friend.id];
        delete fakeUpdate[friend.id]['pending'][user.id];
      } else {
        update.friends[friend.id] = update.brokeup[friend.id];
        delete update.brokeup[friend.id];
        fakeUpdate[friend.id]['friends'][user.id]['status'] = 'new-friend';
      }
    } else if (type === 'quickAdd') {
      fakeUpdate[friend.id]['addedMe'][user.id] = fakeUpdate[user.id];
      update['pending'][friend.id] = fakeUpdate[friend.id];
      update['pending'][friend.id]['status'] = 'pending';
    } else if (type === 'friends') {
      update.brokeup[friend.id] = update.friends[friend.id];
      delete update.friends[friend.id];
      fakeUpdate[friend.id]['friends'][user.id]['status'] = 'not-friends';
    }
    editUser(update);
    editFakeDB(fakeUpdate);
  }

  /**
   * Change actions on firebase
   */
  function change() {
    console.log('firebase');
    const userDoc = {...user};
    if (type === 'addedMe') {
      if (!Object.keys(user.brokeup).includes(friend.id)) {
        const newDate = new Date().toLocaleString();
        userDoc.friends[friend.id] = {
          ...userDoc.addedMe[friend.id],
          ...friendContent,
          friendship: newDate,
        };
        delete userDoc.addedMe[friend.id];

        db.collection('Users').doc(friend.id).get().then((friendDoc) => {
          const doc = friendDoc.data();
          doc['friends'][userDoc.id] = {
            ...doc.pending[user.id],
            ...friendContent,
            friendship: newDate,
          };
          delete doc.pending[user.id];
          db.collection('Users').doc(friend.id).update(doc);
        });
      } else {
        userDoc.friends[friend.id] = userDoc.brokeup[friend.id];
        delete userDoc.brokeup[friend.id];

        db.collection('Users').doc(friend.id).get().then((friendDoc) => {
          const doc = friendDoc.data();
          doc['friends'][user.id]['status'] = 'new-friend';
          db.collection('Users').doc(friend.id).update(doc);
        });
      }
    } else if (type === 'quickAdd') {
      userDoc['pending'][friend.id] = everyone[friend.id];
      userDoc['pending'][friend.id]['status'] = 'pending';

      db.collection('Users').doc(friend.id).get().then((friendDoc) => {
        const doc = friendDoc.data();
        doc['addedMe'][user.id] = everyone[user.id];
        db.collection('Users').doc(friend.id).update(doc);
      });
    } else if (type === 'friends') {
      userDoc.brokeup[friend.id] = userDoc.friends[friend.id];
      delete userDoc.friends[friend.id];
      db.collection('Users').doc(user.id).update(userDoc);

      db.collection('Users').doc(friend.id).get().then((friendDoc) => {
        const doc = friendDoc.data();
        if (Object.keys(doc['friends']).includes(user.id)) {
          doc['friends'][user.id]['status'] = 'not-friends';
        } else {
          delete doc['brokeup'][user.id];
          delete userDoc.brokeup[friend.id];
          db.collection('Users').doc(user.id).update(userDoc);
        }
        db.collection('Users').doc(friend.id).update(doc);
      });
    }
    db.collection('Users').doc(user.id).update(userDoc);
  }

  return (
    <li
      className={styles.row}
      style={{
        justifyContent: 'space-between',
      }}
    >
      <div className={styles.row}>
        <img src={friend['profilePicUrl']} className={styles.profilePic}/>
        <div className={styles.info}>
          <p>
            {friend['firstName']}
            {friend['lastName'] !== null && friend['lastName'][0]}
          </p>
          <p>{friend['username']}</p>
        </div>
      </div>
      <div className={styles.row}>
        <IconContext.Provider
          value={{
            color: 'black',
            size: 15,
            weight: 'bold',
          }}
        >
          { type !== null && user.id !== friend.id &&
            <button>
              <div
                onClick={isUserLoggedIn ? change : changeFakeDB}
                className={styles.row}
              >
                {buttonType}
              </div>
            </button>
          }
          { type === 'pending' &&
            <button onClick={removePending}><X /></button>
          }
        </IconContext.Provider>
      </div>
    </li>
  );
}

AddFriendItem.propTypes = {
  type: PropTypes.string,
  friend: PropTypes.object,
  user: PropTypes.object,
  isUserLoggedIn: PropTypes.bool,
  fakeDB: PropTypes.object,
  editUser: PropTypes.func,
  editFakeDB: PropTypes.func,
  everyone: PropTypes.object,
};

AddFriendItem.defaultProps = {
  type: null,
  isUserLoggedIn: false,
  friend: {},
  user: {},
  fakeDB: {},
  editUser: () => {},
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
    isUserLoggedIn: state.user.isUserLoggedIn,
    fakeDB: state.user.fakeDB,
    everyone: state.user.everyone,
  };
}

const mapDispatchToProps = {
  editUser,
  editFakeDB,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddFriendItem);
