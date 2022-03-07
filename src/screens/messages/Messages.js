import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import './Messages.css'
import Message from './Message'

const list = [];

for (let i = 0; i < 30; i += 1) {
  list.push(<Message />);
}

function Messages({ userDoc, disableNavFootSlide, height, width, loggedIn, toggleSnapShot }) {
  return (
    <>
      <ul className="messages-container">
        {Object.keys(userDoc.friends).sort().map((key) => (
          <Message
            disableNavFootSlide={disableNavFootSlide}
            friend={userDoc.friends[key]}
            userDoc={userDoc}
            height={height}
            width={width}
            loggedIn={loggedIn}
            toggleSnapShot={toggleSnapShot}
          />
        ))}
        {/* {list} */}
      </ul>
    </>
  )
}

Messages.propTypes = {}

export default Messages
