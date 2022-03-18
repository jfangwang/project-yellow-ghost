import React from 'react'
import './Messages.css'
import './Message.css'
import Message from './Message'

const list = [];

for (let i = 0; i < 30; i += 1) {
  list.push(<Message />);
}

function Messages({ userDoc, disableNavFootSlide, height, width, loggedIn, toggleSnapShot }) {
  return (
    <>
      <ul className="messages-container">
        {!loggedIn &&
          <li>
            <div className="guest_message">
              {/* <button><CloseRoundedIcon/></button> */}
              <h4>
                Welcome to Project Yellow Ghost, a web app version of SnapChat.
                Right now, you are on a local guest account for you to try out.
                Feel free to sign in at the top if you want to start using this product.
                Happy Snapping!
              </h4>
            </div>
          </li>
        }
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
