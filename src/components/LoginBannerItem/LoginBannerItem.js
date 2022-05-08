import React, {useRef} from 'react';
import styles from './LoginBannerItem.module.css';
import {toggleSlide, toggleNavFoot} from '../../Actions/globalActions';
import
SlidingMenuRouting from '../../Components/SlidingMenu/SlidingMenuRouting';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Signup from '../../Screens/Signup/Signup';
import {auth, GoogleAuthProvider, db} from '../../Firebase/Firebase';
import {
  createEveryoneEntry,
  createUserEntry,
} from '../../Assets/data/GuestInfo';


/**
 * @param {*} props
 * @return {*}
 */
function LoginBannerItem(props) {
  const signupMenu = useRef();
  const {toggleNavFoot, toggleSlide, height, width} = props;

  /**
   * @param {*} e
   */
  function toggleUI(e) {
    toggleNavFoot(e);
    toggleSlide(e);
  }

  /**
   *
   */
  function login() {
    auth.signInWithPopup(GoogleAuthProvider).then((result) => {
      if (result.additionalUserInfo.isNewUser === true) {
        createUser(result.user);
      }
    });
  }

  /**
   *
   *
   * @param {*} user
   */
  function createUser(user) {
    // Creates new a user doc
    db.collection('Users').doc(user.uid).set(createUserEntry(user));
    // Creates or add user to everyone doc
    db.collection('Users').doc('Everyone').get().then((doc) => {
      if (doc.exists) {
        const update = doc.data();
        update['all_users'][`${user.uid}`] = createEveryoneEntry(user);
        db.collection('Users').doc('Everyone').update(update);
      } else {
        db.collection('Users').doc('Everyone').set({
          all_users: {
            [`${user.uid}`]: createEveryoneEntry(user),
          },
        });
      }
    });
  }

  return (
    <>
      <div className={styles.background}>
        <button onClick={() => login()}><h2>Login with Google</h2></button>
      </div>
      <SlidingMenuRouting
        ref={signupMenu}
        height={height}
        width={width}
        toggleSlide={toggleUI}
        title="Sign Up"
        path="/signup"
      >
        <Signup />
      </SlidingMenuRouting>
    </>
  );
}

LoginBannerItem.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  toggleSlide: PropTypes.func,
  toggleNavFoot: PropTypes.func,
};

LoginBannerItem.defaultProps = {
  height: window.innerHeight,
  width: window.innerWidth,
  toggleSlide: () => {},
  toggleNavFoot: () => {},
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
  toggleSlide,
  toggleNavFoot,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginBannerItem);
