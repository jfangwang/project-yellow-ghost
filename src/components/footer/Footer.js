import React from 'react'
import './Footer.css'

export default function Footer({index}) {
    let chat = <li>Chat</li>
    let camera = <li>Camera</li>
    let discover = <li>Discover</li>
    if (index === 0) {
        chat = <li><b>Chat</b></li>
    }else if (index === 1) {
        camera = <li><b>Camera</b></li>
    } else if (index === 2) {
        discover = <li><b>Discover</b></li>
    }
  return (
    <ul className="main-footer floating-bottom">
        {chat}
        {camera}
        {discover}
    </ul>
  )
}
