import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import './Messages.css'
import Message from './Message'

const list = [];

for (let i = 0; i < 30; i += 1) {
  list.push(<Message />);
}

function Messages({userDoc, disableNavFootSlide}) {
  return (
    <ul className="messages-container">
      <Message disableNavFootSlide={disableNavFootSlide}/>
      {list}
    </ul>
  )
}

Messages.propTypes = {}

export default Messages
