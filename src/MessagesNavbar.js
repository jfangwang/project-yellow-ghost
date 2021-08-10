import React, { Component } from 'react';
import './Messages.css';

class MessagesNavbar extends Component {
    render() {
        return (
            <>
            <div className="navbar">
                <div className="nav-box-1">
                    <ul>
                        <li>
                            {this.state.user_name == "Guest" ?
                            <a onClick={this.login}>Sign In</a> :
                            <img class="profile-pic" src={this.state.user_pic} onClick={this.logout} alt="Profile Picture" />
                            }
                        </li>
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
            </>
        );
    }
}

export default MessagesNavbar;