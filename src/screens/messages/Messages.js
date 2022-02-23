import React from 'react'
import PropTypes from 'prop-types'
import './Messages.css'
import Message from './Message'

let item = <Message/>
let list = []
for (let i = 0; i < 30; i++) {
  list.push(item);
}
function Messages(props) {
  return (
    <ul className="messages-container">
      {list}
    </ul>
  )
}

Messages.propTypes = {}

export default Messages
