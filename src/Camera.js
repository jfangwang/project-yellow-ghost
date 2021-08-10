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
            image: null
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
              var name = to_users[i];
              storage
              .ref("posts")
              .child(id)
              .getDownloadURL()
              .then(url => {
                db.collection('posts').doc(name).collection("Received").doc(id).set({
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
								this.setState({ image: null })
              })
            }
          })
    }

    close = () => {
        this.setState({ image: null })
    }

    capture = () => {
        const img = this.webcam.getScreenshot();
        this.setState({ image: img })
    }

    setRef = (webcam) => {
        this.webcam = webcam;
      };

    render() {
        return (
            <div className="cam-tab">
                { this.state.image ? <img src={this.state.image} alt="asdf"/> : <Webcam
                    ref={this.setRef}
                    videoConstraints={{facingMode: this.state.faceMode, width: this.state.width, height: this.state.height}}
                    screenshotFormat="image/jpeg"
                    audio={false}
                    mirrored={true}
                    className="webcam"
                />}
                { this.state.image ? <button className="capture" onClick={this.close}>Close</button> : <button className="capture" onClick={this.capture}>Capture</button> }
                { this.state.image ? <button className="send" onClick={this.send}>Send</button> : null}
            </div>
        );
    }
}

export default Camera;