import React, { Component } from 'react';
import './Messages.css';

class MessagesNavbar extends Component {
    render() {
        return (
            <div className="navbar">
                <div className="nav-box-1">
                    <ul>
                        <li><a>Avatar</a></li>
                        <li><a>Search</a></li>
                    </ul>
                </div>
                <div className="nav-box-2">
                    <h1>Chat</h1>
                </div>
                <div className="nav-box-3">
                    <ul>
                        <li><a>Add Friend</a></li>
                        <li><a>New Chat</a></li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default MessagesNavbar;