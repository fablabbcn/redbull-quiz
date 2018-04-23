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
      myTips: [],
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

    var that = this;

    var gamepadInfo = document.getElementById("gamepad-info");

    //
    var haveEvents = 'ongamepadconnected' in window;
    var controllers = {};

    function connecthandler(e) {
      addgamepad(e.gamepad);
    }

    function addgamepad(gamepad) {
      controllers[gamepad.index] = gamepad;
      document.getElementById('gamepad-controller').innerHTML = 'Gamepad Connected'

      var d = document.createElement("div");
      d.setAttribute("id", "controller" + gamepad.index);

      var t = document.createElement("p");
      t.appendChild(document.createTextNode("gamepad: " + gamepad.id));
      d.appendChild(t);

      var b = document.createElement("div");
      b.className = "buttons";
      for (var i = 0; i < gamepad.buttons.length; i++) {
        var e = document.createElement("span");
        e.className = "button";
        //e.id = "b" + i;
        e.innerHTML = i;
        b.appendChild(e);
      }

      d.appendChild(b);

      var a = document.createElement("div");
      a.className = "axes";

      for (var i = 0; i < gamepad.axes.length; i++) {
        var p = document.createElement("progress");
        p.className = "axis";
        //p.id = "a" + i;
        p.setAttribute("max", "2");
        p.setAttribute("value", "1");
        p.innerHTML = i;
        a.appendChild(p);
      }

      d.appendChild(a);

      // See https://github.com/luser/gamepadtest/blob/master/index.html
      var start = document.getElementById("start");
      if (start) {
        start.style.display = "none";
      }

      document.body.appendChild(d);
      requestAnimationFrame(updateStatus);
    }

    function disconnecthandler(e) {
      removegamepad(e.gamepad);
    }

    function removegamepad(gamepad) {
      document.getElementById('gamepad-controller').innerHTML = 'Gamepad disonnected'
      var d = document.getElementById("controller" + gamepad.index);
      document.body.removeChild(d);
      delete controllers[gamepad.index];
    }

    function debounce(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    };

    var prev_quest = debounce(function(){
      console.log('blue prev')
      that.prevQuestion();
    }, 50)

    var next_quest = debounce(function(){
      console.log('green next')

      that.nextQuestion();
    }, 50)

    function updateStatus() {
      if (!haveEvents) {
        scangamepads();
      }

      var i = 0;
      var j;

      for (j in controllers) {
        var controller = controllers[j];
        var d = document.getElementById("controller" + j);
        var buttons = d.getElementsByClassName("button");

        for (i = 0; i < controller.buttons.length; i++) {
          var b = buttons[i];
          var val = controller.buttons[i];
          var pressed = val === 1.0;
          if (typeof(val) === "object") {
            pressed = val.pressed;
            val = val.value;
          }

          var pct = Math.round(val * 100) + "%";
          b.style.backgroundSize = pct + " " + pct;

          if (pressed) {
            if (i === 0) {
              prev_quest();
            }

            if (i === 1) {
              next_quest();
            }

            //restart
            if (controller.buttons[0].value === 1 && controller.buttons[1].value === 1){
              window.location.reload();
            }
          }
        }

        var axes = d.getElementsByClassName("axis");
        for (i = 0; i < controller.axes.length; i++) {
          var a = axes[i];
          a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
          a.setAttribute("value", controller.axes[i] + 1);

          if (controller.axes[0] === 1){
            that.updateGuesses(1, that.state.currentQuestion)
            console.log('up')
          }
          if (controller.axes[0] === -1){
            that.updateGuesses(0, that.state.currentQuestion)
            console.log('down')
          }
          if (controller.axes[2] === 1){
            that.updateGuesses(1, that.state.currentQuestion)
            console.log('right')
          }
          if (controller.axes[2] === -1) {
            that.updateGuesses(0, that.state.currentQuestion)
            console.log('left')
          }

          // Firefox uses a different object for the Axes
          if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){

            if (controller.axes[3] === -1) {
              //left
              console.log('left ff')
              that.updateGuesses(0, that.state.currentQuestion)
            }
            if (controller.axes[3] === 1) {
              that.updateGuesses(1, that.state.currentQuestion)
              console.log('right ff')
            }
          }
        }
      }

      requestAnimationFrame(updateStatus);
    }

    function scangamepads() {
      var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
      for (var i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
          if (gamepads[i].index in controllers) {
            controllers[gamepads[i].index] = gamepads[i];
          } else {
            addgamepad(gamepads[i]);
          }
        }
      }
    }


    window.addEventListener("gamepadconnected", connecthandler);
    window.addEventListener("gamepaddisconnected", disconnecthandler);

    if (!haveEvents) {
      setInterval(scangamepads, 500);
    }
    //
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
    this.updateTips();

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

    // Call startQuiz, in case we are using the joystick or keyboard 'n'
    if(this.state.totalQuestions === 0){
      this.startQuiz();
      return;
    }

    // Don't allow us to go forward, if a guess has not been made
    if (this.state.guesses[this.state.currentQuestion] === undefined) {
      return;
    }

    // If final question, show the exposure level
    if (this.state.currentQuestion === this.state.totalQuestions - 1){
      this.handleSubmit();
    }

    // Increment
    if(this.state.currentQuestion < this.state.totalQuestions - 1){
      this.setState({currentQuestion: this.state.currentQuestion + 1})
    }

    ReactGA.event({
      category: 'User',
      label: 'Next question: ' + (this.state.currentQuestion + 2),
      action: 'Next question'
    });
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

  updateTips(){
    let tmpTips = [];
    // eslint-disable-next-line
    this.state.language.map((x, y) => {
      tmpTips.push(x.tips[this.state.guesses[y]])
    });

    this.setState({
      myTips: tmpTips
    })
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
            <h3 style={{minHeight: '99px'}} className="text-blue text-center">{questionIndex + 1}. {item.question} </h3>
            <div className="row suggestions justify-content-around">
              {
                item.suggestions.map((suggestion, answerIndex) => {
                  return (
                    <div key={answerIndex}
                      className={answerIndex === this.state.guesses[questionIndex] ? 'col-6 col-md-5 selected-answer' : "col-6 col-md-5 unselected"}
                      onClick={() => this.updateGuesses(answerIndex, questionIndex)}>
                      <img src={require("./img/" + item.images[answerIndex])} alt="img" className="answer-image rounded-circle mx-auto d-block w-100 my-3" />
                      <p style={{minHeight: '50px'}} className="text-center">{suggestion}</p>
                    </div>
                  )
                })
              }
            </div>
            <p className="pt-4 " style={{minHeight: '200px'}}>{item.results[this.state.guesses[questionIndex]]}</p>
            <div className="button mt-0 text-center">
              <button className={firstQuestion ? 'hidden' : 'btn btn-lg btn-blue mx-1' } onClick={this.prevQuestion}>
                Previous
              </button>

              {lastQuestion? (
                <input className={'btn btn-lg btn-green px-3'} disabled={!isAnswered} type="submit" value="Show me my exposure level" />
              ):(
                <button className={'btn btn-lg btn-green px-5'} disabled={!isAnswered} onClick={this.nextQuestion}>Next</button>
              )}

            </div>
          </div>
        </div>
      )
    });

    return (
      <div className="App container">
        <div className="row">
          <div className="col-12 col-md-8 mx-auto empty-sidebar" style={{minHeight: '80px'}}>
            {this.state.quizRunning   && <Sidebar totalExposure={this.state.totalExposureLevel} />  }
          </div>
          <form className="col-12 col-md-10 py-4 p-md-5 mx-auto" onSubmit={this.handleSubmit}>
            {this.state.quizRunning && eachQuiz}
            {this.state.welcome     && <Welcome language={this.state.langNr} startQuiz={this.startQuiz} />}
            {this.state.quizEnded   && <Final totalExposure={this.state.totalExposureLevel} allTips={this.state.myTips} language={this.state.langNr} />}
          </form>
          {this.state.welcome       && <Languages lang={this.state.langNr} mySelectLanguage={this.changeLanguage} />}
          <div className="col-12 my-3 text-center">
            <a href="https://www.iscapeproject.eu">
              <img src={require("./img/logo_iscape_grey.png")} style={{height: '90px'}} alt='place' />
            </a>
          </div>
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
  var showTips = props.allTips.map((tip, x) => {
    if (tip !== undefined && tip.length > 1) {
      return(
        <div className="row my-2" key={x}>
          <div className="col-2 text-right">
            <img src={require("./img/check.svg")} style={{height: '30px'}} alt='check' />
          </div>
          <div className="col-10 text-left">
            <span className="font-weight-bold">{tip}</span>
          </div>
        </div>
      )
    }else{
      return '';
    }
  });
  return(
    <div className="text-center">
      <h3 className="font-weight-bold mb-3">Your exposure level is: {props.totalExposure} </h3>
      <Meter rotate={false} meterExposureLevel={props.totalExposure} />
      <br />
      <p className="text-justify">{helper[lang].finaltips}</p>
      {/*<a href="." className="btn btn-blue">{helper[lang].quizagain}</a> */}
      <br />

      <div className="final-tips mb-3">
        {showTips}
      </div>

      {/*
      <button className="btn btn-lg btn-blue px-4 ">
        <img className="pr-2" src={require("./img/facebook.svg")} style={{height: '35px'}} alt='fb' />
        Share on facebook
      </button>
      */}

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
      <Cookie />
      <p id="gamepad-controller" style={{color: 'purple'}}></p>
      <div id="gamepad-info"></div>
    </div>
  )
}

function Cookie(){
  return (
    <p className="cookie pt-3">By clicking the button above, you accept this site will use cookies to collect data about your behavior while you play the quiz.</p>
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
    <div className="sidebar text-center">
      <div className="row mt-4">
        <div className="col-5 text-left">
          <p className="">Your exposure to air pollution:</p>
        </div>
        {/* <img alt="Exposure" src={require("./img/Exposure to air pollution.png")} className="w-75 my-3"/> */}
        <div className="col-4">
          <Meter rotate={false} meterExposureLevel={props.totalExposure} />
        </div>
        <div className="col-3 text-right">
          <p className="">Exposure Level: {props.totalExposure}</p>
        </div>
      </div>
    </div>
  )
}

function Meter(props){
  return (
    <div className="text-center w-75">
      <meter className={props.rotate? "meter rotate w-75" : "meter w-75"}
        min='0'
        max='45'
        optimum='0'
        low='13'
        high='20'
        style={{height: '25px'}}
        value={props.meterExposureLevel}></meter>
    </div>
  )
}

export {App};
export {Meter};
export {Questions};
export {Welcome};
