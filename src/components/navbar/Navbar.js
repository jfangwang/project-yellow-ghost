import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import SlidingMenuRouting from '../SlidingMenu/SlidingMenuRouting';
import styles from './Navbar.module.css';
import {connect} from 'react-redux';
import {toggleSlide} from '../../Actions/globalActions';
import {toggleFacingMode} from '../../Actions/cameraActions';
import Account from '../../Screens/Account/Account';
import Search from '../../Screens/Search/Search';
import AddFriends from '../../Screens/AddFriends/AddFriends';
import Extra from '../../Screens/Extra/Extra';
import {setScreen} from '../../Actions/cameraActions';
import {
  IconContext,
  User,
  MagnifyingGlass,
  UserPlus,
  DotsThree,
  ArrowsClockwise,
} from 'phosphor-react';

/**
 *
 *
 * @export
 * @param {*} props
 * @return {*}
 */
export function Navbar(props) {
  const {
    index,
    decIndex,
    toggleSlide,
    position,
    opacity,
    placeHolder,
    toggleFacingMode,
    hideNavFoot,
  } = props;
  const accountMenu = useRef();
  const searchMenu = useRef();
  const addFriendMenu = useRef();
  const extraMenu = useRef();

  return (
    <>
      <div
        className={styles.mainNavbar}
        // style={{
        //   backgroundColor: `rgba(255, 255, 255, ${Math.abs(1 - decIndex)})`
        // }}
        style={{
          backgroundColor: `rgba(255, 255, 255, 0)`,
          position: position,
          zIndex: hideNavFoot ? -1 : 1,
        }}
      >
        <IconContext.Provider
          value={{
            color: `rgb(
            ${255 - (Math.abs(1 - decIndex) * 255)},
            ${255 - (Math.abs(1 - decIndex) * 255)},
            ${255 - (Math.abs(1 - decIndex) * 255)}
          )`,
            size: 32,
            weight: 'bold',
            mirrored: true,
          }}
        >
          <div style={{opacity: opacity}}>
            <button onClick={
            !placeHolder ? () => accountMenu.current.toggle() : () => { }
            }>
              <User />
            </button>
            <button onClick={
            !placeHolder ? () => searchMenu.current.toggle() : () => { }
            }>
              <MagnifyingGlass />
            </button>
          </div>
          <div style={{opacity: opacity}}>
            <h1
              style={{
                color: `rgba(${255 - (Math.abs(1 - decIndex) * 255)},` +
                `${255 - (Math.abs(1 - decIndex) * 255)},` +
                `${255 - (Math.abs(1 - decIndex) * 255)},` +
                `${(Math.abs(1 - decIndex))})`,
              }}>
              {decIndex < 1 && 'Chat'}
              {decIndex === 1 && 'Chat'}
              {decIndex > 1 && 'Discover'}
            </h1>
          </div>
          <div style={{opacity: opacity}}>
            <button onClick={
            !placeHolder ? () => addFriendMenu.current.toggle() : () => { }
            }>
              <UserPlus />
            </button>
            {index === 1 ?
            <button onClick={() => toggleFacingMode()}>
              <ArrowsClockwise />
            </button> :
            <button
              onClick={
                !placeHolder ? () => extraMenu.current.toggle() : () => { }
              }>
              <DotsThree />
            </button>
            }
          </div>
          {!placeHolder &&
          <>
            <SlidingMenuRouting
              axis='x'
              ref={accountMenu}
              toggleSlide={toggleSlide}
              title="Account"
              path="/account"
            >
              <Account />
            </SlidingMenuRouting>
            <SlidingMenuRouting
              ref={searchMenu}
              toggleSlide={toggleSlide}
              title="Search"
              path="/search"
            >
              <Search />
            </SlidingMenuRouting>
            <SlidingMenuRouting
              ref={addFriendMenu}
              toggleSlide={toggleSlide}
              title="Add Friends"
              path="/add_friends"
            >
              <AddFriends />
            </SlidingMenuRouting>
            <SlidingMenuRouting
              ref={extraMenu}
              toggleSlide={toggleSlide}
              title="Extra"
              path="/extra"
            >
              <Extra />
            </SlidingMenuRouting>
          </>
          }
        </IconContext.Provider>
      </div>
    </>
  );
}

Navbar.propTypes = {
  index: PropTypes.number,
  decIndex: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
  position: PropTypes.string,
  opacity: PropTypes.number,
  toggleSlide: PropTypes.func,
  placeHolder: PropTypes.bool,
  toggleFacingMode: PropTypes.func,
  hideNavFoot: PropTypes.bool,
  setScreen: PropTypes.func,
};

Navbar.defaultProps = {
  index: 1,
  decIndex: 1,
  height: window.innerHeight,
  width: window.innerWidth,
  position: 'absolute',
  opacity: 1,
  toggleSlide: () => { },
  toggleFacingMode: () => { },
  setScreen: () => {},
  placeHolder: true,
  hideNavFoot: false,
};

/**
 *
 *
 * @param {*} state
 * @return {*}
 */
function mapStateToProps(state) {
  return {
    index: state.global.index,
    height: state.global.height,
    width: state.global.width,
    decIndex: state.global.decIndex,
    hideNavFoot: state.global.hideNavFoot,
  };
}

const mapDispatchToProps = {
  toggleSlide,
  toggleFacingMode,
  setScreen,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
