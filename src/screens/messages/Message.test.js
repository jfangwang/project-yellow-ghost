/**
 * @jest-environment jsdom
 */
import React from 'react';
import {shallow} from 'enzyme';
import {Message, statusDict} from './Message';
import {initialState} from '../../Reducers/userReducer';

let user = initialState.user;
let friend = user.friends[user.id];
let wrapper = shallow(<Message friend={friend} user={user}/>);

describe('Message Test Suite', () => {
  beforeEach(() => {
    user = initialState.user;
    friend = user.friends[user.id];
    wrapper = shallow(<Message friend={friend} user={user}/>);
  });
  it('Components Renders Without Crashing', () => {
    expect(wrapper.exists()).toBe(true);
  });
  it('Profile pic shows up', () => {
    expect(wrapper.find('#friendProfilePic').exists()).toBe(true);
  });
  it('User name shows up', () => {
    expect(wrapper.find('#messageFriendName').exists()).toBe(true);
    expect(wrapper.find('#messageFriendName').find('h1').text())
        .toEqual(friend.username);
  });
  it('Status shows up', () => {
    expect(wrapper.find('#messageStatus').exists()).toBe(true);
    expect(wrapper.find('#messageStatus').find('h3').text())
        .toEqual(statusDict[friend.status]);
  });
});
