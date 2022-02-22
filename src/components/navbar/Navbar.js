import React from 'react'
import PropTypes from 'prop-types'
import './Navbar.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { isMobile } from 'react-device-detect';


function Navbar({position, index, incFlipCam, GsignIn, GsignOut}) {
	let title = "";
	let dynamic = <button onClick={() => console.log("settings")}><MoreHorizIcon/></button>;
	const styles = {
		shawdow: {
			backgroundColor: 'white',
			boxShadow: "0 0.1rem 1rem black"
		},
		transparent: {
			backgroundColor: 'transparent',
			boxShadow: "0 0rem 0rem black"
		}
	}
	if (index === 0) {
		title = "Chat";
	}
	if (index === 1) {
		dynamic = <button onClick={incFlipCam}><FlipCameraIosIcon/></button>;
	}
	if (index === 2) {
		title = "Discover";
	}
	if (position === "absolute") {
		return (
			<ul className="main-navbar floating-navbar" style={index === 1 ? styles.transparent : styles.shawdow} >
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

Navbar.propTypes = {
	position: PropTypes.string
}

export default Navbar;