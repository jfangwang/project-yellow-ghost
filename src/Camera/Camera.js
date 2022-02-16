import React, { useEffect, useState } from 'react';
import Webcam from "react-webcam";
import './Camera.css';
import sent from '../images/sent-vid-icon.png';
import checkmark from '../images/black-checkmark.png';
import PhotoLibIcon from '../images/photo-library-icon.png';
import FaceFilterIcon from '../images/face-filter-icon.png';
import CloseIcon from '../images/close.png';
import DownArrowIcon from '../images/down-arrow-icon.png';
import CameraClick from '../sound/camera-shutter-click.mp3';
import {storage, db} from '../util/Firebase.js';
import { isMobile } from 'react-device-detect';
import { v4 as uuid } from "uuid";


function Camera(props) {
  const [ar, setar] = useState(null)
  const [img, setImg] = useState(null);
  // const [mirror, setMirror] = useState(true);
  const [screen, setScreen] = useState("camera");
  const [sendList, setSendList] = useState([]);
  const bad_status_arr = ["pending", "not-friends", "blocked"];

  useEffect(() => {
    if (window.innerHeight < window.innerWidth) {
      if(isMobile) { 
        setar(9/16)
      } else {
        setar(16/9)
      }
      if (window.innerHeight/window.innerWidth <= 0.60) {
        document.getElementById("webcam").style.height = "100%";
        document.getElementById("webcam").style.width = "auto";
      } else {
        document.getElementById("webcam").style.width = "100%";
        document.getElementById("webcam").style.height = "auto";
      }
    } else {
      if(isMobile) { 
        setar(16/9)
      } else {
        setar(9/16)
      }
      if (window.innerHeight/window.innerWidth >= 1.856) {
        document.getElementById("webcam").style.width = "100%";
        document.getElementById("webcam").style.height = "auto";
      } else {
        document.getElementById("webcam").style.height = "100%";
        document.getElementById("webcam").style.width = "auto";
      }
    }
  })

  const sendTo = () => {
    setScreen("send");
    if (img === null) {
      close()
    }
  }
  const send = () => {
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
    var time_sent = new Date().toLocaleString();
    var newDict = props.friends;
    var total_sent = 0;
    var good_status = [];
    var count = 0;
    const id = uuid();
    const user_doc = db.collection("Users").doc(props.email);
    if (props.email !== "Guest@Guest.com") {
      // User is logged in

      // Update Sender's Doc: Friends -> Receiver_Name -> Status -> Sent
      // Last_Time_Stamp, Sent: +1, Total_Sent: +1
      sendList.forEach((user) => {
        count = count + 1;
        if (!bad_status_arr.includes(props.friends[user]["status"])) {
          total_sent = total_sent + 1;
          newDict[user]["status"] = "sent";
          newDict[user]["last_time_stamp"] = time_sent;
          newDict[user]["sent"] = newDict[user]["sent"] + 1;
        }
        if (sendList.length === count) {
          user_doc.update({
            total_sent: props.sent + total_sent,
            friends: newDict,
          })
        }
      })

      // Add photo id to Receiver's Doc:  Friends -> Sender_Name -> Status -> Received
      //                                  Last_Time_Stamp, Received: +1, Total_Received: +1
      sendList.forEach((user) => {
        var receiver_doc = db.collection("Users").doc(user);
        // check if receiver is friends with sender
        receiver_doc.get().then((doc) => {
          var list = doc.data();
          if (Object.keys(list["friends"]).includes(props.email) &&
              !bad_status_arr.includes(list["friends"][props.email]["status"])) {
            good_status.push(user);
            var friends_dict = list["friends"];
            friends_dict[props.email]["status"] = "new";
            friends_dict[props.email]["last_time_stamp"] = time_sent;
            friends_dict[props.email]["received"] = friends_dict[props.email]["received"] + 1;
            friends_dict[props.email]["snaps"].push(id);
            list["friends"] = friends_dict;
            receiver_doc.update({
              created: list["created"],
              friends: list["friends"],
              name: list["name"],
              pending: list["pending"],
              profile_pic_url: list["profile_pic_url"],
              streak_emoji: list["streak_emoji"],
              total_received: list["total_received"] + 1,
              total_sent: list["total_sent"],
            });
          } else if (Object.keys(list["added_me"]).includes(props.email) &&
                     !bad_status_arr.includes(list["friends"][props.email]["status"])) {
            good_status.push(user);
            var added_me_dict = list["added_me"];
            added_me_dict[props.email]["status"] = "new";
            added_me_dict[props.email]["last_time_stamp"] = time_sent;
            added_me_dict[props.email]["received"] = friends_dict[props.email]["received"] + 1;
            added_me_dict[props.email]["snaps"].push(id);
            list["added_me"] = added_me_dict;
            receiver_doc.update({
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
            console.log("Did not send it to "+user+".");
          }
        })
      })

      // // Add actual photo image to storage
      const uploadTask = storage.ref(`posts/${id}`).putString(img, 'data_url');
      // check if user will be sending to an eligible user (Not blocked, unfriended, etc)
      if (total_sent > 0) {
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
                sent: good_status,
                opened: [],
                time_stamp: time_sent,
                image_url: url,
              })
            })
          }
        )
      }
      

      setSendList([]);
      setImg(null);
    } else {
      // User is a guest

      // Update Sender's dictionary
      console.log(sendList)
      sendList.forEach((user) => {
        count = count + 1;
        if (!bad_status_arr.includes(props.friends[user]["status"])) {
          total_sent = total_sent + 1;
          newDict[user]["status"] = "sent";
          newDict[user]["last_time_stamp"] = time_sent;
          newDict[user]["sent"] = newDict[user]["sent"] + 1;
        }
      })

      // Update Receiver's Dictionary (Guest)
      if (!bad_status_arr.includes(props.friends[props.email]["status"]) && sendList.includes(props.email)) {
        newDict[props.email]["status"] = "new";
        newDict[props.email]["last_time_stamp"] = time_sent;
        newDict[props.email]["received"] = newDict[props.email]["received"] + 1;
        newDict[props.email]["snaps"].push(img)
      }
      props.setLocalDict(newDict);
      setImg(null);
      setSendList([]);
    }
  }
  const webcamRef = React.useRef(null);
  const capture = React.useCallback(
    () => {
      document.getElementById("capture-audio").play()
      // const img = webcamRef.current.getScreenshot({width:props.width, height:props.height});
      setImg(webcamRef.current.getScreenshot());
      setScreen("captured")
      props.showNavbar(false)
      props.showFooter(false)
      props.disable_swiping(true)
    },
    [webcamRef]
  );
  // const flippy = React.useRef(null);
  // const test = () => {
  //   flippy.current.toggle()
  // }
  

  return (
    <>
    <div className="webcam-screen" style={{height:window.innerHeight}}>
      {/* <div className="navbar" /> */}

      <Webcam
        id="webcam"
        ref={webcamRef}
        audio={false}
        mirrored={props.mirrored}
        forceScreenshotSourceSize={false}
        screenshotFormat="image/png"
        screenshotQuality={1}
        videoConstraints={{facingMode: props.faceMode, aspectRatio: ar}}
      />
       {/* <Flippy
          flipOnHover={false} // default false
          flipDirection="horizontal" // horizontal or vertical
          ref={flippy} // to use toggle method like this.flippy.toggle()
          // if you pass isFlipped prop component will be controlled component.
          // and other props, which will go to div
          className="image-desktop"
        >
          <FrontSide>
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
          </FrontSide>
          <BackSide className="image-desktop">
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
          </BackSide>
        </Flippy> */}

      {screen === "camera" ? 
        <div className="webcam-overlay">
          <div className="camera-nav">
            <div className="navbar"/>
          </div>
          <div className="camera-footer">
            <div className="camera-footer-buttons">
              <img className="photo-lib-icon" src={PhotoLibIcon} onClick="" alt="photo-lib-icon"/>
              <button className="capture-button" onClick={capture}><audio id="capture-audio" src={CameraClick}></audio></button>
              <img className="face-filter-icon" src={FaceFilterIcon} onClick="" alt="face-filter-icon"/>
            </div>
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
              <img className="close" onClick={close} src={CloseIcon} alt="close"></img>
            </div>
          </div>
          {img ? <img id="webcam" src={img} alt="webcam"/> :
            <h1 style={{textAlign: "center"}}>Camera did not capture anything {"\u{1F61E}"}</h1>
          }
          <div className="footer"/>
          <div className="captured-footer">
            {img ? <button className="save">Save</button> : <button className="save" disabled>Save</button> }
            {img ? <button className="send-to" onClick={sendTo}><b>Send To</b><img className="send-to-icon" src={sent} alt="send-to-icon"/></button>
             : <button className="send-to" disabled><b>Send To</b><img className="send-to-icon" src={sent} alt="send-to-icon"/></button>
            }
          </div>
        </div>
        </>
        : null
      }

      {screen === "send" ?
        <div className="send-overlay">
          <div className="navbar">
            <img className="close-icon" src={DownArrowIcon} onClick={back} alt="close-icon"></img>
            <input className="send-search" type="search" placeholder="Search"></input>
            <button>...</button>
          </div>

          <h3 className="friend-head">Recents ({Object.keys(props.friends).length})</h3>
          <ul className="friend-list-container">
            {/* <h3>List: {Object.keys(props.friends)}</h3> */}
            {Object.keys(props.friends).sort().map((key) => (
              <Receiver
                friends={props.friends}
                k={key}
                sendList={sendList}
                handle_send_list={handle_send_list}
                selected={sendList.includes(key) ? true : false}
                email={props.email}
                emoji={props.emoji}
                bad_status_arr={bad_status_arr}
              />
            ))}
          </ul>
          {sendList.length > 0 ? 
            <div className="send-footer">
              <h3 className="send-label">Send to...</h3>
              <button className="send-to" onClick={send}>Send</button>
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

  var status_dict = {
		["new-friend"]: "New Friend!",
		new: "New Snap",
		received: "Received",
		sent: "Sent",
		opened: "Opened",
		pending: "Pending",
		["not-friends"]: "Unfriended You",
		blocked: "Blocked",
	}
	var emoji_dict = {
		["not-friends"]: "\u{1F494}",
		blocked: "\u{26D4}",
		pending: "\u{23F3}"
	}
  var emoji = null;
  var status = null;
  status = status_dict[friends[key]["status"]]
  emoji = emoji_dict[friends[key]["status"]]

	return (
		<>
      <button onClick={toggleSelected} className="item-container" disabled={props.bad_status_arr.includes(friends[key]["status"])}>
        <div className="pic-info-mix">
          <div className="pic-container">
            <img className="friend-profile-pic" src={friends[key].profile_pic_url} alt="friend-profile-pic"/>
          </div>	
          <div className="friend-info">
            <h3>{friends[key].name}</h3>
            {props.bad_status_arr.includes(friends[key]["status"]) ? <h4>{emoji} {status}</h4> : null}
          </div>
        </div>
        <div className="friend-button">
            {friends[key]["streak"] === null ? null :
              <div className="streak-container">
                <h3>{friends[key].streak}</h3>
                <h3>{props.emoji}</h3>
              </div>
            }
          {added ?
            <div className="selected-circle"><img className="checkmark" src={checkmark} alt="U+2713" ></img></div>
            : <div className="unselected-circle"><img className="checkmark" src={checkmark} alt="U+2713"></img></div>
          }
        </div>
      </button>
		</>
	)
}

export {Camera, Receiver}