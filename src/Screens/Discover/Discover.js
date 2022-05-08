import React, {Component} from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import PropTypes from 'prop-types';
import {MetaTags} from 'react-meta-tags';

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
          <Navbar opacity={0} position="relative" />
          <h1>Discover</h1>
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
