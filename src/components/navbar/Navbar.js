import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './Navbar.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SlidingMenu from '../slidingMenu/SlidingMenu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Account from '../../screens/account/Account';
import '../../app/App.css';

function Navbar({ position, index, incFlipCam, close, Parenttitle, axis, hidden, GsignIn, GsignOut, userDoc }) {
	let title = "";
	let buttonDir = <KeyboardArrowDownIcon />
	if (axis == "x") {
		buttonDir = <ChevronRightIcon />
	} else if (axis == "y") {
		buttonDir = <KeyboardArrowDownIcon />
	}
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
	if (position === "fixed") {
		return (
			<>
				<ul className={"main-navbar " + (hidden ? "ghost" : "navbar-fixed")} >
					<li>
						<ul>
							<li><button onClick={close}>{buttonDir}</button></li>
						</ul>
					</li>
					<li><h1>{Parenttitle}</h1></li>
					<li>
						<ul>
							<li style={{ opacity: 0 }}><button><PersonAddIcon /></button></li>
						</ul>
					</li>
				</ul>
			</>
		)
	} else {
		return (
			<>
				<ul 
					className={"main-navbar " + (hidden ? "ghost" : "floating-navbar")}
					style={index === 1 ? styles.transparent : styles.shawdow}
				>
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
				{!hidden && (
					<>
						<SlidingMenu open={showAccount} close={toggleAccount} title="Account" axis="x">
							<Navbar position="fixed"/>
							<Account close={toggleAccount} GsignIn={GsignIn} GsignOut={GsignOut} userDoc={userDoc}/>
						</SlidingMenu>
						<SlidingMenu open={showSearch} close={toggleSearch} title="Search">
							<Navbar position="fixed"/>
							<h1>Searchs</h1>
						</SlidingMenu>
						<SlidingMenu open={showFriends} close={toggleFriends} title="Add Friends">
							<Navbar position="fixed"/>
							<h1>Add Friends</h1>
						</SlidingMenu>
						<SlidingMenu open={showExtra} close={toggleExtra} title="Extra">
							<Navbar position="fixed"/>
							<h1>Extra</h1>
						</SlidingMenu>
					</>
				)}
			</>
		)
	}
}

Navbar.propTypes = {
	position: PropTypes.string,
	hidden: PropTypes.bool,
}
Navbar.defaultProps = {
	hidden: true
}

export default Navbar;