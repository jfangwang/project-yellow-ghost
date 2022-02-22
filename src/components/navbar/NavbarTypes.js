import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
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

function FillerNavbar({title, dynamic}) {
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

function FloatingNavbar({title, dynamic, index, GsignOut, test, incFlipCam, settings}) {
    if (index === 0) {
      title = "Chat";
    }
    if (index === 1) {
      dynamic = <button onClick={incFlipCam}><FlipCameraIosIcon/></button>;
    }
    if (index === 2) {
      title = "Discover";
    }
    if (settings) {
      title = "Settings";
      // console.log(swipe);
    }
    return (
      <ul className="main-navbar floating-navbar" style={!settings ? index === 1 ? styles.transparent : styles.shadow : styles.shadow} >
          <li>
              <ul>
                  <li><button><AccountCircleIcon onClick={test}/></button></li>
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