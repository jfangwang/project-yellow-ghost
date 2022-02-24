import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import './Messages.css'
import Message from './Message'

function Messages({userDoc}) {
  let userList = Object.keys(userDoc);

  if (userList.length > 0) {
    let friendList = userDoc['friends'];
    return (
      <ul className="messages-container">
        {Object.keys(friendList).sort().map((key) => (
          <Message streak_emoji={userDoc[key]} friend={friendList[key]} />
        ))}
      </ul>
    )
  } else {
    return (
      <ul className="messages-container">
        <Message />
      </ul>
    )
  }
}

Messages.propTypes = {}

export default Messages
