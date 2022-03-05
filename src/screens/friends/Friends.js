import React, { Component } from 'react'
import '../account/Account.css';
import AddFriendIcon from '../../assets/images/add-friend-icon.png';
import './Friends.css';

export default class Friends extends Component {
  render() {
    const { peopleList, userDoc, edit_friends } = this.props;
    return (
      <main className="main">
        <AddFriend
          friends={userDoc.friends}
          pending={userDoc.pending}
          strangers={peopleList.strangers}
          everyone={peopleList.everyone}
          edit_friends={edit_friends}
          email={userDoc.email}
          added_me={userDoc.added_me}
        />
      </main>
    )
  }
}
function AddFriend(props) {
  var filtered_strangers = props.strangers;
  Object.keys(props.added_me).forEach(item => {
    delete filtered_strangers[item];
  })

  return (
    <div className="screen">
      {/* <input type="search" placeholder="Find Friends" className="friend-search" /> */}
      <h3 className="friend-head">Quick Add ({Object.keys(props.strangers).length})</h3>
      <ul className="friend-list-container">
        {Object.keys(filtered_strangers).sort().map((key) => (
          <Stranger
            strangers={filtered_strangers}
            k={key}
            edit_friends={props.edit_friends}
          />
        ))}
      </ul>
      {Object.keys(filtered_strangers).length === 0 ?
        <p>You are friends with everyone</p>
        : null
      }
      {Object.keys(props.added_me).length === 0 ? null :
        <>
          <h3 className="friend-head">Added Me ({Object.keys(props.added_me).length})</h3>
          <ul className="friend-list-container">
            {Object.keys(props.added_me).sort().map((key) => (
              <AddedMe
                added_me={props.added_me}
                k={key}
                edit_friends={props.edit_friends}
              />
            ))}
          </ul>
        </>
      }
      <h3 className="friend-head">Friends ({Object.keys(props.friends).length - 1})</h3>
      <ul className="friend-list-container">
        {Object.keys(props.friends).sort().map((key) => (
          <Friend
            friends={props.friends}
            k={key}
            edit_friends={props.edit_friends}
            email={props.email}
          />
        ))}
      </ul>
      {Object.keys(props.friends).length - 1 === 0 ?
        <p>Add some friends!</p>
        : null
      }
      <h3 className="friend-head">Everyone ({Object.keys(props.everyone).length})</h3>
      <ul className="friend-list-container">
        {Object.keys(props.everyone).sort().map((key) => (
          <Everyone
            everyone={props.everyone}
            k={key}
          />
        ))}
      </ul>
      <div className="footer">
        {/* Placeholder */}
      </div>
    </div>
  )
}

function Friend(props) {
  var friends = props.friends;
  var key = props.k;
  return (
    <>
      {props.email === key ? null :
        <li className="item-container">
          <div className="pic-info-mix">
            <div className="pic-container">
              <img className="friend-profile-pic" src={friends[key].profile_pic_url} alt="" />
            </div>
            <div className="friend-info">
              <h2>{friends[key].name}</h2>
              <p style={{ fontSize: "0.9rem" }}>{key}</p>
            </div>
          </div>
          <div className="friend-button">
            {props.email === key ? null :
              friends[key].status === "pending" ?
                <button onClick={() => props.edit_friends("remove request", key, friends[key])}>Remove Request</button>
                : <button onClick={() => props.edit_friends("remove", key, friends[key])}>Remove</button>
            }
          </div>
        </li>
      }
    </>
  )
}

function AddedMe(props) {
  var addedMe = props.added_me;
  var key = props.k;
  return (
    <>
      <li className="item-container">
        <div className="pic-info-mix">
          <div className="pic-container">
            <img className="friend-profile-pic" src={addedMe[key].profile_pic_url} alt="" />
          </div>
          <div className="friend-info">
            <h2>{addedMe[key].name}</h2>
            <p>{key}</p>
          </div>
        </div>
        <div className="friend-button">
          <button onClick={() => props.edit_friends("accept request", key, addedMe[key])}><img alt="add friend" className="add-friend-list-icon" src={AddFriendIcon} />Add</button>
        </div>
      </li>
    </>
  )
}

function Stranger(props) {
  var strangers = props.strangers;
  var key = props.k;
  return (
    <>
      <li className="item-container">
        <div className="pic-info-mix">
          <div className="pic-container">
            <img className="friend-profile-pic" src={strangers[key].profile_pic_url} alt="" />
          </div>
          <div className="friend-info">
            <h2>{strangers[key].name}</h2>
            <p>{key}</p>
          </div>
        </div>
        <div className="friend-button">
          <button onClick={() => props.edit_friends("add", key, strangers[key])}><img className="add-friend-list-icon" src={AddFriendIcon} alt="add friend list icon" />Add</button>
        </div>
      </li>
    </>
  )
}

function Everyone(props) {
  var everyone = props.everyone;
  var key = props.k;

  return (
    <>
      <li className="item-container">
        <div className="pic-info-mix">
          <div className="pic-container">
            <img className="friend-profile-pic" src={everyone[key].profile_pic_url} alt="" />
          </div>
          <div className="friend-info">
            <h2>{everyone[key].name}</h2>
            <p>{key}</p>
          </div>
        </div>
        <div className="friend-button">
        </div>
      </li>
    </>
  )
}