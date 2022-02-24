import React from 'react'
import './Footer.css'
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import GroupIcon from '@mui/icons-material/Group';

export default function Footer({index, changeToIndex, type}) {
  let footer;
  if (type === "relative") {
    footer = (<ul className="main-footer relative-footer">
    <li>{index === 0 ? <button disabled onClick={() => changeToIndex(0)} style={{backgroundColor: 'lightblue'}}><ModeCommentOutlinedIcon/></button> : <button onClick={() => changeToIndex(0)}><ModeCommentOutlinedIcon/></button>}</li>
    <li>{index === 1 ? <button disabled onClick={() => changeToIndex(1)} style={{backgroundColor: 'yellow'}}><CameraAltOutlinedIcon/></button> : <button onClick={() => changeToIndex(1)}><CameraAltOutlinedIcon/></button>}</li>
    <li>{index === 2 ? <button disabled onClick={() => changeToIndex(2)} style={{backgroundColor: 'mediumSlateBlue'}}><GroupIcon/></button> : <button onClick={() => changeToIndex(2)}><GroupIcon/></button>}</li>
    </ul>)
  } else {
    footer = (<ul className="main-footer floating-footer">
    <li>{index === 0 ? <button onClick={() => changeToIndex(0)} style={{backgroundColor: 'lightblue'}}><ModeCommentOutlinedIcon/></button> : <button onClick={() => changeToIndex(0)}><ModeCommentOutlinedIcon/></button>}</li>
    <li>{index === 1 ? <button onClick={() => changeToIndex(1)} style={{backgroundColor: 'yellow'}}><CameraAltOutlinedIcon/></button> : <button onClick={() => changeToIndex(1)}><CameraAltOutlinedIcon/></button>}</li>
    <li>{index === 2 ? <button onClick={() => changeToIndex(2)} style={{backgroundColor: 'mediumSlateBlue'}}><GroupIcon/></button> : <button onClick={() => changeToIndex(2)}><GroupIcon/></button>}</li>
    </ul>)
  }
  return (
    <>
      {footer}
    </>
  )
}
