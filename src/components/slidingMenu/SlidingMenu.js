import React, { Component } from 'react';
import SwipeableViews from 'react-swipeable-views'
import { bindKeyboard } from 'react-swipeable-views-utils'
import Navbar from '../navbar/Navbar';
import PropTypes from 'prop-types';
import './SlidingMenu.css'

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);
let list = [];
for (var i = 0; i < 200; i++) {
	list.push(<h1>filler</h1>)
}

class SlidingMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			height: window.innerHeight,
			width: window.innerWidth,
			index: 0,
			top: true,
			bgColor: 'transparent',
			hide: true
		}
		this.updateDimensions = this.updateDimensions.bind(this);
		this.changeToIndex = this.changeToIndex.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.changeOnSwitch = this.changeOnSwitch.bind(this);
		this.checkIndex = this.checkIndex.bind(this);
		this.closeMenu = this.closeMenu.bind(this);
	}
	updateDimensions = () => {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	};
	componentDidMount() {
		window.addEventListener('resize', this.updateDimensions);
		window.addEventListener('scroll', this.handleScroll, true);
	}
	componentDidUpdate(prevProps) {
		if (prevProps.open !== this.props.open) {
			if (this.props.open === true) {
				this.setState({ hide: false }, () => setTimeout(() => this.changeToIndex(1), 0));
				this.setState({ top: true })
			}
			if (this.props.open === false) {
				this.changeToIndex(0);
			}
		}
	}
	changeToIndex(e) {
		this.setState({
			index: e,
		})
		this.setState({ bgColor: 'transparent' });
	}
	handleScroll(e) {
		const target = e.target;
		if (this.props.axis === 'y') {
			if (target.scrollTop <= 0) {
				this.setState({ top: true })
			} else {
				this.setState({ top: false })
			}
		}
	}
	changeOnSwitch() {
		this.setState({ bgColor: 'transparent' });
	}
	closeMenu() {
		this.changeToIndex(0);
	}
	checkIndex() {
		if (this.state.index === 0) {
			this.setState({ hide: true });
			if (this.props.open === true) {
				this.props.close();
			}
		}
		if (this.state.index >= 1) {
			this.setState({ bgColor: 'white' });
		}
	}
	render() {
		const { height, width, index, top, hide, bgColor } = this.state;
		const { children, title, axis, disabled } = this.props;

		let view = <>
			{!hide &&
				(
					<div className="sliding-menu" style={{ height: height, width: width, backgroundColor: bgColor }}>
						<BindKeyboardSwipeableViews
							containerStyle={{ height: height, width: width }}
							axis={axis}
							disabled={!top || disabled}
							onSwitching={this.changeOnSwitch}
							onChangeIndex={this.changeToIndex}
							onTransitionEnd={this.checkIndex}
							index={index}
							enableMouseEvents
						>
							<div style={{ height: height, width: width }}></div>
							<div onScroll={this.handleScroll} style={{ backgroundColor: 'white', height: height, width: width }}>
								<div style={{ backgroundColor: 'white' }}>
									<Navbar position="fixed" hidden={false} Parenttitle={title} close={this.closeMenu} axis={axis} />
									{children}
									{/* {list} */}
								</div>
							</div>
						</BindKeyboardSwipeableViews>
					</div>
				)
			}
		</>
		let view2 = <>
		{!hide &&
			(
				<div className="sliding-menu" style={{ height: height, width: width, backgroundColor: bgColor }}>
					<SwipeableViews
						containerStyle={{ height: height, width: width }}
						axis={axis}
						disabled={!top || disabled}
						onSwitching={this.changeOnSwitch}
						onChangeIndex={this.changeToIndex}
						onTransitionEnd={this.checkIndex}
						index={index}
						enableMouseEvents
					>
						<div style={{ height: height, width: width }}></div>
						<div onScroll={this.handleScroll} style={{ backgroundColor: 'white', height: height, width: width }}>
							<div style={{ backgroundColor: 'white' }}>
								<Navbar position="fixed" hidden={false} Parenttitle={title} close={this.closeMenu} axis={axis} />
								{children}
								{/* {list} */}
							</div>
						</div>
					</SwipeableViews>
				</div>
			)
		}
	</>
		return (
			<>
				{view2}
			</>
		);
	}
}

SlidingMenu.propTypes = {
	title: PropTypes.string,
	open: PropTypes.bool,
	axis: PropTypes.string,
	disabled: PropTypes.bool,
	keyboard: PropTypes.bool,
}
SlidingMenu.defaultProps = {
	title: "",
	axis: 'y',
	disabled: false,
	keyboard: true
}

export default SlidingMenu;