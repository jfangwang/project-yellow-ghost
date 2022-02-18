import React from 'react';
import { shallow } from 'enzyme';
import Footer from './Footer';

describe('Basic Footer Test Suite', () => {
  it('App Renders', () => {
    const wrapper = shallow(<Footer/>);
    expect(wrapper.exists());
  })
  it('icons found', () => {
    const wrapper = shallow(<Footer/>);
    expect(wrapper.find('div.footer').children()).toHaveLength(2);
  })
})