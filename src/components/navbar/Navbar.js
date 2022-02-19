import React from 'react'
import PropTypes from 'prop-types'
import './Navbar.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

function Navbar({position, index}) {
	let title = "";
	if (index === 0) {
		title = "Chat";
	} else if (index === 3) {
		title = "Discover";
	}
	if (position === "absolute") {
		return (
			<ul className="main-navbar floating-navbar">
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
						<li><button><FlipCameraIosIcon/></button></li>
					</ul>
				</li>
			</ul>
		)
	} else {
		return (
			<ul className="main-navbar navbar-relative">
				<li><h1>{title}</h1></li>
			</ul>
		)
	}
}

Navbar.propTypes = {
	position: PropTypes.string
}

export default Navbar
