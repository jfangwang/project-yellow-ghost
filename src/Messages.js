import React, { Component } from 'react';
import './Messages.css';
import MessagesNavbar from './MessagesNavbar';

class Messages extends Component {
    render() {
        return ( 
        <div className="messages-screen">
            <MessagesNavbar />
            <ul className="messages-list">
                <li className="message-content">
                    <p>Sender's Image</p>
                    <ul className="message-info">
                        <h3>Sender's Name</h3>
                        <div className="message-sub-info"><p>Icon</p><p>Message Status</p><p>Time ago</p><p>Streak</p></div>
                    </ul>
                </li>
            </ul>
        </div>
        );
    }
}

export default Messages;