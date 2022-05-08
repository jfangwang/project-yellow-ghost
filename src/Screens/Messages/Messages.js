import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import Message from './Message';
import styles from './Messages.module.css';
import {connect} from 'react-redux';
import {MetaTags} from 'react-meta-tags';
import LoginBannerItem from '../../Components/LoginBannerItem/LoginBannerItem';

const list = [];
for (let i = 0; i < 200; i++) {
  list.push('User ' + i.toString());
}

/**
 * @export
 * @class Messages
 * @extends {Component}
 */
class Messages extends Component {
  /**
   * Creates an instance of Messages.
   * @param {*} props
   * @memberof Messages
   */
  constructor(props) {
    super(props);
  }
  /**
   * @return {*}
   * @memberof Messages
   */
  render() {
    const {friends, user, isUserLoggedIn} = this.props;
    return (
      <>
        <MetaTags>
          <meta
            name = "viewport"
            content = "width=device-width, \
            minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
        </MetaTags>
        <div className={styles.backgrounds}>
          <Navbar opacity={0} position="relative" />
          {!isUserLoggedIn && <LoginBannerItem />}
          {Object.keys(friends).map((id) => (
            <Message key={id} friend={friends[id]} user={user}/>
          ))}
          {Object.keys(user.pending).map((id) => (
            <Message key={id} friend={user.pending[id]} user={user}/>
          ))}
          <Footer position="relative" opacity={0} />
        </div>
      </>
    );
  }
}

Messages.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  friends: PropTypes.object,
  user: PropTypes.object,
  isUserLoggedIn: PropTypes.bool,
};

Messages.defaultProps = {
  height: window.innerHeight,
  width: window.innerWidth,
  friends: {},
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
    height: state.global.height,
    width: state.global.width,
    friends: state.user.user.friends,
    user: state.user.user,
    isUserLoggedIn: state.user.isUserLoggedIn,
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
