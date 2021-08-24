import React, { Component, useEffect, useState } from 'react';
import Webcam from "react-webcam";
import './Camera.css';
import sent from './images/sent-vid-icon.png';
import checkmark from './images/black-checkmark.png';
import {storage, db} from './Firebase.js';
import firebase from 'firebase/app';
import { v4 as uuid } from "uuid";

function Camera(props) {
  const [img, setImg] = useState(null);
  const [screen, setScreen] = useState("camera");
  const [aspectRatio, setAspectRatio] = useState(16/9);
  const [sendList, setSendList] = useState([]);

  const webcamRef = React.useRef(null);
  const capture = React.useCallback(
    () => {
      // const img = webcamRef.current.getScreenshot({width:props.width, height:props.height});
      setImg(webcamRef.current.getScreenshot());
      setScreen("captured")
      props.showNavbar(false)
      props.showFooter(false)
      props.disable_swiping(true)
    },
    [webcamRef]
  );
  const sendTo = () => {
    setScreen("send");
  }
  const send = () => {
    setImg(null);
    setScreen("camera");
    send_pic()
    props.changeToIndex(0);
    props.disable_swiping(false)
    props.showNavbar(true)
    props.showFooter(true)
  }
  const back = () => {
    setScreen("captured")
    props.showNavbar(false)
  }
  const close = () => {
    setImg(null);
    setScreen("camera");
    setSendList([])
    props.disable_swiping(false)
    props.showNavbar(true)
    props.showFooter(true)
  }
  const handle_send_list = (e) => {
    var arr = [];
    e.forEach((element) => {
      arr.push(element);
    })
    setSendList(arr)
  }

  const send_pic = () => {

    // Update Sender's Doc: Friends -> Receiver_Name -> Status -> Sent
    //                      Last_Time_Stamp, Sent: +1, Total_Sent: +1
    var time_sent = new Date().toLocaleString();
    var newDict = props.friends;
    var total_sent = 0;
    const id = uuid();
    sendList.forEach((user) => {
      total_sent = total_sent + 1;
      newDict[user]["status"] = "Sent";
      newDict[user]["last_time_stamp"] = time_sent;
      newDict[user]["sent"] = props.sent + 1;
    })

    const user_doc = db.collection("Users").doc(props.email);
    user_doc.update({
      total_sent: props.sent + total_sent,
      friends: newDict,
    })
    

    

    // // Add actual photo image to storage
    const uploadTask = storage.ref(`posts/${id}`).putString(img, 'data_url');
    uploadTask.on(
      "state_changed",
      snapshot => {},
      error => {
        console.log(error);
      },
      () => {
        storage.ref(`posts/${id}`).getDownloadURL().then(url => {
          // Add a photo doc containing: id, sender, sent, opened, time_stamp
          db.collection("Photos").doc(id).set({
            sender: props.email,
            sent: sendList,
            opened: [],
            time_stamp: time_sent,
            image_url: url,
          })
        })
      })

    
    // Add photo id to Receiver's Doc:  Friends -> Sender_Name -> Status -> Received
    //                                  Last_Time_Stamp, Received: +1, Total_Received: +1
    sendList.forEach((user) => {
      var receiver_doc = db.collection("Users").doc(user);
      // check if receiver is friends with sender
      receiver_doc.get().then((doc) => {
        var list = doc.data();
        if (Object.keys(list["friends"]).includes(props.email)){
          var friends_dict = list["friends"];
          friends_dict[props.email]["status"] = "new";
          friends_dict[props.email]["last_time_stamp"] = time_sent;
          friends_dict[props.email]["received"] = friends_dict[props.email]["received"] + 1;
          friends_dict[props.email]["snaps"].push(id);
          list["friends"] = friends_dict;
          receiver_doc.set({
            created: list["created"],
            friends: list["friends"],
            name: list["name"],
            pending: list["pending"],
            profile_pic_url: list["profile_pic_url"],
            streak_emoji: list["streak_emoji"],
            total_received: list["total_received"] + 1,
            total_sent: list["total_sent"],
          });
        } else if (Object.keys(list["pending"]).includes(props.email)) {
          var pending_dict = list["pending"];
          pending_dict[props.email]["status"] = "new";
          pending_dict[props.email]["last_time_stamp"] = time_sent;
          pending_dict[props.email]["received"] = friends_dict[props.email]["received"] + 1;
          pending_dict[props.email]["snaps"].push(id);
          list["pending"] = pending_dict;
          receiver_doc.set({
            created: list["created"],
            friends: list["friends"],
            name: list["name"],
            pending: list["pending"],
            profile_pic_url: list["profile_pic_url"],
            streak_emoji: list["streak_emoji"],
            total_received: list["total_received"] + 1,
            total_sent: list["total_sent"],
          });
        } else {
          console.log("Not a friend, skipping "+user+".");
        }
      })
    })


    setSendList([]);
  }

  return (
    <>
    <div className="webcam-screen">
      <div className="navbar" />

      <Webcam
        id="webcam"
        className="image-desktop"
        ref={webcamRef}
        audio={false}
        mirrored={true}
        forceScreenshotSourceSize={false}
        screenshotFormat="image/png"
        screenshotQuality={1}
        videoConstraints={{facingMode: props.faceMode}}
      />

      {screen === "camera" ? 
        <div className="webcam-overlay">
          <div className="camera-nav">
            <div className="navbar"/>
          </div>
          <div className="camera-footer">
            <button onClick={capture}>Capture</button>
            <div className="footer"/>
            <div className="footer"/>
          </div>
        </div>
        : null
      }

      {screen === "captured" ?
        <>
        <div className="captured-overlay">
          <div className="camera-nav">
            <div className="navbar">
              <button className="close" onClick={close}>Close</button>
            </div>
          </div>
          <img className="image-desktop" src={img} />
          <div className="captured-footer">
            <button className="save">Save</button>
            <button className="send-to" onClick={sendTo}><b>Send To</b><img className="send-to-icon" src={sent} /></button>
          </div>
        </div>
        </>
        : null
      }

      {screen === "send" ?
        <div className="send-overlay">
          <div className="navbar">
            <button className="back" onClick={back}>Back</button>
            <input className="send-search" type="search"></input>
            <button>...</button>
          </div>

          <h1>Recents ({Object.keys(props.friends).length})</h1>
          <ul className="list-container send-list">
            {/* <h3>List: {Object.keys(props.friends)}</h3> */}
            {Object.keys(props.friends).sort().map((key) => (
              <Receiver
                friends={props.friends}
                k={key}
                sendList={sendList}
                handle_send_list={handle_send_list}
                selected={sendList.includes(key) ? true : false}
              />
            ))}
          </ul>
          {sendList.length > 0 ? 
            <div className="send-footer">
              <h3 className="send-label">Send to...</h3>
              <button className="send-to " onClick={send}>Send</button>
            </div>
            : null
          }
        </div>
        : null
      }
        <div className="footer"/>
    </div>
    </>
  );
}

function Receiver(props) {
  const [added, setAdded] = useState(props.selected);
	var friends = props.friends;
	var key = props.k;
  var newArr = props.sendList;

  const toggleSelected = () => {
    
    if (!added) {
      newArr.push(key);
      props.handle_send_list(newArr);
    } else {
      newArr.splice(newArr.indexOf(key), 1);
      props.handle_send_list(newArr);
    }
    setAdded(!added);
  }

	return (
		<>
			<button onClick={toggleSelected} className="item-container">
				<div className="pic-container">
					<img className="friend-profile-pic" src={friends[key].profile_pic_url}/>
				</div>	
				<div className="friend-info">
					<h2>{friends[key].name}</h2>
					<p>{key}</p>
				</div>
				<div className="friend-button">
          {added ?
            <div className="selected-circle"><img className="checkmark" src={checkmark} alt="U+2713"></img></div>
            : <div className="unselected-circle"><img className="checkmark" src={checkmark} alt="U+2713"></img></div>
          }
				</div>
			</button>
		</>
	)
}

export {Camera, Receiver}