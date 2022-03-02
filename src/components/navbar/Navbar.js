import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './Navbar.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { isMobile } from 'react-device-detect';
import SlidingMenu from '../slidingMenu/SlidingMenu';


function Navbar({ position, index, incFlipCam }) {
	let title = "";
	const [showAccount, setAccount] = useState(false)
	const [showFriends, setFriends] = useState(false)
	const [showSearch, setSearch] = useState(false)
	const [showExtra, setExtra] = useState(false)
	const toggleExtra = () => {
		setExtra(!showExtra);
	}
	let dynamic = <button onClick={toggleExtra}><MoreHorizIcon /></button>;
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
		dynamic = <button onClick={incFlipCam}><FlipCameraIosIcon /></button>;
	}
	if (index === 2) {
		title = "Discover";
	}
	const toggleAccount = () => {
		setAccount(!showAccount);
	}
	const toggleFriends = () => {
		setFriends(!showFriends);
	}
	const toggleSearch = () => {
		setSearch(!showSearch);
	}
	if (position === "absolute") {
		return (
			<>
				<ul className="main-navbar floating-navbar" style={index === 1 ? styles.transparent : styles.shawdow} >
					<li>
						<ul>
							<li><button onClick={toggleAccount}><AccountCircleIcon /></button></li>
							<li><button onClick={toggleSearch}><SearchIcon /></button></li>
						</ul>
					</li>
					<li><h1>{title}</h1></li>
					<li>
						<ul>
							<li><button onClick={toggleFriends}><PersonAddIcon /></button></li>
							<li>{dynamic}</li>
						</ul>
					</li>
				</ul>
				<SlidingMenu open={showAccount} title="Account">
					<h1>Account</h1>
				</SlidingMenu>
				<SlidingMenu open={showSearch} title="Search">
					<h1>Searchs</h1>
				</SlidingMenu>
				<SlidingMenu open={showFriends} title="Friends">
					<h1>Friends</h1>
				</SlidingMenu>
				<SlidingMenu open={showExtra} title="Extra">
					<h1>Extra</h1>
				</SlidingMenu>
			</>
		)
	} else {
		return (
			<ul className="main-navbar navbar-relative">
				<li>
					<ul>
						<li><button><AccountCircleIcon /></button></li>
						<li><button><SearchIcon /></button></li>
					</ul>
				</li>
				<li><h1>{title}</h1></li>
				<li>
					<ul>
						<li><button><PersonAddIcon /></button></li>
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