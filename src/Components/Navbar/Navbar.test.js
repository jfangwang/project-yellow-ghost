import React from 'react';
import {shallow} from 'enzyme';
import {Navbar} from './Navbar';

const wrapper = shallow(<Navbar />);

describe('Navbar Basic Test Suite', () => {
  it('Renders without crashing', () => {
    expect(wrapper.exists()).toBe(true);
  });
  it('4 buttons are there', () => {
    expect(wrapper.find('button').length).toBe(4);
  });
});
