import React, {useEffect, useState} from 'react';
import { isMobile } from 'react-device-detect';
import Navbar from '../../components/navbar/Navbar';
import {auth, db, provider, storage} from '../../utils/Firebase';
import { v4 as uuid } from "uuid";
import './Camera.css';
import '../../components/navbar/Navbar.css'
import '../../components/footer/Footer.css'

export default function Send({width, height, img, close, backToCapture, userDoc, userInfo}) {
  let view;
  let selected = ["qbs1864@gmail.com"];
  const [uploadComplete, setuploadComplete] = useState(false);
  const [imgURL, setimgURL] = useState(null);
  const imgId = uuid();
  const timeStamp = new Date().toLocaleString();

  const sendToFirebase = () => {
    if (Object.keys(userInfo).length === 0) {
      changeGuestDoc();
    } else {
      updateFriendDoc(selected);
    }
    // addPhotoToStorage(imgId)
    // updateFriendDoc(selected);
    close()
  }
  const changeGuestDoc = () => {
    selected.map((friend) => {
      if (userDoc['friends'][friend] !== undefined) {
        userDoc['friends'][friend]['last_time_stamp'] = new Date().toLocaleString();
        userDoc['friends'][friend]['status'] = "new";
        userDoc['friends'][friend]['sent'] = userDoc['friends'][friend]['sent'] + 1;
        userDoc['friends'][friend]['received'] = userDoc['friends'][friend]['received'] + 1;
        userDoc['friends'][friend]['snaps'] = userDoc['friends'][friend]['snaps'].push(img);
        userDoc['sent'] = userDoc['sent'] + 1;
        userDoc['received'] = userDoc['received'] + 1;
      }
    })
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
      sender: userInfo.email,
      sent: selected,
      time_stamp: timeStamp,
    })
    .then(() => {
        console.log("Uploaded to Firestore");
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
  }
  const getAllFriends
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

  if (Object.keys(userDoc).length > 0) {
    view = (
      <div className="send-screen" style={{height: height, width: width}}>
        <Navbar />
        <div className="floating-navbar main-navbar">
          <ul><li><button onClick={backToCapture}>Go Back</button></li></ul>
          <ul></ul>
        </div>
        <div className="captured-footer main-footer">
          <ul><li></li></ul>
          <ul><li><button onClick={sendToFirebase}>SEND</button></li></ul>
        </div>
        <div>
          {Object.keys(userDoc['friends']).sort().map((key) => (
            <h1>{userDoc['friends'][key]['name']}</h1>
          ))}
        </div>
      </div>
    )
  }
  return (
    <>
      {view}
    </>
  )
}
