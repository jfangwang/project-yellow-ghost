import React, { Component } from 'react';
import './Account.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../messages/Message.css'

export default class Account extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <main className="main">
        <div className="section info">
          <h1>Me</h1>
          <div className="row">
            <img src="https://cdn3.iconfinder.com/data/icons/dashboard-ui-element/32/Dashboard_icon_design_expanded-28-512.png" />
            <h1>Name</h1>
            <i><h5>Username</h5></i>
          </div>
          <div className="row">
            <h5>Total:</h5>
            <h5>Sent:</h5>
            <h5>Received: </h5>
          </div>
        </div>
        <div className="section">
          <h1>Friends</h1>
          <div className="col">
            <h3>Friend 1</h3>
            <h3>Friend 2</h3>
            <h3>Friend 2</h3>
          </div>
        </div>
        <div className="section snapMap">
          <h1>Snap Map</h1>
          <img src="https://media.npr.org/assets/img/2017/06/30/snapchat-world_custom-7763b62a81588d5def16ef6335a573d94e0dc908.jpg"/>
        </div>
        <div className="section">
          <p>Joined Snap Chat</p>
        </div>
        <div className="section">
          <button onClick={this.props.close}><h2>Logout</h2></button>
        </div>
      </main>
    )
  }
}
