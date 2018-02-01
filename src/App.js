import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import en from './data/en';
import es from './data/es';

class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQuestion: 0,
      exposureLevel: 0,
      guesses: [],
      language: en,
      total: 0,
      quizRunning: false, // default false
      welcome: true, // default true
      quizEnded: false,
    };

    this.changeLanguage = this.changeLanguage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.prevQuestion = this.prevQuestion.bind(this);
    this.updateGuesses = this.updateGuesses.bind(this);
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

  handleSubmit(e) {
    e.preventDefault();
    //console.log(this.state.currentQuestion);
    console.log('Guesses: ', this.state.guesses)

    this.setState({quizEnded: true, quizRunning: false});
    this.updateExposureLevel();
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
    e.preventDefault();
    if(this.state.currentQuestion < this.state.total - 1){
      this.setState({currentQuestion:  this.state.currentQuestion + 1})
    }
    console.log('next nr', this.state.currentQuestion);
    console.log(this.state.total)
  }

  prevQuestion(e){
    e.preventDefault();
    if(this.state.currentQuestion > 0){
      this.setState({currentQuestion: this.state.currentQuestion - 1})
    }
    console.log('prev', this.state.currentQuestion);
  }

  updateGuesses(answerIndex, e, questionIndex) {
    //console.log(answerIndex);
    //console.log(questionIndex);
    //console.log(e);
    //console.log(this);

    let newGuess = this.state.guesses.slice() // .slice() clones the array
    newGuess[questionIndex] = answerIndex;
    this.setState({ guesses: newGuess }, () => {
      // Make sure we update exposure AFTER guesses have been updated!
      this.updateExposureLevel();
    });
  }

  startQuiz(){
    this.setState({
      welcome: false,
      quizRunning: true,
      total: this.state.language.length,
    })
  }

  updateExposureLevel(){
    let xpLevel = 0;
    // eslint-disable-next-line
    this.state.language.map((x, y) => {
      xpLevel += (x.danger[this.state.guesses[y]] || 0)
    });

    this.setState({ exposureLevel: xpLevel }, () => {
      console.log('updated', this.state.exposureLevel)
    });
  }

  render() {
    const firstQuestion = this.state.currentQuestion === 0;
    const lastQuestion = this.state.currentQuestion + 1 === this.state.total;
    // This will return an array of each question
    var eachQuiz = this.state.language.map((item, questionIndex) => {
      return (
        <div key={questionIndex} className="row">
          <div className={this.state.currentQuestion === questionIndex ? 'show col-12' : 'hidden col-12'}>
            <h3>{questionIndex + 1}. {item.question} </h3>
            <div className="row suggestions">
              {
                item.suggestions.map((suggestion, i) => {
                  return (
                    <div key={i} className={i === this.state.guesses[questionIndex] ? 'col-6 selected' : "col-6 "}>
                      <div onClick={(e) => this.updateGuesses(i, e, questionIndex)} >
                        <img src={require("./img/" + item.images[i])} alt="img" className="rounded-circle mx-auto d-block w-100 my-3" />
                        <p className="text-center">{suggestion}</p>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <p className="pt-4">{item.results[this.state.guesses[questionIndex]]}</p>
            <div className="button mt-5 text-center">
              <button className={firstQuestion ? 'hidden' : 'btn btn-sm' }  onClick={this.prevQuestion}>Previous</button>
              <button className={lastQuestion ? 'hidden' : 'btn btn-blue'}  onClick={this.nextQuestion}>Next question</button> <br />
              <input className={lastQuestion ? 'btn btn-blue mt-3': 'hidden'} type="submit" value="Show scores / Calculate" />
            </div>
          </div>
        </div>
      )
    });

    var welcome = (
      <div className="text-center">
        <h2>Air pollution in [Guildford]</h2>
        <p>Learn about the air pollution in your city and what you can do to prevent it and protect yourself.</p>
        <p>Take the quiz to see how much air pollution you are exposed to on the air pollution meter.</p>
        <img src={require("./img/Start-quiz.png")} onClick={this.startQuiz} className="w-50 my-4" alt="Start quiz" />
        <br />
        <button className="btn btn-blue" onClick={this.startQuiz}>Start Quiz </button>
      </div>
    );

    var final = (
      <div className="text-center">
        <h4>Thanks for taking the quiz!</h4>
        <p>
          Here are some tips for how you can reduce your exposure to air pollution. If you’ve done well, please keep up the good work and share them with your family and friends.
        </p>
        <br />
        <a href="/" className="btn btn-blue" >Do the quiz again?</a>
      </div>
    );

    return (
      <div>
        <div className="row text-center">
          <div className="col my-1">
            <button className="btn btn-sm btn-blue" value="es" onClick={this.changeLanguage}>Espanol </button>
            <button className="btn btn-sm btn-blue mx-1" value="en" onClick={this.changeLanguage}>English </button>
          </div>
        </div>

        <div className="row border border-right-0">
          <form className="col-8 p-5 mx-auto" onSubmit={this.handleSubmit}>
            {this.state.quizRunning === true ? eachQuiz : null}
            {this.state.welcome === true ? welcome : null}
            {this.state.quizEnded ? final : null }
          </form>
          <Sidebar exposure={this.state.exposureLevel} />
        </div>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App container mt-4">
        <Questions />
      </div>
    );
  }
}

class Sidebar extends Component {
  render(){
    return (
      <div className="col-12 col-md-4 sidebar text-center">
        <h4 className="mt-3">Your exposure to air pollution</h4>
        <img alt="Exposure" src={require("./img/Exposure to air pollution.png")} className="w-75 my-3"/>
        <p className="text-danger">Exposure Level: {this.props.exposure}</p>
      </div>
    )
  }
}

export default App;
