import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import en from './data/en';
import helper from './data/helper';
import es from './data/es';
import ReactGA from 'react-ga'
ReactGA.initialize('UA-85322801-3',{
  debug: true,
});
ReactGA.pageview(window.location.pathname + window.location.search);

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

    //console.log(this)

    this.changeLanguage = this.changeLanguage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.prevQuestion = this.prevQuestion.bind(this);
    this.startQuiz = this.startQuiz.bind(this);
    this.updateGuesses = this.updateGuesses.bind(this);
    this.handleKeyboard = this.handleKeyboard.bind(this);

  }

  componentDidMount(){
    document.addEventListener("keydown", this.handleKeyboard, false);
  }

  handleKeyboard(event){
    switch (event.key) {
      case '1':
        this.updateGuesses(0, this.state.currentQuestion)
        break;
      case '2':
        this.updateGuesses(1, this.state.currentQuestion)
        break;
      case 'n':
        this.nextQuestion();
        break;
      case 'p':
        this.prevQuestion();
        break;
      case 's':
        console.log('Start');
        this.startQuiz();
        break;
      case 'c':
        console.log('Calculate');
        //this.startQuiz();
        this.handleSubmit();
        break;
      default:
        //console.log('Key not mapped..');
    }
  }

  changeLanguage(e){
    //console.log(e.target.value);
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
    if(e){
      e.preventDefault();
    }
    //console.log(this.state.currentQuestion);
    //console.log('Guesses: ', this.state.guesses)

    this.setState({quizEnded: true, quizRunning: false});
    this.updateExposureLevel();

    ReactGA.event({
      category: 'User',
      action: 'Finished quiz',
      label: 'Submit final exposure: ' + this.state.exposureLevel,
      dimension1: this.state.exposureLevel,
      dimension2: this.state.guesses
    });
  }

  nextQuestion(e){
    if (e){
      e.preventDefault();
    }
    if(this.state.currentQuestion < this.state.total - 1){
      this.setState({currentQuestion:  this.state.currentQuestion + 1})
    }

    ReactGA.event({
      category: 'User',
      label: 'Next question: ' + (this.state.currentQuestion + 2),
      action: 'Next question'
    });
    //console.log('next nr', this.state.currentQuestion);
  }

  prevQuestion(e){
    if (e){
      e.preventDefault();
    }
    if(this.state.currentQuestion > 0){
      this.setState({currentQuestion: this.state.currentQuestion - 1})
    }
    ReactGA.event({
      category: 'User',
      label: 'Previous question: ' + (this.state.currentQuestion),
      action: 'Previous question'
    });
  }

  updateGuesses(answerIndex, questionIndex) {
    //console.log(answerIndex);
    //console.log(questionIndex);
    //console.log(this);

    let newGuess = this.state.guesses.slice() // .slice() clones the array
    newGuess[questionIndex] = answerIndex;
    this.setState({ guesses: newGuess }, () => {
      // Make sure we update exposure AFTER guesses have been updated!
      this.updateExposureLevel();
    });
    ReactGA.event({
      category: 'User',
      action: 'guessed',
      label: 'Clicked: ' + answerIndex,
    });
  }

  startQuiz(){
    this.setState({
      welcome: false,
      quizRunning: true,
      total: this.state.language.length,
    });
    ReactGA.event({
      category: 'User',
      label: 'Start Quiz',
      action: 'Started the quiz'
    });
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
            <div className="row suggestions justify-content-around">
              {
                item.suggestions.map((suggestion, answerIndex) => {
                  return (
                    <div key={answerIndex}
                      ref={this.clickDiv}
                      className={answerIndex === this.state.guesses[questionIndex] ? 'col-6 selected' : "col-4 unselected"}
                      onClick={() => this.updateGuesses(answerIndex, questionIndex)}>
                      <img src={require("./img/" + item.images[answerIndex])} alt="img" className="rounded-circle mx-auto d-block w-100 my-3" />
                      <p className="text-center">{suggestion}</p>
                    </div>
                  )
                })
              }
            </div>
            <p className="pt-4 text-primary">{item.results[this.state.guesses[questionIndex]]}</p>
            <div className="button mt-5 text-center">
              <button className={firstQuestion ? 'hidden' : 'btn' }  onClick={this.prevQuestion}>Previous</button>
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
        <button className="btn btn-sm btn-blue" value="es" onClick={props.myClick}>Test-1 </button>
        <button className="btn btn-sm btn-blue mx-1" value="en" onClick={props.myClick}>Test-2 </button>
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
      <a href="" className="btn btn-blue">{helper[lang].quizagain}</a>
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
