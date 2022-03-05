import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Navbar from '../../components/navbar/Navbar'
import checkmark from '../../assets/images/black-checkmark.png';
import sentImg from '../../assets/images/sent-img-icon.png';
import './Camera.css'
import './Send.css'

export default function Send({ height, width, img, close, backToCapture, userDoc }) {
  const [sendList, setSendList] = useState([]);
  let arr;

  const handleSendList = (e) => {
    arr = []
    e.forEach((item) => {
      arr.push(item);
    })
    setSendList(arr);
  }

  return (
    <>
      <div className="send-screen" style={{ height: height, width: width }}>
        <Navbar />
        <div className="floating-navbar main-navbar">
          <ul><li><button onClick={backToCapture}>Back</button></li></ul>
          <h1>Send</h1>
          <ul style={{ opacity: 0 }}><li><button disabled>Back</button></li></ul>
        </div>
        {sendList.length > 0 && (
          <div className="send-footer main-footer">
            <button style={{opacity: 0}} disabled>Save</button>
            <button onClick={close}><b>Send</b><img src={sentImg} style={{height:'1rem', marginLeft:'0.5rem', filter: 'grayscale(100%)' }}/></button>
          </div>
        )}
        <div className="send-section">
          {Object.keys(userDoc['friends']).map((key) => (
            <Receiver friend={userDoc['friends'][key]} id={key} sendList={sendList} handleSendList={handleSendList} />
          ))}
        </div>
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
        <h1>{friend['name']}</h1>
      </div>
      <div>
        {selected ? <div className="selected-circle"><img className="checkmark" src={checkmark} alt="U+2713" ></img></div>
          : <div className="unselected-circle"><img className="checkmark" src={checkmark} alt="U+2713"></img></div>}
      </div>
    </button>
  )
}
