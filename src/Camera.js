import React, { Component, useState } from 'react';
import Webcam from "react-webcam";
import { v4 as uuid } from "uuid";
import './Camera.css';
import {storage, db} from './Firebase.js';
import firebase from 'firebase/app';
import CameraNavbar from './CameraNavbar';


export default function Camera(props) {

    const [image, setImage] = useState(null);
    const [faceMode, setFaceMode] = useState("user");
    const [screen, setScreen] = useState("camera");

    const send = () => {
        const user = firebase.auth().currentUser;
        const id = uuid();
        var email = user.email;
        var name = user.displayName;
        var avatarURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png";
				var to_users = [email]
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

    const close = () => {
        this.setState({ image: null, screen: "camera" })
        setImage(null);
        setScreen("camera");
    }

    const send_to = () => {
      this.setState({screen: "send_to"})
    }

    const capture = () => {
        const img = this.webcam.getScreenshot({width: props.width, height: props.height});
        this.setState({ image: img, screen: "captured" })
    }

    // const setRef = (webcam) => {
    //     this.webcam = webcam;
    //   };

    return (
      <>
      <div className="webcam-screen">
      <Webcam

        className="webcam"
        // ref={setRef}
        audio={false}
        mirrored={true}
        // imageSmoothing={true}
        screenshotFormat="image/png"
        screenshotQuality={1}
        videoConstraints={{facingMode: faceMode}}
      />
        <div className="webcam-overlay">
          <CameraNavbar login={props.login} user_name={props.user_name} user_pic={props.user_pic} logout={props.logout} />
          <div className="webcam-footer">
            <div className="nav-box-1">
              <ul>
                <li><a>Memories</a></li>
                <li><a>Capture</a></li>
                <li><a>Filters</a></li>
              </ul>
            </div>
          </div>

        </div>
      </div>


        {/* {this.state.screen ==="camera" ?
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
        } */}

      </>
    );
}
