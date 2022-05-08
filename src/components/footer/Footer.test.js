import React from 'react';
import {shallow} from 'enzyme';
import {Footer} from './Footer';

const wrapper = shallow(<Footer />);

describe('Footer Basic Test Suite', () => {
  it('Renders without crashing', () => {
    expect(wrapper.exists()).toBe(true);
  });
  it('3 icons are there', () => {
    expect(wrapper.find('Chat').exists()).toBe(true);
    expect(wrapper.find('Camera').exists()).toBe(true);
    expect(wrapper.find('Users').exists()).toBe(true);
  });
});
