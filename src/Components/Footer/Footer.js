import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import styles from './Footer.module.css';
import {IconContext, Chat, Camera, Users} from 'phosphor-react';


/**
 *
 *
 * @export
 * @param {*} props
 * @return {*}
 */
export function Footer(props) {
  const {index, opacity, position, hideNavFoot, decIndex} = props;

  const color = `rgb(
    ${255 - (Math.abs(1 - decIndex) * 255)},
    ${255 - (Math.abs(1 - decIndex) * 255)},
    ${255 - (Math.abs(1 - decIndex) * 255)}
  )`;

  return (
    <>
      <footer
        className={styles.mainFooter}
        style={{
          opacity: opacity,
          position: position,
          zIndex: hideNavFoot ? -1 : 1,
        }}
      >
        <IconContext.Provider
          value={{
            size: '1.8rem',
            weight: 'bold',
          }}
        >
          <Link to="/messages" replace>
            <Chat color={index === 0 ? 'DodgerBlue' : color}/>
          </Link>
          <Link to="/camera" replace>
            <Camera color={index === 1 ? 'yellow' : color}/>
          </Link>
          <Link to="/discover" replace>
            <Users color={index === 2 ? 'purple' : color}/>
          </Link>
        </IconContext.Provider>
      </footer>
    </>
  );
}

Footer.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  opacity: PropTypes.number,
  position: PropTypes.string,
  index: PropTypes.number,
  hideNavFoot: PropTypes.bool,
  decIndex: PropTypes.number,
};

Footer.defaultProps = {
  height: window.innerHeight,
  width: window.innerWidth,
  opacity: 1,
  position: 'absolute',
  index: 1,
  hideNavFoot: false,
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
    hideNavFoot: state.global.hideNavFoot,
    decIndex: state.global.decIndex,
  };
}


export default connect(mapStateToProps)(Footer);
