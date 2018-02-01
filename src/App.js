import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import en from './data/en';
import helper from './data/helper';
import es from './data/es';

class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQuestion: 0,
      exposureLevel: 0,
      guesses: [],
      // TODO: Unable to use language as a 'key' from a JSON file
      language: en,
      langNr: 0,
      total: 0,
      quizRunning: false, // default false
      welcome: true, // default true
      quizEnded: false,
    };

    console.log(this)

    this.changeLanguage = this.changeLanguage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.prevQuestion = this.prevQuestion.bind(this);
    this.startQuiz = this.startQuiz.bind(this);
    this.updateGuesses = this.updateGuesses.bind(this);
  }

  changeLanguage(e){
    console.log(e.target.value);
    // TODO: why can we not simply use the following line?
    //this.setState({ language: e.target.value})
    // Which makes the rest unneccessary
    switch (e.target.value) {
      case 'en':
        this.setState({ language: en, langNr: 0 })
        break;
      case 'es':
        this.setState({ language: es, langNr: 1 })
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
  }


  nextQuestion(e){
    e.preventDefault();
    if(this.state.currentQuestion < this.state.total - 1){
      this.setState({currentQuestion:  this.state.currentQuestion + 1})
    }
    //console.log('next nr', this.state.currentQuestion);
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
      //console.log('updated', this.state.exposureLevel)
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
                    <div key={i}
                      className={i === this.state.guesses[questionIndex] ? 'col-6 selected' : "col-6 "}
                      onClick={(e) => this.updateGuesses(i, e, questionIndex)}>
                      <img src={require("./img/" + item.images[i])} alt="img" className="rounded-circle mx-auto d-block w-100 my-3" />
                      <p className="text-center">{suggestion}</p>
                    </div>
                  )
                })
              }
            </div>
            <p className="pt-4 text-primary">{item.results[this.state.guesses[questionIndex]]}</p>
            <div className="button mt-5 text-center">
              <button className={firstQuestion ? 'hidden' : 'btn btn-sm' }  onClick={this.prevQuestion}>Previous</button>
              <button className={lastQuestion ? 'hidden' : 'btn btn-blue'}  onClick={this.nextQuestion}>Next question</button> <br />
              <input className={lastQuestion ? 'btn btn-blue mt-3': 'hidden'} type="submit" value="Show scores / Calculate" />
            </div>
          </div>
        </div>
      )
    });

    return (
      <div className="App container mt-4">
        <Languages welcome={this.state.welcome} myClick={this.changeLanguage} />
        <div className="row">
          <form className="border col-12 col-md-8 p-5 mx-auto" onSubmit={this.handleSubmit}>
            {this.state.quizRunning === true ? eachQuiz : null}
            {this.state.welcome === true ? <Welcome language={this.state.langNr} myClick={this.startQuiz} /> : null}
            {this.state.quizEnded ? <Final language={this.state.langNr} /> : null }
          </form>
          <Sidebar exposure={this.state.exposureLevel} />
        </div>
      </div>
    )
  }
}

function Languages(props){
  return(
    <div className={props.welcome ? "row text-center" : 'hidden'}>
      <div className="col my-1">
        <button className="btn btn-sm btn-blue" value="es" onClick={props.myClick}>Espanol </button>
        <button className="btn btn-sm btn-blue mx-1" value="en" onClick={props.myClick}>English </button>
      </div>
    </div>
  )
}

function Final(props) {
  let lang = props.language;
  return(
    <div className="text-center">
      <h4>{helper[lang].thanks}</h4>
      <p>{helper[lang].finaltips}</p>
      <br />
      <a href="/" className="btn btn-blue">{helper[lang].quizagain}</a>
    </div>
  )
}

function Welcome(props) {
  let lang = props.language;
  return (
    <div className="text-center">
      <h2>{helper[lang].title}</h2>
      <p>{helper[lang].p1}</p>
      <p>{helper[lang].p2}</p>
      <img src={require("./img/Start-quiz.png")} onClick={props.myClick} className="w-50 my-4" alt="Start quiz" />
      <br />
      <button className="btn btn-blue" onClick={props.myClick}>{helper[0].startquiz}</button>
    </div>
  )
}

class App extends Component {
  render() {
    return (
      <Questions />
    );
  }
}

function Sidebar(props){
  return (
    <div className="col-12 col-md-4 sidebar text-center">
      <h4 className="mt-3">Your exposure to air pollution</h4>
      <img alt="Exposure" src={require("./img/Exposure to air pollution.png")} className="w-75 my-3"/>
      <p className="text-danger">Exposure Level: {props.exposure}</p>
    </div>
  )
}

export default App;
