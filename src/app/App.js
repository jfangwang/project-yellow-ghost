import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './App.css';
import {BrowserRouter as Route, BrowserRouter} from 'react-router-dom';
import SwipeableRoutes from 'react-swipeable-routes';
import Camera from '../Screens/Camera/Camera';
import Messages from '../Screens/Messages/Messages';
import Discover from '../Screens/Discover/Discover';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import {MetaTags} from 'react-meta-tags';
import {
  resize,
  changeToIndex,
  updateDecimalIndex,
  toggleSlide,
} from '../Actions/globalActions';
import {connect} from 'react-redux';
import {db, storage} from '../Firebase/Firebase';
import {
  editUser,
  editEveryone,
  loggedIn,
  loggedOut,
} from '../Actions/userActions';
import {store} from '../index';
import firebase from 'firebase/compat/app';

let userSnapshot;
let everyoneSnapshot;


/**
 * @export
 * @param {*} user
 * @param {*} props
 */
export function startUserSS(user) {
  userSnapshot = db.collection('Users').doc(user.uid).onSnapshot(
      {includeMetadataChanges: false},
      (doc) => {
        store.dispatch(editUser(doc.data()));
        // Delete opened snaps
        Object.keys(doc.data()['allSnapsSent'])
            .forEach(async function(imgDate) {
              if (doc.data()['allSnapsSent'][imgDate]['sentTo'].length == 0) {
                const imgID = doc.data()['allSnapsSent'][imgDate]['imgID'];
                await storage.ref(`posts/${imgID}`).delete();
                db.collection('Users').doc(user.uid).update({
                  [`allSnapsSent.${imgDate}`]: firebase.firestore
                      .FieldValue.delete(),
                });
              }
            });
      }, (err) => console.log('error: ', err));
}

/**
 * @export
 */
export function startEveryoneSS() {
  everyoneSnapshot = db.collection('Users').doc('Everyone').onSnapshot(
      {includeMetadataChanges: false},
      (doc) => {
        store.dispatch(editEveryone(doc.data()['all_users']));
      }, (err) => console.log('error: ', err));
}

/**
 * @export
 */
export function endUserSS() {
  if (userSnapshot !== undefined) {
    userSnapshot();
  }
}

/**
 * @export
 */
export function endEveryoneSS() {
  if (everyoneSnapshot !== undefined) {
    everyoneSnapshot();
  }
}

/**
 * App Class
 */
export class App extends Component {
  /**
   * Constructor
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.logKey = this.logKey.bind(this);
    this.checkCurrentUser = this.checkCurrentUser.bind(this);
  }
  /**
   * Runs when component is mounted
   */
  componentDidMount() {
    this.props.resize();
    window.addEventListener('resize', this.props.resize);
    window.addEventListener('keydown', this.logKey);
    this.checkCurrentUser();
  }
  /**
   * tied to event listener, changes index based on given key input.
   * @param {*} e
   */
  logKey(e) {
    if ((this.props.index < 2 && this.props.slideDisabled === false) &&
    (e.code === 'KeyD' || e.code === 'ArrowRight')) {
      this.props.changeToIndex(this.props.index + 1);
    } else if ((this.props.index > 0 && this.props.slideDisabled === false) &&
    (e.code === 'KeyA' || e.code === 'ArrowLeft')) {
      this.props.changeToIndex(this.props.index - 1);
    }
  }

  /**
   * @memberof App
   */
  checkCurrentUser() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('user logged in');
        this.props.loggedIn();
        startUserSS(user);
        startEveryoneSS();
      } else {
        console.log('user logged out');
        this.props.loggedOut();
        endUserSS();
        endEveryoneSS();
      }
    });
  }

  /**
   * Renders
   * @return {*}
   */
  render() {
    const {
      height,
      width,
      changeToIndex,
      index,
      updateDecimalIndex,
      slideDisabled,
    } = this.props;
    return (
      <>
        <MetaTags>
          <meta
            name = "viewport"
            // eslint-disable-next-line max-len
            content = "width=device-width, minimum-scale=1.0 maximum-scale = 1.0, user-scalable = no"
          />
        </MetaTags>
        <BrowserRouter>
          <SwipeableRoutes
            enableMouseEvents
            onSwitching={updateDecimalIndex}
            index={index}
            onChangeIndex={changeToIndex}
            disabled={slideDisabled}
            style={{
              backgroundColor: 'white',
              height: height,
              width: width,
            }}
            containerStyle={{height: '100%'}}
            replace
          >
            <Route exact path="/messages" component={Messages} />
            <Route exact path="/camera" component={Camera} />
            <Route exact path="/discover" component={Discover} />
          </SwipeableRoutes>
          <Footer />
          <Navbar placeHolder={false}/>
        </BrowserRouter>
      </>

    );
  }
}

startUserSS.propTypes = {
  editUser: PropTypes.func,
};

startEveryoneSS.propTypes = {
  editEveryone: PropTypes.func,
};

App.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  index: PropTypes.number,
  slideDisabled: PropTypes.bool,
  resize: PropTypes.func,
  changeToIndex: PropTypes.func,
  updateDecimalIndex: PropTypes.func,
  toggleSlide: PropTypes.func,
  orientation: PropTypes.string,
  user: PropTypes.object,
  everyone: PropTypes.object,
  editUser: PropTypes.func,
  loggedIn: PropTypes.func,
  loggedOut: PropTypes.func,
};

App.defaultProps = {
  height: window.innerHeight,
  width: window.innerWidth,
  index: 1,
  slideDisabled: false,
  orientation: window.innerHeight >= window.innerWidth ?
  'portrait' : 'landscape',
  resize: () => {},
  changeToIndex: () => {},
  updateDecimalIndex: () => {},
  toggleSlide: () => {},
  user: {},
  everyone: {},
  editUser: () => {},
  loggedIn: () => {},
  loggedOut: () => {},
};
/**
 * mapStateToProps to fetch states from redux store
 * @param {int} state
 * @return {object}
 */
function mapStateToProps(state) {
  return {
    height: state.global.height,
    width: state.global.width,
    index: state.global.index,
    slideDisabled: state.global.slideDisabled,
    orientation: state.global.orientation,
    user: state.user.user,
    everyone: state.user.everyone,
  };
}

const mapDispatchToProps = {
  resize,
  changeToIndex,
  updateDecimalIndex,
  toggleSlide,
  editUser,
  editEveryone,
  loggedIn,
  loggedOut,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
