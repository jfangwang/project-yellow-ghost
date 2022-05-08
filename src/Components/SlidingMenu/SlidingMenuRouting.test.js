import React from 'react';
import {shallow} from 'enzyme';
import SlidingMenuRouting from './SlidingMenuRouting';

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn().mockReturnValue({
    pathname: '/test-route',
    search: '',
    hash: '',
    state: null,
    key: '5nvxpbdafa',
  }),
}));

describe('SlidingMenuRouting Basic Test Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Renders without crashing', () => {
    const wrapper = shallow(<SlidingMenuRouting />);
    expect(wrapper.exists()).toBe(true);
  });
});
