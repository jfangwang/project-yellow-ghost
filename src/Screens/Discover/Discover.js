import React, {Component} from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import PropTypes from 'prop-types';
import {MetaTags} from 'react-meta-tags';
import johnnyDepp from '../../Assets/images/discover/johnnyDepp.jpg';
import foxNews from '../../Assets/images/discover/foxNews.png';
import snl from '../../Assets/images/discover/snl.jpeg';
import nba from '../../Assets/images/discover/nba.jpeg';
import styles from './Discover.module.css';


/**
 * @export
 * @class Discover
 * @extends {Component}
 */
export class Discover extends Component {
  /**
   * @return {*}
   * @memberof Discover
   */
  render() {
    return (
      <>
        <MetaTags>
          <meta
            name = "viewport"
            // eslint-disable-next-line max-len
            content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
        </MetaTags>
        <div>
          <Navbar opacity={0} position="relative"/>
          <div className={styles.discoverContent}>
            <div className={styles.discoverItem}>
              <img
                alt="placeholder"
                src={johnnyDepp}
              />
            </div>
            <div className={styles.discoverItem}>
              <img
                alt="placeholder"
                src={foxNews}
              />
            </div>
            <div className={styles.discoverItem}>
              <img
                alt="placeholder"
                src={snl}
              />
            </div>
            <div className={styles.discoverItem}>
              <img
                alt="placeholder"
                src={nba}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

Discover.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};

Discover.defaultProps = {
  height: window.innerHeight,
  width: window.innerWidth,
};

export default Discover;
