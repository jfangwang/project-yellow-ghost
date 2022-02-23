import React, {useState} from 'react'
import PropTypes from 'prop-types'
import './Navbar.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { isMobile } from 'react-device-detect';
import Settings from '../settings/Settings';
import { lightGreen } from '@mui/material/colors';
import SwipeableViews from 'react-swipeable-views';
import { bindKeyboard } from 'react-swipeable-views-utils';
import '../../app/App.css';
import { FillerNavbar, FloatingNavbar } from './NavbarTypes';

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

function Navbar({position, index, incFlipCam, GsignIn, GsignOut, height, width, Yscroll}) {
	const toggleSettings = () => {
		setSettings(!settings)
	}
	const [settings, setSettings] = useState(false);
	let title = "";
	let dynamic = <button onClick={() => console.log("settings")}><MoreHorizIcon/></button>;
	let view = <FillerNavbar title={title} dynamic={dynamic}/>;
	// if (settings) {
	// 	title="Settings"
	// }
	if (position === "absolute") {
		view = <FloatingNavbar
		incFlipCam={incFlipCam}
		index={index}
		title={title}
		dynamic={dynamic}
		GsignOut={GsignOut}
		toggleSettings={toggleSettings}
		settings={settings}
		/>
	}
	return (
		<>
			{settings ? <Settings height={height} width={width} setSettings={setSettings} Yscroll={Yscroll}/> : null}
			{view}
		</>
	)
}

Navbar.propTypes = {
	position: PropTypes.string
}

export default Navbar;