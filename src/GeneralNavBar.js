import React, { Component, useState, useEffect } from 'react';
import './Messages.css';


export default function GeneralNavBar(props) {
	return (
		<>
		<div className="navbar gen">
		<div className="nav-box-1">
			<ul>
				<li>
					<a>Sign In</a>
				</li>
				<li><a>Search</a></li>
			</ul>
		</div>
		<div className="nav-box-2">
			<h1>GENERAL</h1>
		</div>
		<div className="nav-box-3">
				<ul>
					<li><a>Add Friend</a></li>
					<li><a>New Chat</a></li>
				</ul>
			</div>
		</div>
		</>
	);
}
