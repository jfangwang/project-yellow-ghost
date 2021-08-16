import React, { Component, useEffect, useState } from 'react';
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
    const webcamRef = React.useRef(null);
    const [aspectRatio, setAspectRatio] = useState(16/9);

    const send = () => {
        const user = firebase.auth().currentUser;
        const id = uuid();
        var email = user.email;
        var name = user.displayName;
        var avatarURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png";
				var to_users = [email]
        const uploadTask = storage.ref(`posts/${id}`).putString(image, 'data_url');
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
                setImage(null);
                setScreen('camera');
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
        setImage(null);
        setScreen("camera");
    }

    const send_to = () => {
      setScreen("send_to")
    }

    const capture = React.useCallback(
      () => {
        // const img = webcamRef.current.getScreenshot({width:props.width, height:props.height});
        const img = webcamRef.current.getScreenshot();
        setImage(img);
        setScreen("captured");
      },
      [webcamRef]
    );

    useEffect(() => {
      if (props.mobile) {
        document.querySelector("#imageElement").classList.add("image-mobile");
        document.querySelector("#imageElement").classList.remove("image-desktop");
        setAspectRatio(9/16);
        // if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        //   setAspectRatio(16/9);
        // } else {
        //   setAspectRatio(9/16);
        // }

      } else {
        document.querySelector("#imageElement").classList.add("image-desktop");
        document.querySelector("#imageElement").classList.remove("image-mobile");
        setAspectRatio(16/9);
        // if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        //   setAspectRatio(9/16);
        // } else {
        //   setAspectRatio(16/9);
        // }
      }
    })



    return (
      <>
      { screen ==="camera" ?
      <div className="webcam-screen">
      <Webcam
        id="imageElement"
        className=""
        ref={webcamRef}
        audio={false}
        mirrored={true}
        forceScreenshotSourceSize={false}
        screenshotFormat="image/png"
        screenshotQuality={1}
        videoConstraints={{facingMode: faceMode, aspectRatio: aspectRatio}}
      />
        <div className="webcam-overlay">
          <CameraNavbar
            user_email={props.user_email}
            user_name={props.user_name}
            user_pic={props.user_pic}
            login={props.login}
            logout={props.logout}
            user_friends_dict={props.user_friends_dict}
            user_strangers_dict={props.user_strangers_dict}
            everyone_dict={props.everyone_dict}
            get_friends_list={props.get_friends_list}
            get_all_users={props.get_all_users}
            friends_list={props.friends_list}
            logged_in={props.logged_in}
          />

          <div className="webcam-footer">
            <div className="nav-box-1">
              <ul>
                <li><a>Memories</a></li>
                <li><a onClick={capture}>Capture</a></li>
                <li><a>Filters</a></li>
                <li><a>{props.height} x {props.width}</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      :
      null
      }
      {screen ==="captured" && image ?
      <div className="webcam-overlay">
        <div className="image-preview"><img id="imageElement" className="" src={image}></img></div>
        <div className="buttons-overlay">
          <div className="webcam-footer">
            <button className="capture" onClick={send_to}>Send to</button>
            <button className="send" onClick={close}>Close</button>
          </div>
        </div>
      </div>
      :
      null
      }
      {screen ==="send_to" && image  ?
      <div className="webcam-overlay">
        <div className="buttons-overlay">
        <div className="webcam-footer">
          <button className="send" onClick={send}>Send</button>
          <button className="capture" onClick={close}>Close</button>
        </div>
        </div>
      </div>
      :
      null
      }
      </>
    );
}
