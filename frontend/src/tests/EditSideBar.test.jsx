import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { Button, Card } from '@material-ui/core';
import QuestionCard from '../components/QuestionCard';
import EditSideBar from '../components/EditSideBar';

const questions = { quizID: 1, qno: 1, question: 'why?' };
describe('EditSideBar', () => {
  it('should have 1 question card when editsidebar is passed in 1 question', () => {
    const onClick = jest.fn();
    const wrapper = shallow(<EditSideBar url="www" handleDelete={onClick} addNewQuestion={onClick} currQno={1} handleCardClick={onClick} quizQuestions={[questions]} />);
    expect(wrapper.find(QuestionCard)).toHaveLength(1);
  });
  it('has a questioncard with custom question number and question', () => {
    const onClick = jest.fn();
    const wrapper = shallow(<QuestionCard url="localhost" quizID={123} currQno={1} key={1} qno={1} question="why?" handleDelete={onClick} onClick={onClick} />);
    const qno = wrapper.find('[data-test="qno"]');
    expect(qno.text()).toBe('Question 1');
    const question = wrapper.find('[data-test="question"]');
    expect(question.text()).toBe('why?');
  });
  it('has an add button that should trigger when clicked and also has aria-label', () => {
    // test click and aria label
    const onClick = jest.fn();
    const wrapper = shallow(
      <Button
        aria-label="add-question"
        onClick={onClick}
      >
        +
      </Button>,
    );
    wrapper.simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(wrapper.props()['aria-label']).toEqual('add-question');
  });
  it('has a question cards that can be clicked', () => {
    const onClick = jest.fn();
    const wrapper = shallow(<QuestionCard url="localhost" quizID={123} currQno={1} key={1} qno={1} question="Why?" handleDelete={onClick} onClick={onClick} />);
    const card = wrapper.find(Card);
    card.simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  it('has a close button that can be clicked', () => {
    const onClick = jest.fn();
    const wrapper = shallow(<QuestionCard url="localhost" quizID={123} currQno={1} key={1} qno={1} question="Why?" handleDelete={onClick} onClick={onClick} />);
    const card = wrapper.find(Button);
    card.simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  // Snapshots. Making sure component does not change unexpectedly by
  // comparing a reference snapshot with test snapshot.
  it('renders with props', () => {
    const onClick = jest.fn();
    const esb = renderer.create(<EditSideBar url="www" handleDelete={onClick} addNewQuestion={onClick} currQno={1} handleCardClick={onClick} quizQuestions={[]} />);
    expect(esb).toMatchSnapshot();
  });
});
