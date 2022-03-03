import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import './Messages.css'
import Message from './Message'

function Messages({userDoc}) {
  return (
    <ul className="messages-container">
      <Message />
    </ul>
  )
}

Messages.propTypes = {}

export default Messages
