import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Navbar from '../../components/navbar/Navbar'
import checkmark from '../../assets/images/black-checkmark.png';
import sentImg from '../../assets/images/sent-img-icon.png';
import GuestPic from '../../assets/images/guest-profile-pic.png';
import { auth, db, provider, storage } from '../../utils/Firebase';
import { v4 as uuid } from "uuid";
import './Camera.css'
import './Send.css'

let test = [];

for (var i = 0; i < 40; i++) {
  test.push(<h1>filler</h1>)
}

export default function Send({ height, width, img, close, backToCapture, userDoc, setUserDoc }) {
  const [sendList, setSendList] = useState([]);
  const [uploadComplete, setuploadComplete] = useState(false);
  const [imgURL, setimgURL] = useState(null);
  const imgId = uuid();
  const timeStamp = new Date().toLocaleString();

  const sendToFirebase = () => {
    if (userDoc['created'] === 'N/A' && userDoc['email'] === 'Guest@Guest.com') {
      changeGuestDoc();
    } else {
      console.log("Sending to fake firebase")
      // updateFriendDoc(sendList);
      // addPhotoToFireStore(imgId)
      // send(imgId)
      // updateFriendDoc(sendList);
    }
    close()
  }
  const changeGuestDoc = () => {
    let newUserDoc = userDoc;
    sendList.map((friend) => {
      if (newUserDoc['friends'][friend] !== undefined) {
        newUserDoc['friends'][friend]['last_time_stamp'] = new Date().toLocaleString();
        newUserDoc['friends'][friend]['status'] = "new";
        if (friend === userDoc['email']) {
          newUserDoc['friends'][friend]['sent'] = newUserDoc['friends'][friend]['sent'] + 1;
          newUserDoc['received'] = newUserDoc['received'] + 1;
        }
        newUserDoc['friends'][friend]['received'] = newUserDoc['friends'][friend]['received'] + 1;
        newUserDoc['friends'][friend]['snaps'].push(img);
        newUserDoc['sent'] = newUserDoc['sent'] + 1;
      }
    })
    setUserDoc(newUserDoc);
  }
  const send = (id) => {
    // Upload to Storage
    setuploadComplete(false);
    const upload = storage.ref(`posts/${id}`).putString(img, 'data_url');
    upload.on('state_changed',
      (snapshot) => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.log("Could not upload to storage");
      },
      () => {
        upload.snapshot.ref.getDownloadURL().then((downloadURL) => {
          setimgURL(downloadURL);
          setuploadComplete(true);
          addPhotoToFireStore(id);
          console.log("Uploaded to Storage");
        });
      }
    );
  }
  const addPhotoToFireStore = (id) => {
    db.collection("Photos").doc(id).set({
      image_url: imgURL,
      opened: [],
      sender: userDoc['email'],
      sent: sendList,
      time_stamp: timeStamp,
    })
      .then(() => {
        console.log("Uploaded to Firestore");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  }
  // const getAllFriends
  const updateFriendDoc = (friend) => {
    db.collection("Users").doc(friend).update({
      friends: {
        [friend]: {
          time_stamp: timeStamp
        }
      }
    })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      })
    console.log("Uploaded to friends");
  }

  const handleSendList = (e) => {
    let arr = []
    e.forEach((item) => {
      arr.push(item);
    })
    setSendList(arr);
  }

  return (
    <>
      <div className="send-screen" style={{ height: height, width: width }}>
        <Navbar />
        {/* <div className="floating-navbar main-navbar">
          <ul><li><button onClick={backToCapture}>Back</button></li></ul>
          <h1>Send</h1>
          <ul style={{ opacity: 0 }}><li><button disabled>Back</button></li></ul>
        </div> */}
        <div className="send-section" style={{ style: 'relative', maxHeight: '100%', width: '100%', overflow: 'auto' }}>
          {Object.keys(userDoc['friends']).map((key) => (
            <Receiver friend={userDoc['friends'][key]} id={key} sendList={sendList} handleSendList={handleSendList} />
          ))}
          {/* {test} */}
        </div>
        {sendList.length > 0 && (
          <div className="send-footer main-footer">
            <div style={{ width: '50%', display: 'flex', position: 'relative', overflow: 'hidden' }}>
              <h2>Selected: {sendList.length}</h2>
            </div>
            <button onClick={sendToFirebase}><b><h2>Send</h2></b><img src={sentImg} style={{ height: '1rem', marginLeft: '0.5rem', filter: 'grayscale(100%)' }} /></button>
          </div>
        )}
      </div>
    </>
  )
}

function Receiver({ friend, sendList, id, handleSendList }) {
  const [selected, setSelect] = useState(false);
  let newArr = sendList;
  let temp;

  const toggle = () => {
    if (selected === false) {
      newArr.push(id)
      handleSendList(newArr)
    } else {
      temp = newArr.filter((item) => item !== id)
      handleSendList(temp)
    }
    setSelect(!selected);
  }

  return (
    <button className="item-container" onClick={toggle}>
      <div className="row">
        <img src={friend['profile_pic_url']} className="profile-pic" />
        {selected ? <h1 style={{ color: 'rgb(31, 168, 247)' }}>{friend['name']}</h1> : <h1 style={{ color: 'black' }}>{friend['name']}</h1>}
      </div>
      <div>
        {selected ? <div className="selected-circle"><img className="checkmark" src={checkmark} alt="U+2713" ></img></div>
          : <div className="unselected-circle"><img className="checkmark" src={checkmark} alt="U+2713"></img></div>}
      </div>
    </button>
  )
}

Receiver.propTypes = {
  friend: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),
  id: PropTypes.string,
  handleSendList: PropTypes.func,
  sendList: PropTypes.array,
}
Receiver.defaultProps = {
  sendList: [],
  id: "Guest@Guest.com",
  friend: {
    "Guest@Guest.com": {
      created: new Date().toLocaleString(),
      profile_pic_url: GuestPic,
      name: "Guest",
      status: "new-friend",
      streak: 0,
      sent: 0,
      received: 0,
      last_time_stamp: null,
      snaps: []
    },
  },
};