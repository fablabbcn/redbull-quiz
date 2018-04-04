import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App';
import {Meter} from './App';
import {Questions} from './App';
import {Welcome} from './App';
import ReactTestUtils from 'react-dom/test-utils';
import ShallowRenderer from 'react-test-renderer/shallow';
import renderer from 'react-test-renderer'
jest.mock("react-ga")

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('sums 2', () =>{
  expect(2+2).toBe(4);
})

it('WIP should trigger next question with key n', () => {
  //const node = 'div';
  //ReactTestUtils.Simulate.change(node);
  //ReactTestUtils.Simulate.keyDown(node, {key: 'Enter', keycode: 13, which: 13});
});

it('should start the quiz', () => {
  const component = renderer.create(
    <Welcome language={1} />
  );
  let tree = component.toJSON();
  //expect(tree).toMatchSnapshot();
  //tree.props.startQuiz()
  console.log(tree.children[6])
  //tree.children[6].props.startQuiz()

  //expect(tree).toMatchSnapshot();
})

it('WIP should start the quiz by clicking the image or btn', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<Welcome language={1} myClick={'should send this.startQuiz'}/>)
  const result = renderer.getRenderOutput();

  expect(result.type).toBe('div');
  // TODO: clicking either those 2 should start the quiz
  expect(result.props.children[3].type).toBe('img');
  expect(result.props.children[6].type).toBe('button');

  const btn = result.props.children[6]

  //console.log(btn)
  // Does not work with Shallow Rendering
  //console.log(ReactTestUtils.isElement(btn))
  //ReactTestUtils.Simulate.click(btn)
  //result.props.children[6].simulate('click');
});

it('uses another language for the Start Quiz button', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<Welcome language={1} myClick={'should send this.startQuiz'}/>)
  const result = renderer.getRenderOutput();
  const btn = result.props.children[6]
  expect(btn.props.children).toBe('Comienzo Quiz')
});

it('Shows the meter with a fixed Exposure level', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<Meter meterExposureLevel={42} />);
  const result = renderer.getRenderOutput();
  //console.log(result)
  //console.log(result.type)
  //console.log(result.props.children)
  expect(result.type).toBe('div');
  expect(result.props.children).toEqual(
      <meter className="meter w-75" max='45' min='0' optimum='0' high='20' low='13' style={{"height": "25px"}} value={42} ></meter>
  )
});

it('shows the questions', () => {
  const renderer = new ShallowRenderer();
  renderer.render(<Questions />)
  const result = renderer.getRenderOutput();
  expect(result.type).toBe('div');
  //console.log(result)
  //result.props.children[1].props.children[0].props.children[1].props.myClick
  //console.log(result.props.children[1].props.children[0].props.children[1].props)
});

it('WIP should increment Exposure level after guessing', () => {
  
})
