import React, { Component } from 'react';
import SwipeableViews from 'react-swipeable-views'
import { bindKeyboard } from 'react-swipeable-views-utils'
import './SlidingMenu.css'

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);

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
		this.close = this.close.bind(this);
	}
	updateDimensions = () => {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	};
	componentDidMount() {
		window.addEventListener('resize', this.updateDimensions);
		window.addEventListener('scroll', this.handleScroll, true);
	}
	componentDidUpdate(prevProps) {
		if (prevProps.open != this.props.open) {
			this.setState({hide: false}, () => setTimeout(() => this.changeToIndex(1), 0));
		}
	}
	changeToIndex(e) {
		this.setState({
			index: e,
		})
		this.setState({bgColor: 'transparent'});
	}
	handleScroll(e) {
		const target = e.target;
		if (target.scrollTop <= 0) {
			this.setState({ top: true })
		} else {
			this.setState({ top: false })
		}
	}
	changeOnSwitch() {
		this.setState({bgColor: 'transparent'});
	}
	close() {
		this.changeToIndex(0);
	}
	checkIndex() {
		if (this.state.index === 0) {
			this.setState({hide:true});
		}
		if (this.state.index >= 1) {
			this.setState({bgColor: 'white'});
		}
	}
	render() {
		const { height, width, index, top, hide, bgColor } = this.state;
		const { children, title } = this.props;
		return (
			<>
				{!hide && (
					<div className="sliding-menu" style={{ height: height, width: width, backgroundColor:bgColor }}>
						<BindKeyboardSwipeableViews
							containerStyle={{ height: height, width: width }}
							axis="y"
							disabled={!top}
							onSwitching={this.changeOnSwitch}
							onChangeIndex={this.changeToIndex}
							onTransitionEnd={this.checkIndex}
							index={index}
							enableMouseEvents
						>
							<div style={{ height:height, width:width }}></div>
							<div onScroll={this.handleScroll} style={{ backgroundColor: 'white', height: height, width: width }}>
								<div style={{ backgroundColor: 'lightcoral' }}>
									<ul style={{display:'flex', flexDirection:'row', justifyContent: 'space-around'}}>
										<li><button onClick={this.close} style={{borderRadius: '1rem'}}><h1>Close</h1></button></li>
										<li><h1>{title}</h1></li>
									</ul>
									{children}
								</div>
							</div>
						</BindKeyboardSwipeableViews>
					</div>
				)}
			</>
		);
	}
}

export default SlidingMenu;