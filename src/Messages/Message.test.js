import React from 'react';
import { shallow } from 'enzyme';
import Message from './Message';

const friend = {
    created: "Fake Creation Date",
    profile_pic_url: "Profile_Pic_URL",
    name: "Guest_Test",
    status: "new-friend",
    streak: 3,
    streak_ref: null,
    sent: 0,
    received: 0,
    last_time_stamp: null,
    snaps: []
};
const friends = {
    "Guest@Guest.com": {
        created: "Guest_Created",
        profile_pic_url: "Guest_Pic",
        name: "Guest",
        status: "sent",
        streak: 6,
        streak_ref: null,
        sent: 0,
        received: 0,
        last_time_stamp: null,
        snaps: []
    }
};
const streak_emoji = "Streak_Emoji";
const k = "Key";
const pic = "Picture";
const email = "test@email.com";
const loggedIn = false;
const key = "key";

describe('Basic Message Test Suite', () => {
  it('App Renders', () => {
    const wrapper = shallow(<Message
        friend={friend}
        friends={friends}
        streak_emoji={streak_emoji}
        k={key}
        key={key}
        pic={pic}
        email={email}
        loggedIn={loggedIn}
    />);
    expect(wrapper.exists());
  })
  it('App Renders', () => {
    const wrapper = shallow(<Message
        friend={friend}
        friends={friends}
        streak_emoji={streak_emoji}
        k={key}
        key={key}
        pic={pic}
        email={email}
        loggedIn={loggedIn}
    />);
    expect(wrapper.find('div.pic-container img.friend-profile-pic').prop('src')).toEqual('Profile_Pic_URL');
    expect(wrapper.find('div.friend-info h3').text()).toEqual('Guest_Test');
  })
})