import React, { Component, useEffect, useState, useRef } from 'react';
import Webcam from "react-webcam";
import './Camera.css';
import sent from './images/sent-vid-icon.png';
import checkmark from './images/black-checkmark.png';
import PhotoLibIcon from './images/photo-library-icon.png';
import FaceFilterIcon from './images/face-filter-icon.png';
import CloseIcon from './images/close.png';
import DownArrowIcon from './images/down-arrow-icon.png';
import CameraClick from './sound/camera-shutter-click.mp3';
import {storage, db} from './Firebase.js';
import firebase from 'firebase/app';
import { v4 as uuid } from "uuid";
import Flippy, { FrontSide, BackSide } from 'react-flippy';


function Camera(props) {
  const [ar, setar] = useState(null)
  const [img, setImg] = useState(null);
  const [mirror, setMirror] = useState(true);
  const [screen, setScreen] = useState("camera");
  const [sendList, setSendList] = useState([]);
  const bad_status_arr = ["pending", "not-friends", "blocked"];

  useEffect(() => {
    if (window.innerHeight < window.innerWidth) {
      if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
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
      if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
        setar(16/9)
      } else {
        setar(9/16)
      }
      document.getElementById("webcam").style.height = "100%";
      document.getElementById("webcam").style.width = "auto";
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
    if (props.email != "Guest@Guest.com") {
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
        if (sendList.length == count) {
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
    <div className="webcam-screen">
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
              <img className="photo-lib-icon" src={PhotoLibIcon} onClick="" />
              <button className="capture-button" onClick={capture}><audio id="capture-audio" src={CameraClick}></audio></button>
              <img className="face-filter-icon" src={FaceFilterIcon} onClick="" />
            </div>
            
            {/* <div className="footer"/> */}
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
              <img className="close" onClick={close} src={CloseIcon}></img>
            </div>
          </div>
          {img ? <img id="webcam" src={img} /> :
            <h1 style={{textAlign: "center"}}>Camera did not capture anything {"\u{1F61E}"}</h1>
          }
          <div className="footer"/>
          <div className="captured-footer">
            {img ? <button className="save">Save</button> : <button className="save" disabled>Save</button> }
            {img ? <button className="send-to" onClick={sendTo}><b>Send To</b><img className="send-to-icon" src={sent} /></button>
             : <button className="send-to" disabled><b>Send To</b><img className="send-to-icon" src={sent} /></button>
            }
          </div>
        </div>
        </>
        : null
      }

      {screen === "send" ?
        <div className="send-overlay">
          <div className="navbar">
            <img className="close-icon" src={DownArrowIcon} onClick={back}></img>
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
            <img className="friend-profile-pic" src={friends[key].profile_pic_url}/>
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
            <div className="selected-circle"><img className="checkmark" src={checkmark} alt="U+2713"></img></div>
            : <div className="unselected-circle"><img className="checkmark" src={checkmark} alt="U+2713"></img></div>
          }
        </div>
      </button>
		</>
	)
}

export {Camera, Receiver}