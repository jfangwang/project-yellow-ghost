import React from 'react';
import { shallow } from 'enzyme';
import App from './App.js';

describe('Basic App Test Suite', () => {
  it('App Renders', () => {
    const wrapper = shallow(<App/>);
    expect(wrapper.exists()).toEqual(true);
  })
})