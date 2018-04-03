import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import en from './data/en';
import helper from './data/helper';
import es from './data/es';
import ReactGA from 'react-ga'
ReactGA.initialize('UA-85322801-3',{
  debug: false,
});
ReactGA.pageview(window.location.pathname + window.location.search);

class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQuestion: 0,
      currentQuestionExposureLevel: 0, // Not used. But here if needed
      guesses: [],
      // TODO: Unable to use language as a 'key' from a JSON file
      language: en,
      langNr: 0,
      totalQuestions: 0,
      totalExposureLevel: 0,
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
        this.startQuiz();
        break;
      case 'f':
        this.handleSubmit();
        break;
      case 'r':
        console.log('restart quiz?');
        //this.startQuiz();
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
      label: 'Submit final exposure: ' + this.state.totalExposureLevel,
      dimension1: this.state.totalExposureLevel,
      dimension2: this.state.guesses
    });
  }

  nextQuestion(e){
    if (e){
      e.preventDefault();
    }
    if(this.state.currentQuestion < this.state.totalQuestions - 1){
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
      totalQuestions: this.state.language.length,
    });
    ReactGA.event({
      category: 'User',
      label: 'Start Quiz',
      action: 'Started the quiz'
    });
  }

  updateExposureLevel(){
    let xpTotal = 0;
    let xpCurrent = 0;

    // eslint-disable-next-line
    this.state.language.map((x, y) => {
      xpTotal += (x.danger[this.state.guesses[y]] || 0)
      if (y === this.state.currentQuestion){
        xpCurrent = (x.danger[this.state.guesses[this.state.currentQuestion]] || 0)
      }
    });

    this.setState({
      currentQuestionExposureLevel: xpCurrent,
      totalExposureLevel: xpTotal
      }, () => {
      //console.log('updated', this.state.totalExposureLevel)
    });
  }

  render() {
    const firstQuestion = this.state.currentQuestion === 0;
    const isAnswered    = typeof this.state.guesses[this.state.currentQuestion]  === 'number';
    const lastQuestion  = this.state.currentQuestion + 1 === this.state.totalQuestions;

    // This will return an array of each question
    var eachQuiz = this.state.language.map((item, questionIndex) => {
      return (
        <div key={questionIndex} className="row">
          <div className={this.state.currentQuestion === questionIndex ? 'show col-12' : 'hidden col-12'}>
            <h3 className="text-blue text-center">{questionIndex + 1}. {item.question} </h3>
            <div className="row suggestions justify-content-around">
              {
                item.suggestions.map((suggestion, answerIndex) => {
                  return (
                    <div key={answerIndex}
                      className={answerIndex === this.state.guesses[questionIndex] ? 'col-5 selected-answer' : "col-5 unselected"}
                      onClick={() => this.updateGuesses(answerIndex, questionIndex)}>
                      <img src={require("./img/" + item.images[answerIndex])} alt="img" className="rounded-circle mx-auto d-block w-100 my-3" />
                      <p className="text-center">{suggestion}</p>
                    </div>
                  )
                })
              }
            </div>
            <p className="pt-4 " style={{minHeight: '100px'}}>{item.results[this.state.guesses[questionIndex]]}</p>
            <div className="button mt-5 text-center">
              <button className={firstQuestion ? 'hidden' : 'btn btn-lg btn-white text-grey mx-1' }  onClick={this.prevQuestion}>Previous</button>
              <button className={isAnswered && !lastQuestion? 'btn btn-lg btn-green  px-5': 'hidden' }  onClick={this.nextQuestion}>Next</button> <br />
              <input className={lastQuestion ? 'btn btn-lg btn-blue mt-3': 'hidden'} type="submit" value="Show me my exposure level" />
            </div>
          </div>
        </div>
      )
    });

    return (
      <div className="App container">
        <div className="row">
          <div className="col-12 my-3 text-center">
            iScape logo
          </div>
          <form className="col-12 col-md-10 p-5 mx-auto" onSubmit={this.handleSubmit}>
            {this.state.quizRunning ? eachQuiz : null}
            {this.state.welcome     ? <Welcome language={this.state.langNr} startQuiz={this.startQuiz} /> : null}
            {this.state.quizEnded   ? <Final totalExposure={this.state.totalExposureLevel} language={this.state.langNr} /> : null }
          </form>
          { this.state.quizRunning && <Sidebar totalExposure={this.state.totalExposureLevel} />  }
          { this.state.welcome && <Languages lang={this.state.langNr} mySelectLanguage={this.changeLanguage} />}
        </div>
      </div>
    )
  }
}

function Languages(props){
  return(
    <div className="col-12 col-md-8 mx-auto mt-3 text-right" style={{height: '50px'}}>
      <label>
        <select className="form-control" onChange={props.mySelectLanguage}>
          <option value="en">Location1</option>
          <option value="es">Location2</option>
        </select>
      </label>
      <img src={require("./img/place.svg")} style={{height: '30px'}} alt='place' />
    </div>
  )
}

function Final(props) {
  let lang = props.language;
  return(
    <div className="text-center">
      <h4 className="text-blue font-weight-bold mb-5">{helper[lang].thanks}</h4>
      <p className="font-weight-bold">Your exposure level is: {props.totalExposure} </p>
      <Meter meterExposureLevel={props.totalExposure} />
      <br />
      <p class="text-justify">{helper[lang].finaltips}</p>
      {/*<a href="." className="btn btn-blue">{helper[lang].quizagain}</a> */}
      <br />

      <div className="final-tips">
        <img src={require("./img/check.svg")} style={{height: '30px'}} alt='check' />
      </div>


      <button className="btn btn-lg btn-blue px-4 ">
        <img className="pr-2" src={require("./img/facebook.svg")} style={{height: '35px'}} alt='fb' />
        Share on facebook
      </button>

    </div>
  )
}

function Welcome(props) {
  let lang = props.language;
  return (
    <div className="text-center">
      <h2 className="text-blue">{helper[lang].title}</h2>
      <p className="mt-4">{helper[lang].p1}</p>
      <p>{helper[lang].p2}</p>
      <img src={require("./img/Start-quiz.png")} onClick={props.startQuiz} className="w-50 my-4" alt="Start quiz" />
      <p>{helper[lang].click_image}</p>
      <br />
      <button className="btn btn-lg btn-green px-5 " onClick={props.startQuiz}>{helper[lang].startquiz}</button>
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
    <div className="col-12 col-md-8 mx-auto mt-3 sidebar text-center">
      <div className="row p-3">
        <div className="col-5 p-2">
          <h5 className="font-weight-bold">Your exposure to air pollution:</h5>
        </div>
        {/* <img alt="Exposure" src={require("./img/Exposure to air pollution.png")} className="w-75 my-3"/> */}

        <div className="col-7 mt-1">
          <Meter meterExposureLevel={props.totalExposure} />
          <p className="">Exposure Level: {props.totalExposure}</p>
        </div>
      </div>
    </div>
  )
}

function Meter(props){
  return (
    <div>
      <meter className="meter w-75" max='30' min='0'
        optimum='5' high='15' low='0'
        style={{height: '20px'}}
        value={props.meterExposureLevel}></meter>
    </div>
  )
}

export {App};
export {Meter};
export {Questions};
export {Welcome};
