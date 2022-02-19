import React from 'react'
import PropTypes from 'prop-types'
import './Navbar.css'

function Navbar({position, index}) {
	let title = "";
	if (index === 0) {
		title = "Chat";
	} else if (index === 3) {
		title = "Discover";
	}
	if (position === "absolute") {
		return (
			<ul className="main-navbar floating">
				<li><h1>{title}</h1></li>
			</ul>
		)
	} else {
		return (
			<ul className="main-navbar relative">
				<li><h1>{title}</h1></li>
			</ul>
		)
	}
}

Navbar.propTypes = {
	position: PropTypes.string
}

export default Navbar
