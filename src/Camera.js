import React, { Component } from 'react';
import Webcam from "react-webcam";
import { v4 as uuid } from "uuid";
import './Camera.css';
import {storage, db} from './Firebase.js';
import firebase from 'firebase/app';


class Camera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            image: null,
            screen: 'camera',

        }
        window.addEventListener("resize", this.update);
    }

    update = () => {
        this.setState({
          width: window.innerWidth,
          height: window.innerHeight,
          faceMode: "user"
        });
    };

    send = () => {
        const user = firebase.auth().currentUser;
        const id = uuid();
        var email = user.email;
        var name = user.displayName;
        var avatarURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png";
				var to_users = [email]
        if (user) {

        }
        const uploadTask = storage.ref(`posts/${id}`).putString(this.state.image, 'data_url');
          uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {
            console.log(error);
          },
          () => {
            var i = 0;
            for(i=0; i<to_users.length; i++) {
              console.log(typeof(to_users[i]), to_users[i]);
              var mailList = to_users[i];
              storage
              .ref("posts")
              .child(id)
              .getDownloadURL()
              .then(url => {
                db.collection('posts').doc(mailList).collection("Received").doc(id).set({
                  imageURL: url,
                  id: id,
                  email: email,
                  name: name,
                  avatarURL: avatarURL,
                  read: false,
                  timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                  to: to_users,
                })
								console.log("Photo Sent");
								this.setState({ image: null, screen: 'camera' })
              })
            }
            db.collection('posts').doc(email).collection("Sent").doc(id).set({
              id: id,
              email: email,
              timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
              to: to_users,
            })
          })
    }

    close = () => {
        this.setState({ image: null, screen: "camera" })
    }

    send_to = () => {
      this.setState({screen: "send_to"})
    }

    capture = () => {
        const img = this.webcam.getScreenshot();
        this.setState({ image: img, screen: "captured" })
    }

    setRef = (webcam) => {
        this.webcam = webcam;
      };

    render() {
        return (
            <>
                {/* { this.state.image ? <img src={this.state.image} alt="asdf"/> : <Webcam
                    ref={this.setRef}
                    videoConstraints={{facingMode: this.state.faceMode, width: this.state.width, height: this.state.height}}
                    screenshotFormat="image/jpeg"
                    audio={false}
                    mirrored={true}
                    className="webcam"
                />}

                { this.state.image || this.state.show_send_list ? <button className="capture" onClick={this.close}>Close</button> : <button className="capture" onClick={this.capture}>Capture</button> }
                { this.state.image? <button className="send">Send to...</button> : null }
                { this.state.show_send_list ? <button className="send" onClick={this.send}>Send</button> : null} */}
              {this.state.screen ==="camera" ? 
              <div className="cam-tab">
                <Webcam
                  ref={this.setRef}
                  videoConstraints={{facingMode: this.state.faceMode, width: this.state.width, height: this.state.height}}
                  screenshotFormat="image/jpeg"
                  audio={false}
                  mirrored={true}
                  className="webcam"
                />
                <button className="capture" onClick={this.capture}>Capture</button>
              </div> : null
              }
              {this.state.screen ==="captured" && this.state.image ? 
              <div className="cam-tab">
                <img src={this.state.image}></img>
                <button className="capture" onClick={this.send_to}>Send to</button>
                <button className="send" onClick={this.close}>Close</button>
              </div> : null
              }
              {this.state.screen ==="send_to" && this.state.image  ? 
                <div className="user-list">
                
                <button className="send" onClick={this.send}>Send</button>
                <button className="capture" onClick={this.close}>Close</button>
              </div> : null
              }
            
            </>
        );
    }
}

export default Camera;