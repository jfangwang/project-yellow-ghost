/* eslint-disable */
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {forwardRef, useImperativeHandle} from 'react';
import SwipeableViews from 'react-swipeable-views';
import styles from './Send.module.css';
import SendItem from './SendItem';
import {connect} from 'react-redux';
import {editUser, editFakeDB} from '../../Actions/userActions';
import {changeToIndex} from '../../Actions/globalActions';
import {db, storage} from '../../Firebase/Firebase';
import firebase from 'firebase/compat/app';
import { v4 as uuid } from "uuid";
import {
  IconContext,
  CaretLeft,
  CaretDown,
  PaperPlaneRight,
} from 'phosphor-react';


const SendSlidingMenu = forwardRef((props, ref) => {
  const {
    height,
    width,
    axis,
    toggleSlide,
    setScreen,
    toggleNavFoot,
    editUser,
    editFakeDB,
    user,
    fakeDB,
    sendList,
    aspectRatio,
    isUserLoggedIn,
    snapTime,
    localIndex,
    changeToIndex,
  } = props;
  const [show, setShow] = useState(false);
  const [index, setIndex] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  useImperativeHandle(ref, () => ({
    toggle(e = !show) {
      setShow(e);
    },
  }));

  useEffect(() => {
    if (show) {
      changeLocalToIndex(1);
    }
  }, [show]);

  /**
   * Change to index
   * @param {*} e
   */
  function changeLocalToIndex(e) {
    setIndex(e);
  }

  /**
   * Check which index slide is on
   * @param {*} e
   */
  function checkIndex(e) {
    if (index === 0) {
      setShow(false);
    }
  }
  /**
   * close
   */
  const close = () => {
    changeLocalToIndex(0);
  };

  /**
   * Disables slide unles scroll is at the top
   * @param {*} e
   */
  const handleScroll = (e) => {
    if (e.currentTarget.scrollTop > 0 && axis === 'y') {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  /**
   * Combines all canvas' into one image
   */
  function drawFinalImage() {
    const img = document.getElementById('imageCanvas');
    const fec = document.getElementById('faceEffectsCanvas');
    const drawing = document.getElementById('drawingCanvas');
    const filterImg = document.getElementById(`imgFilter${localIndex}`);
    let final = document.getElementById('finalImage');
    final.width = img.width;
    final.height = img.height;
    final = document.getElementById('finalImage').getContext('2d');
    final.clearRect(0, 0, final.width, final.height);
    final.drawImage(img, 0, 0, img.width, img.height);
    final.drawImage(fec, 0, 0, img.width, img.height);
    if (localIndex == 1) {
      final.drawImage(filterImg,
        (img.width - (img.width * 0.7)) / 2, img.height - (img.height * 0.17),
        img.width * 0.7, img.height * 0.17
        );
    } else if (localIndex == 2) {
      final.drawImage(filterImg,
        (img.width - (img.width * 0.7)) / 2, img.height - (img.height * 0.15),
        img.width * 0.7, img.height * 0.15
        );
    } else if (localIndex == 3) {
      final.drawImage(filterImg,
        (img.width - (img.width * 0.7)) / 2, img.height - (img.height * 0.23),
        img.width * 0.7, img.height * 0.23
        );
    } else if (localIndex == 4) {
      final.drawImage(filterImg,
        (img.width - (img.width)) / 2, img.height - (img.height * 0.99),
        img.width, img.height * 0.99
        );
    }
    final.drawImage(drawing, 0, 0, drawing.width, drawing.height, 0, 0, img.width, img.height);
  }
  /**
   * Send
   */
  async function send() {
    setIsLoading(true);
    drawFinalImage();
    const dataURL = document.getElementById('finalImage').toDataURL();
    const imgID = uuid()
    const date = new Date();
    const updated = {...user};
    const friends = updated.friends;
    const updateFake = {...fakeDB};

    if (!isUserLoggedIn) {
      sendList.forEach((id) => {
        // Update User's Fields
        friends[id]['status'] = 'sent';
        friends[id]['sent']['lastTimeStamp'] = date.toUTCString();
        friends[id]['lastTimeStamp'] = date.toUTCString();
        friends[id]['sent']['sentSnaps'] += 1
        // Update Friend's Fields in FakeDB
        updateFake[id]['friends'][user.id]['received']['lastTimeStamp'] = date.toUTCString();
        updateFake[id]['friends'][user.id]['received']['receivedSnaps'] += 1;
        updateFake[id]['friends'][user.id]['status'] = 'new';
        updateFake[id]['friends'][user.id]['newSnaps'][date.toUTCString()] = {
          'imgURL': dataURL,
          'snapTime': snapTime,
          'type': 'image',
        };
      })
      editUser(updated);
      editFakeDB(updateFake);
      setIsLoading(false);
    } else {
      const ref = storage.ref(`posts/${imgID}`);
      await ref.putString(dataURL, 'data_url').then((snapshot) => {
        snapshot.ref.getDownloadURL().then((imgURL) => {
          return (imgURL);
        }).then(async function(imgURL) {
          await updateUsersDocs(sendList, date, imgID, imgURL);
          setIsLoading(false);
        })
      });
    }

    setScreen('camera');
    toggleSlide();
    toggleNavFoot();
    changeToIndex(0);
  };

  async function updateUsersDocs(sendList, date, imageID, imgURL) {
    const updated = {...user};
    const friends = updated.friends;
    const batch = db.batch();
    updated['allSnapsSent'][date.toUTCString()] = {};
    updated['allSnapsSent'][date.toUTCString()]['sentTo'] = [];
    sendList.forEach((id) => {
      let friendRef = db.collection('Users').doc(id);
      // Update User's Fields on DB
      friends[id]['status'] = 'sent';
      friends[id]['sent']['lastTimeStamp'] = date.toUTCString();
      friends[id]['lastTimeStamp'] = date.toUTCString();
      friends[id]['sent']['sentSnaps'] += 1;
      updated['sent'] += 1;
      updated['allSnapsSent'][date.toUTCString()] = {
        imgID: imageID,
        sentTo: [...updated['allSnapsSent'][date.toUTCString()]['sentTo'], id]
      }

      // let userRef = db.collection('Users').doc(user.id);
      // batch.update(userRef, {
      //   [`friends.${id}.status`]: 'sent',
      //   [`friends.${id}.sent.lastTimeStamp`]: date.toUTCString(),
      //   [`friends.${id}.sent.sentSnaps`] : firebase.firestore.FieldValue.increment(1),
      //   [`friends.${id}.sent`] : firebase.firestore.FieldValue.increment(1),
      //   [`friends.${id}.lastTimeStamp`] : date.toUTCString(),
      // })
      // Update Friend's Fields on DB
      batch.update(friendRef, {
        [`friends.${user.id}.received.lastTimeStamp`]: date.toUTCString(),
        [`friends.${user.id}.received.receivedSnaps`]: firebase.firestore.FieldValue.increment(1),
        [`friends.${user.id}.status`]: 'new',
        [`friends.${user.id}.newSnaps.${date.toUTCString()}`]: {
          'imgURL': imgURL,
          'snapTime': snapTime,
          'type': 'image',
        },
        [`received`]: firebase.firestore.FieldValue.increment(1),
      })
    });
    await db.collection('Users').doc(user.id).update(updated);
    await batch.commit();
  }

  return (
    <>
      {show &&
        <IconContext.Provider
          value={{
            color: 'black',
            size: '1.5rem',
            weight: 'bold',
          }}
        >
          <div style={{overflow: 'hidden', zIndex: 5,}}>
            <SwipeableViews
              disabled={disabled}
              index={index}
              onChangeIndex={changeLocalToIndex}
              onTransitionEnd={checkIndex}
              enableMouseEvents
              axis={axis}
              containerStyle={{height: height, width: width}}
            >
              <div style={{height: height, width: width}}>
                <canvas
                  id='finalImage'
                  style={{
                    width: (width/height) <= (aspectRatio) ? '100%' : 'auto',
                    height: (width/height) <= (aspectRatio) ? 'auto' : '100%',
                    display: 'none',
                  }}
                />
              </div>
              <div
                className={styles.background}
                style={{height: height, width: width}}
              >
                <header>
                  <button onClick={close}>
                    {axis === 'y' ? <CaretDown/> : <CaretLeft/>}
                  </button>
                  <input
                    type='search'
                    autoComplete='on'
                    placeholder='Send To...'
                  ></input>
                </header>
                <div
                  onScroll={handleScroll}
                  style={{
                    height: height,
                    width: width,
                    overflowY: 'auto',
                  }}
                  className={styles.body}
                >
                  <h2>Friends</h2>
                  <ul className={styles.friendsList}>
                    {Object.keys(user.friends).map((item, index) => (
                      <SendItem key={index} friend={user.friends[item]}/>
                    ))}
                  </ul>
                </div>
                { sendList.length > 0 &&
                  <footer>
                    <div className={styles.footerNames}>
                        {sendList.map((item) => (
                          <h2 key={user.friends[item]['firstName']}>
                            {user.friends[item]['firstName']}
                          </h2>
                        ))}
                    </div>
                    <div>
                      { !isloading ?
                        <button
                          className={styles.sendButton}
                          onClick={send}
                        >
                          <h2 style={{marginRight: '0.2rem'}}>Send</h2>
                          <PaperPlaneRight />
                        </button> :
                        <button
                          className={styles.sendButton}
                          onClick={() => {}}
                        >
                          <h2 style={{marginRight: '0.2rem'}}>Loading</h2>
                        </button>
                      }
                    </div>
                  </footer>
                }
              </div>
            </SwipeableViews>
          </div>
        </IconContext.Provider>
      }
    </>
  );
});

SendSlidingMenu.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  axis: PropTypes.string,
  setScreen: PropTypes.func,
  toggleSlide: PropTypes.func,
  toggleNavFoot: PropTypes.func,
  editUser: PropTypes.func,
  editFakeDB: PropTypes.func,
  user: PropTypes.object,
  sendList: PropTypes.array,
  aspectRatio: PropTypes.number,
  isUserLoggedIn: PropTypes.bool,
  localIndex: PropTypes.number,
  changeToIndex: PropTypes.func,
};
SendSlidingMenu.defaultProps = {
  height: window.innerHeight,
  width: window.innerWidth,
  axis: 'y',
  setScreen: () => {},
  toggleSlide: () => {},
  toggleNavFoot: () => {},
  editUser: () => {},
  editFakeDB: () => {},
  changeToIndex: () => {},
  user: {},
  sendList: [],
  isUserLoggedIn: false,
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
    user: state.user.user,
    fakeDB: state.user.fakeDB,
    isUserLoggedIn: state.user.isUserLoggedIn,
    snapTime: state.camera.snapTime,
  };
}

const mapDispatchToProps = {
  editUser,
  editFakeDB,
  changeToIndex,
  // setCameraPermissions,
  // toggleFacingMode,
  // toggleSlide,
  // toggleNavFoot,
  // setScreen,
  // captureImage,
  // updateSendList,
};

export default connect(mapStateToProps, mapDispatchToProps, null, {forwardRef: true})(SendSlidingMenu);
