import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './Navbar.css'

const styles = {
  shadow: {
    backgroundColor: 'white',
    boxShadow: "0 0.1rem 1rem black"
  },
  transparent: {
    backgroundColor: 'transparent',
    boxShadow: "0 0rem 0rem black"
  }
}

function FillerNavbar({title, dynamic, show, custom, type}) {
  if (show === true) {
    return (
      <ul className="main-navbar navbar-show">
      <li>
        <ul>
            {type === "Settings" ? <li><button><KeyboardArrowDownIcon onClick={custom}/></button></li> : <li><button><AccountCircleIcon onClick={custom}/></button></li>}
            {/* <li><button style={{opacity: 0}} disabled={true}><SearchIcon/></button></li> */}
        </ul>
      </li>
      <li><h1>{title}</h1></li>
      <li>
        <ul>
            <li><button><PersonAddIcon/></button></li>
            {/* <li>{dynamic}</li> */}
        </ul>
      </li>
    </ul>
    )
  } else {
    return (
      <ul className="main-navbar navbar-relative">
      <li>
        <ul>
          <li><button><AccountCircleIcon/></button></li>
          <li><button><SearchIcon/></button></li>
        </ul>
      </li>
      <li><h1>{title}</h1></li>
      <li>
        <ul>
          <li><button><PersonAddIcon/></button></li>
          <li>{dynamic}</li>
        </ul>
      </li>
    </ul>
    )
  }
}

function FloatingNavbar({title, dynamic, index, GsignOut, toggleSettings, incFlipCam, settings}) {
    if (index === 0) {
      title = "Chat";
    }
    if (index === 1) {
      dynamic = <button onClick={incFlipCam}><FlipCameraIosIcon/></button>;
    }
    if (index === 2) {
      title = "Discover";
    }
    return (
      <ul className="main-navbar floating-navbar" style={index === 1 ? styles.transparent : styles.shadow} >
          <li>
              <ul>
                  <li><button><AccountCircleIcon onClick={toggleSettings}/></button></li>
                  <li><button><SearchIcon onClick={GsignOut}/></button></li>
              </ul>
          </li>
          <li><h1>{title}</h1></li>
          <li>
              <ul>
                  <li><button><PersonAddIcon/></button></li>
                  <li>{dynamic}</li>
              </ul>
          </li>
      </ul>
    )
  }
  export {FloatingNavbar, FillerNavbar};