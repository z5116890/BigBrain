import React from 'react';
import renderer from 'react-test-renderer';
import { Typography } from '@material-ui/core';
import { createShallow } from '@material-ui/core/test-utils';
import CorrectAnswer from '../components/CorrectAnswer';

describe('CorrectAnswer', () => {
  let shallow;
  beforeAll(() => {
    shallow = createShallow({ dive: true });
  });
  it('should contain 1 Card component', () => {
    const wrapper = shallow(<CorrectAnswer correct answer="yes" />);
    expect(wrapper.find('#answer')).toHaveLength(1);
  });
  it('should contain 1 Typography component', () => {
    const wrapper = shallow(<CorrectAnswer correct answer="yes" />);
    expect(wrapper.find(Typography)).toHaveLength(1);
  });
  it('displays a custom correct answer given through props', () => {
    const wrapper = shallow(<CorrectAnswer correct answer="yes" />);
    const title = wrapper.find('[data-test="answer"]');
    expect(title.text()).toBe('yes');
  });
  it('displays a red cross if answer is incorrect', () => {
    const wrapper = shallow(<CorrectAnswer correct={false} answer="yes" />);
    expect(wrapper.find('#cross').exists()).toEqual(true);
  });
  it('displays a green tick if answer is correct', () => {
    const wrapper = shallow(<CorrectAnswer correct answer="yes" />);
    expect(wrapper.find('#tick').exists()).toEqual(true);
  });
  // Snapshots. Making sure component does not change unexpectedly by
  // comparing a reference snapshot with test snapshot.
  it('renders with props', () => {
    const ca = renderer.create(<CorrectAnswer correct answer="yes" />);
    expect(ca).toMatchSnapshot();
  });
});
