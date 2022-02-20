import React from 'react'
import PropTypes from 'prop-types'
import './Messages.css'
import Message from './Message'

function Messages(props) {
  return (
    <ul className="messages-container">
      <Message/>
    </ul>
  )
}

Messages.propTypes = {}

export default Messages
