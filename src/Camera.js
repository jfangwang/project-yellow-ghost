import React, { Component, useEffect, useState } from 'react';
import Webcam from "react-webcam";
import { v4 as uuid } from "uuid";
import './Camera.css';
import {SendFriends, Friends, Strangers, Everyone} from './Friends.js';
import {storage, db} from './Firebase.js';
import firebase from 'firebase/app';
import CameraNavbar from './CameraNavbar';

export default function Camera(props) {

    const [send_list, setSend_list] = useState([])
    const [image, setImage] = useState(null);
    const [faceMode, setFaceMode] = useState("user");
    const [screen, setScreen] = useState("camera");
    const webcamRef = React.useRef(null);
    const [aspectRatio, setAspectRatio] = useState(16/9);
    const [show_friends, setShow_Friends] = useState(false);

    const send = () => {
        setImage(null);
        setScreen('camera');
        const user = firebase.auth().currentUser;
        const id = uuid();
        var email = user.email;
        var name = user.displayName;
        var avatarURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png";
				var to_users = send_list;
        const uploadTask = storage.ref(`posts/${id}`).putString(image, 'data_url');
          uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {
            console.log(error);
          },
          () => {
            storage
            .ref("posts")
            .child(id)
            .getDownloadURL()
            .then(url => {
              var time_sent = firebase.firestore.FieldValue.serverTimestamp();
              to_users.forEach(user_temp => {
                // Adding images to selected users
                db.collection('posts').doc(user_temp).collection("Received").doc(email).collection("images").doc(id).set({
                  imageURL: url,
                  id: id,
                  email: email,
                  name: name,
                  photoURL: avatarURL,
                  timeStamp: time_sent,
                })
              })
              // Update selected user's latest messages
              to_users.forEach(user_temp => {
                db.collection('posts').doc(user_temp).collection("Latest_Messages").doc(email).update({
                  imageURL: url,
                  photoURL: avatarURL,
                  id: id,
                  email: email,
                  name: name,
                  timeStamp: time_sent,
                  status: "New Snap",
                })
              })
              // Add an image doc to sender's sent foler to keep track of selected users
              db.collection('posts').doc(email).collection("Sent").doc(id).set({
                id: id,
                email: email,
                timeStamp: time_sent,
                to: to_users,
              })
              // Update sender's latest messages for selected users
              to_users.forEach(user_temp => {
                if (user_temp != email) {
                  db.collection('posts').doc(email).collection("Latest_Messages").doc(user_temp).update({
                    imageURL: url,
                    photoURL: avatarURL,
                    id: id,
                    timeStamp: time_sent,
                    status: "Sent",
                  })
                }
               
              })
              props.get_messages_list();

            })
          })
          console.log("Photo Sent");
          setSend_list([]);
    }

    const close = () => {
        setImage(null);
        setScreen("camera");
    }

    const send_to = () => {
      setScreen("send_to");
      setSend_list([]);
    }

    const go_back = () => {
      setScreen("captured");
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

    const show_friends_button = () => {
      props.get_friends_list();
      setShow_Friends(true);
    }

    const hide_friends_button = ()=> {
      props.get_friends_list();
      setShow_Friends(false);
    }

    const handle_send_list = (e) => {
      var arr = [];
      e.forEach((element) => {
        arr.push(element);
      })
      setSend_list(arr)
      console.log(arr);
    }

    useEffect(() => {
      if (props.mobile) {
        // document.querySelector("#imageElement").classList.add("image-mobile");
        // document.querySelector("#imageElement").classList.remove("image-desktop");
        setAspectRatio(9/16);
        // if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        //   setAspectRatio(16/9);
        // } else {
        //   setAspectRatio(9/16);
        // }

      } else {
        // document.querySelector("#imageElement").classList.add("image-desktop");
        // document.querySelector("#imageElement").classList.remove("image-mobile");
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
      <div className="webcam-screen">
      <Webcam
          id="imageElement"
          className="image-desktop"
          ref={webcamRef}
          audio={false}
          mirrored={true}
          forceScreenshotSourceSize={false}
          screenshotFormat="image/png"
          screenshotQuality={1}
          videoConstraints={{facingMode: faceMode}}
          // videoConstraints={{facingMode: faceMode, aspectRatio: aspectRatio}}
        />
      { screen ==="camera" ?
        
        <div className="webcam-overlay">
          <div className="navbar">
          <div className="nav-box-2">
            <h1>Chat</h1>
          </div>
          </div>

          <div className="webcam-footer">
            <div className="nav-box-1">
              <ul>
                <li><a>Memories</a></li>
                <li><a onClick={capture}>Capture</a></li>
                <li><a>Filters</a></li>
                {/* <li><a>{props.height} x {props.width}</a></li> */}
              </ul>
            </div>
          </div>
        </div>
      
      :
      null
      }
      {screen ==="captured" && image ?
      <div className="captured-overlay">
        <div className="image-preview"><img id="imageElement" className="image-desktop" src={image}></img></div>
        <div className="buttons-overlay">
          <div className="captured-header">
            <div className="header-left">
              <ul>
                <li><button className="send" onClick={close}>Close</button></li>
              </ul>
            </div>
            <div className="header-right">
              <ul>
                <li><button>Text</button></li>
                <li><button>Draw</button></li>
                <li><button>Crop</button></li>
                <li><button>Time</button></li>
              </ul>
            </div>
          </div>
          <div className="captured-footer">
            <div className="footer-left">
              <ul>
                <li><button>Save</button></li>
              </ul>
            </div>
            <div className="footer-right">
              <ul>
                <li><button className="capture" onClick={send_to}>Send to</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      :
      null
      }
      {screen ==="send_to" && image  ?
      // <div className="send_to-overlay">
      //   <div className="buttons-overlay">
      //     <div className="send_to-header">
      //       <div className="header-left">
      //         <ul>
      //           <li><button className="capture" onClick={go_back}>Go Back</button></li>
      //         </ul>
      //       </div>
      //       <div className="header-right">
      //         <ul>
      //           <li><button>Add Friend</button></li>
      //         </ul>
      //       </div>
      //     </div>
      //   </div>
      // </div>

      <>
      { !show_friends ? 
      <div className="send_to-overlay">
        <div className="send_to-header">
          <ul>
            <li><button onClick={go_back}>Go Back</button></li>
            <li><a>Search</a></li>
            <li><a onClick={show_friends_button}>Add Friend</a></li>
          </ul>
        </div>
        <div className="send-list">
          {/* <div className="stories-header"><h3>Stories</h3></div>
          <ul className="selection-list list-container">
            <li>My Story</li>
          </ul>
          <div className="stories-header"><h3>Best Friends</h3></div>
          <ul className="add-list list-container">
          </ul> */}
          <div className="stories-header"><h3>Recents</h3></div>
          <ul className="add-list list-container">
            {props.user_friends_dict.map((x) => (
              <SendFriends
                send_list={send_list}
                handle_send_list={handle_send_list}
                friend_pic={x.photoURL} 
                friend_name={x.name} 
                friend_username={x.email} 
                friends_list={props.friends_list}
                user_email={props.user_email}  
                get_friends_list={props.get_friends_list}
              />))
            }
          </ul>
        </div>
        {send_list.length <= 0 ? null: 
        <div className="send_to-footer">
          <div></div>
          <button className="send" onClick={send}><h1>Send</h1></button>
        </div>
        }
      </div>
      : null}
      { show_friends && props.user_strangers_dict != null &&
      props.user_friends_dict != null && props.everyone_dict != null ?
      <div className="add-friends">
        <div className="add-navbar">
          <div className="nav-box-1"><ul><li><a onClick={hide_friends_button}><b>Close</b></a></li></ul></div>
          <div className="nav-box-2"><h1>Add Friends</h1></div>
          <div className="nav-box-3"><ul><li><a><b>. . .</b></a></li></ul></div>
        </div>
        <div className="add-body">
          <div className="search-bar"><input type="search" placeholder="Find Friends"></input></div>
          <div className="add-title-navbar"><h3 className="quick-add">Quick Add ({props.user_strangers_dict.length})</h3></div>
          <ul className="add-list list-container">
          {props.user_strangers_dict.map((x) => (
            <Strangers 
              stranger_pic={x.photoURL} 
              stranger_name={x.name}
              stranger_username={x.email}
              friend_username={x.email}
              friends_list={props.friends_list} 
              user_email={props.user_email}
              get_friends_list={props.get_friends_list}
            />))
          }
          </ul>
          <div className="add-title-navbar"><h3 className="quick-add">Friends ({props.user_friends_dict.length})</h3></div>
          <ul className="add-list list-container">
          {props.user_friends_dict.map((x) => (
            <Friends 
              friend_pic={x.photoURL} 
              friend_name={x.name} 
              friend_username={x.email} 
              friends_list={props.friends_list}
              user_email={props.user_email}  
              get_friends_list={props.get_friends_list}
            />))
          }
          </ul>
          <div className="add-title-navbar"><h3 className="quick-add">Everyone ({props.everyone_dict.length})</h3></div>
          <ul className="add-list list-container">
          {props.everyone_dict.map((x) => (
            <Everyone stranger_pic={x.photoURL}
              stranger_name={x.name} 
              stranger_username={x.email} 
            />))}
          </ul>
          <div className="add-footer">

          </div>
        </div>
      </div>
      : null}
      </>
      :
      null
      }
      </div>
      </>
    );
}
