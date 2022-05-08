import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styles from './AddFriends.module.css';
import AddFriendItem from './AddFriendItem';
import {editFakeDB} from '../../Actions/userActions';

const list = [];
for (let i=0; i<100; i+=1) {
  list.push(<h1>asdf</h1>);
}

/**
 *
 *
 * @param {*} props
 * @return {*}
 */
function AddFriends(props) {
  const {
    handleScroll,
    user,
    everyone,
  } = props;
  return (
    <div className={styles.background} onScroll={handleScroll}>
      { Object.keys(user.pending).length > 0 &&
        <>
          <h2>Pending</h2>
          <ul className={styles.peopleList}>
            { Object.keys(user.pending).map((id) => (
              <AddFriendItem
                key={id} user={user} type='pending' friend={user.pending[id]}
              />
            ))}
          </ul>
        </>
      }
      { (Object.keys(user.addedMe).length > 0 ||
        Object.keys(user.brokeup).length > 0) &&
        <>
          <h2>Added Me</h2>
          <ul className={styles.peopleList}>
            { Object.keys(user.addedMe).map((id) => (
              <AddFriendItem
                key={id} user={user} type='addedMe' friend={user.addedMe[id]}
              />
            ))}
            { Object.keys(user.brokeup).map((id) => (
              <AddFriendItem
                key={id} user={user} type='addedMe' friend={user.brokeup[id]}
              />
            ))}
          </ul>
        </>
      }
      <h2>Quick Add</h2>
      <ul className={styles.peopleList}>
        { Object.keys(everyone)
            .filter((x) => !Object.keys(user.friends).includes(x) &&
                          !Object.keys(user.pending).includes(x) &&
                          !Object.keys(user.addedMe).includes(x) &&
                          !Object.keys(user.brokeup).includes(x)).map((id) => (
              <AddFriendItem
                key={id} user={user} type='quickAdd' friend={everyone[id]}
              />
            ))
        }
      </ul>
      <h2>Friends</h2>
      <ul className={styles.peopleList}>
        { Object.keys(user.friends).map((id) => (
          <AddFriendItem
            key={id} user={user} type='friends' friend={user.friends[id]}
          />
        ))}
        { Object.keys(user.friends) <= 0 &&
          <li><h1>Add some friends</h1></li>
        }
      </ul>
      <h2>Everyone</h2>
      <ul className={styles.peopleList}>
        { Object.keys(everyone).map((id) => (
          <AddFriendItem key={id} friend={everyone[id]}/>
        ))}
      </ul>
    </div>
  );
}

AddFriends.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  test: PropTypes.func,
  handleScroll: PropTypes.func,
  user: PropTypes.object,
  everyone: PropTypes.object,
  isUserLoggedIn: PropTypes.bool,
  handleScroll: PropTypes.func,
};

AddFriends.defaultProps = {
  height: window.innerHeight,
  width: window.innerWidth,
  test: () => {},
  handleScroll: () => {},
  user: {},
  everyone: {},
  isUserLoggedIn: 'false',
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
    isUserLoggedIn: state.user.isUserLoggedIn,
    user: state.user.user,
    fakeDB: state.user.fakeDB,
    everyone: state.user.everyone,
  };
}

const mapDispatchToProps = {
  editFakeDB,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddFriends);
