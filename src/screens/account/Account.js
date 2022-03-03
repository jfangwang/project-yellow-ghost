import React, { Component } from 'react';
import './Account.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../messages/Message.css'

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.signOut = this.signOut.bind(this);
    this.signIn = this.signIn.bind(this);
  }
  signOut() {
    this.props.GsignOut();
    this.props.close();
  }
  signIn() {
    this.props.GsignIn();
    this.props.close();
  }
  render() {
    const { userDoc } = this.props

    return (
      <main className="main">
        <div className="section info">
          <h1>Me</h1>
          <div className="row">
            <img src="https://cdn3.iconfinder.com/data/icons/dashboard-ui-element/32/Dashboard_icon_design_expanded-28-512.png" />
            <h1>{userDoc.name}</h1>
            <i><h5>{userDoc.username}</h5></i>
          </div>
          <div className="row">
            <h5>Total: {userDoc.sent + userDoc.received}</h5>
            <h5>Sent: {userDoc.sent}</h5>
            <h5>Received: {userDoc.received}</h5>
          </div>
        </div>
        <div className="section">
          <h1>Friends</h1>
          <div className="col">
            {Object.keys(userDoc.friends).sort().map((key) => (
              <h3>{userDoc.friends[key]['name']}</h3>
            ))}
          </div>
        </div>
        <div className="section snapMap">
          <h1>Snap Map</h1>
          <img src="https://media.npr.org/assets/img/2017/06/30/snapchat-world_custom-7763b62a81588d5def16ef6335a573d94e0dc908.jpg" />
        </div>
        <div className="section">
          {userDoc.created !== 'N/A' && <h3>Joined Snapchat Clone on {userDoc.created}</h3>}
        </div>
        <div className="section">
          {userDoc['name'] === 'Guest' ?
            <button onClick={this.signIn}><h2>Login</h2></button>
            :
            <button onClick={this.signOut}><h2>Logout</h2></button>
          }
        </div>
      </main>
    )
  }
}
