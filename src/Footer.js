import React from 'react'
import './Footer.css';

export default function Footer(props) {
  return (
    <>
		<div className="footer app-foot">
			<button onClick={() => props.changeToIndex(0)}>{props.index == 0 ? <h1 style={{color: "coral"}}>Messages</h1> : <h1>Messages</h1>}</button>
			<button onClick={() => props.changeToIndex(1)}>{props.index == 1 ? <h1 style={{color: "coral"}}>Camera</h1> : <h1>Camera</h1>}</button>
		</div>
		</>
  )
}
