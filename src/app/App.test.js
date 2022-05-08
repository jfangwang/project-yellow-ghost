import React from 'react';
import {shallow} from 'enzyme';
import {App} from './App';

describe('App Render Test', () => {
  it('Renders without crashing', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.exists()).toBe(true);
  });
});
