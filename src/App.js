import React, { Component } from 'react';
import './App.css';
import en from './data/en';
import es from './data/es';

class Questions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      started: false,
      currentQuestion: 0,
      language: en,
      total: en.length,
      guesses: [],
      //correctAnswer: en.map((outer) => outer.correct)
      // -1 because the data.js starts counting on 1 but arrays start on 0
    };
    this.changeLanguage = this.changeLanguage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.prevQuestion = this.prevQuestion.bind(this);
    this.selectAnswer = this.selectAnswer.bind(this);
    this.startQuiz = this.startQuiz.bind(this);
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

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(e) {
    console.log(this.state.currentQuestion);
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

  nextQuestion(e){
    console.log(this.total)
    e.preventDefault();
    if(this.state.currentQuestion < this.state.total - 1){
      this.setState({currentQuestion:  this.state.currentQuestion + 1})
    }
    console.log('next', this.state.currentQuestion);
  }

  prevQuestion(e){
    e.preventDefault();
    if(this.state.currentQuestion > 0){
      this.setState({currentQuestion: this.state.currentQuestion - 1})
    }
    console.log('prev', this.state.currentQuestion);
  }


  selectAnswer(answerIndex, e, questionIndex) {
    //console.log(answerIndex);
    //console.log(questionIndex);
    //console.log(e);
    //console.log(this);
    //console.log(this.state.correctAnswer[questionIndex]);

    // When we click (not submit) the correct answer, if we want INSTANT valuation
    console.log(this.state.language[questionIndex].results[answerIndex]);

    let newGuess = this.state.guesses.slice() // .slice() clones the array
    newGuess[questionIndex] = answerIndex;
    this.setState({ guesses: newGuess })
  }

  startQuiz(){
    this.setState({started: true})
  }

  render() {
    // This will return an array of each question
    var eachQuiz = this.state.language.map((item, questionIndex) => {
      return (
        <div class="row">
            <div key={questionIndex} className={this.state.currentQuestion === questionIndex ? 'show col-12' : 'hidden col-12'}>
              <h3>{questionIndex + 1} / {this.state.total}. {item.question} </h3>
              <div className="row">
                {
                  item.suggestions.map((sugg, i) => {
                    return (
                      <div key={i} className="col-6 suggestion">
                        <div onClick={(e) => this.selectAnswer(i, e, questionIndex)} >
                          {sugg}
                        </div>
                      </div>
                    )
                  })
                }
              </div>
              <p>{item.results[this.state.guesses[questionIndex]]}</p>
              <div className="button mt-5">
                <button className="btn btn-blue"  onClick={this.prevQuestion}>Previous</button>
                <button className="btn btn-blue"  onClick={this.nextQuestion}>Next</button> <br />
                <input className="btn btn-blue mt-3" type="submit" value="Show scores / Calculate" />
              </div>
            </div>
        </div>
      )
    });

    var welcome = (
      <div>
        <h2>Air pollution in [Guildford]</h2>
        <button className="btn btn-blue" onClick={this.startQuiz}>Start Quiz </button>
      </div>
    );

      return (
        <div>
          <div className="row">
            Select Language:
            <button className="btn btn-sm btn-blue" value="es" onClick={this.changeLanguage}>Espanol </button>
            <button className="btn btn-sm btn-blue" value="en" onClick={this.changeLanguage}>English </button>
          </div>

          <div className="row">
            <form className="col-8 p-5 mx-auto" onSubmit={this.handleSubmit}>
              {this.state.started === true ? eachQuiz : welcome}
            </form>

            <div className="col-4 sidebar">
              <h3>Your exposure to air pollution</h3>
              {this.state.currentQuestion}/
              {this.state.total}
            </div>
          </div>
        </div>
      )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App container">
        <Questions />
      </div>
    );
  }
}

export default App;
