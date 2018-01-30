import React, { Component } from 'react';
import './App.css';
import en from './data/en';
import es from './data/es';

function Quiz() {
  return (
    <div>
      <h1>Questions:</h1>
      <Question />
    </div>
  );
}

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: true,
      language: es,
      total: en.length,
      guesses: [],
      correctAnswer: en.map((outer) => outer.correct - 1)
      // -1 because the data.js starts counting on 1 but arrays start on 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.selectAnswer = this.selectAnswer.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);
  }
  prevQuestion(e){
    console.log('prev');
    e.preventDefault();
  }

  changeLanguage(e){
    switch (e.target.value) {
      case 'en':
        this.setState({ language: en })
        break;
      case 'es':
        this.setState({ language: es })
        break;
      default:
    }

  }
  nextQuestion(e){
    console.log('next');
    e.preventDefault();
  }
  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(e) {
    //console.log(this);
    e.preventDefault();
    console.log('Guesses: ', this.state.guesses)

    // TODO
    // Apply CSS class to correct / incorrect answers
    /*
    if (e.target.className === 'selected') {
      e.target.className = ''
    }else{
      e.target.className = 'selected'
    }
    */

  }

  selectAnswer(answerIndex, e, questionIndex) {
    //console.log(answerIndex);
    //console.log(questionIndex);
    //console.log(e);
    //console.log(this);
    //console.log(this.state.correctAnswer[questionIndex]);

    // When we click (not submit) the correct answer, if we want INSTANT valuation
    console.log(this.state.language[questionIndex].correct[answerIndex]);

    let newGuess = this.state.guesses.slice() // copy the array
    newGuess[questionIndex] = answerIndex;
    this.setState({ guesses: newGuess })

  }

  render() {

    // This will print all questions on one page
    var startQuiz = this.state.language.map((item, questionIndex) => {
      return (
        <div key={questionIndex}>
          <h3>{item.question} ({questionIndex + 1} / {this.state.total}) </h3>
            {
              item.answers.map((answer, i) => {
                return (
                  <div key={i} className="">
                    <div onClick={(e) => this.selectAnswer(i, e, questionIndex)} >
                      {answer}
                    </div>
                  </div>
                )
              })
            }
        </div>
      )
    })

    return (
      <div>
        <div>
          Select Language:
          <button value="es" onClick={this.changeLanguage}>Espanol </button>
          <button value="en" onClick={this.changeLanguage}>English </button>
        </div>
        <form onSubmit={this.handleSubmit}>

          {startQuiz}

          <br />
          <button onClick={this.prevQuestion}>Previous</button>
          <button onClick={this.nextQuestion}>Next</button> <br />

          <input type="submit" value="Show scores / Calculate" /> <br />

        </form>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Quiz />
      </div>
    );
  }
}

export default App;
