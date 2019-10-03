import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import helper from './data/helper';
import en from './data/en';
import es from './data/es';
import ca from './data/ca';
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
      email: "",
      startDate: 0,
      totalQuestions: 0,
      totalExposureLevel: 0,
      quizRunning: false, // default false
      welcome: true, // default true
      quizEnded: false,
    };

    //console.log(this)

    this.changeEmail = this.changeEmail.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.submitEmail = this.submitEmail.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.prevQuestion = this.prevQuestion.bind(this);
    this.startQuiz = this.startQuiz.bind(this);
    this.updateGuesses = this.updateGuesses.bind(this);
  }

  componentDidMount(){

    var that = this;

    // Load gamepad controller
    var haveEvents = 'ongamepadconnected' in window;
    var controllers = {};

    function connecthandler(e) {
      document.getElementById('gamepad-controller').innerHTML = 'Gamepad Connected'
      addgamepad(e.gamepad);
    }

    function addgamepad(gamepad) {
      controllers[gamepad.index] = gamepad;

      var d = document.createElement("div");
      d.style.display = "none"; // Hide the controller debug window at the bottom
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

      // eslint-disable-next-line
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
      console.log('disconnect')
      document.getElementById('gamepad-controller').innerHTML = 'Gamepad disonnected'
      removegamepad(e.gamepad);
    }

    function removegamepad(gamepad) {
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
      //console.log('blue prev')
      that.prevQuestion();
    }, 50)

    var next_quest = debounce(function(){
      //console.log('green next')
      that.nextQuestion();
    }, 50)

    var debounce_guess0 = debounce(function(){
      //console.log('should debounce guess0')
      that.updateGuesses(0, that.state.currentQuestion)
    }, 50)

    var debounce_guess1 = debounce(function(){
      //console.log('should debounce guess1')
      that.updateGuesses(1, that.state.currentQuestion)
    }, 50)

    var debounce_guess2 = debounce(function(){
      //console.log('should debounce guess0')
      that.updateGuesses(2, that.state.currentQuestion)
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
            if (i === 7) {
              debounce_guess0();
            }
            if (i === 8) {
              debounce_guess1();
            }
            if (i === 9) {
              debounce_guess2();
            }
            console.log(i)
            if (i === 11) {
              prev_quest();
            }

            if (i === 10) {
              next_quest();
            }

            // restart with both buttons
            if (controller.buttons[10].value === 1 && controller.buttons[11].value === 1){
              window.location.reload();
            }
          }
        }

        var axes = d.getElementsByClassName("axis");
        for (i = 0; i < controller.axes.length; i++) {
          var a = axes[i];
          a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
          a.setAttribute("value", controller.axes[i] + 1);

          if (controller.axes[1] === 1){
            //console.log('left windows');
            debounce_guess0();
          }
          if (controller.axes[1] === -1){
            //console.log('right windows');
            debounce_guess1();
          }

          if (controller.axes[0] === 1){
            //console.log('down');
            debounce_guess0();
          }
          if (controller.axes[0] === -1){
            //console.log('up');
            debounce_guess1();
          }

          // Only on Chrome (Linux)
          if (controller.axes[2] === 1){
            //console.log('left');
            debounce_guess0();
          }
          if (controller.axes[2] === -1) {
            //console.log('right');
            debounce_guess1();
          }

          // Firefox uses a different object for the Axes
          if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){

            if (controller.axes[3] === -1) {
              //console.log('left Firefox')
              debounce_guess0();
            }
            if (controller.axes[3] === 1) {
              //console.log('right Firefox')
              debounce_guess1();
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

  }

  changeEmail(event){
    this.setState({email: event.target.value.toLowerCase()})
  }

  changeLanguage(e){
    //console.log(e);
    // TODO: why can we not simply use the following line?
    //this.setState({ language: e.target.value})
    // Which makes the rest unneccessary
    switch (e) {
      case 'en':
        this.setState({ language: en, langNr: 0 })
        break;
      case 'es':
        this.setState({ language: es, langNr: 1 })
        break;
      case 'ca':
        this.setState({ language: ca, langNr: 2 })
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
    console.log('handle submit');

    this.setState({quizEnded: true, quizRunning: false});
    this.updateExposureLevel();
    this.updateTips();

    // Logger sends 4 items, startTime, endTime, score, and guesses
    this.logger(this.state.startDate, new Date().getTime(), this.state.totalExposureLevel, this.state.guesses);

    ReactGA.event({
      category: 'User',
      action: 'Finished quiz',
      label: 'Submit final exposure: ' + this.state.totalExposureLevel,
      dimension1: this.state.totalExposureLevel,
      dimension2: this.state.guesses
    });
  }

  submitEmail(e){
    if(e){
      e.preventDefault();
    }
    if (window.location.hostname === 'localhost') {
      fetch('http://localhost:8000/email', {
        method: 'POST',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: this.state.email,
        })
      })
    }
    window.location.reload();
  }

  logger(startTime, endTime, totalExp, guesses){
    if (window.location.hostname === 'localhost') {
      fetch('http://localhost:8000/logs', {
        method: 'POST',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startTime: startTime,
          endTime: endTime,
          totalExp: totalExp,
          guesses: guesses
        })
      })
    }
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

    // If final question, show the Final exposure level
    if (this.state.currentQuestion === this.state.totalQuestions - 1){
      this.handleSubmit();
    }

    // Increment
    if(this.state.currentQuestion < this.state.totalQuestions){
      this.setState({currentQuestion: this.state.currentQuestion + 1})
      this.playSound('button');
    }

    ReactGA.event({
      category: 'User',
      label: 'Next question: ' + (this.state.currentQuestion + 2),
      action: 'Next question'
    });
  }

  playSound(filename){
    //console.log('I should play soundfile:', filename, '.wav');
    var audio = new Audio(require("./audio/" + filename + ".wav"));
    audio.play();
  }

  prevQuestion(e){
    if (e){
      e.preventDefault();
    }
    // Don't allow us to go back if we are at the endpage
    if (this.state.currentQuestion === this.state.totalQuestions) {
      return;
    }

    if(this.state.currentQuestion > 0){
      this.setState({currentQuestion: this.state.currentQuestion - 1})
      this.playSound('pop');
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

    this.playSound('coin');

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
      startDate: new Date().getTime(),
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
            <h3 style={{minHeight: '68px'}} className="text-blue text-center">{questionIndex + 1}. {item.question} </h3>
            <div className="row suggestions text-uppercase mt-4">
              {
                item.suggestions.map((suggestion, answerIndex) => {
                  return (
                    <div key={answerIndex} className="col-md-4 text-center"
                      onClick={() => this.updateGuesses(answerIndex, questionIndex)}>
                      <div className={(answerIndex === this.state.guesses[questionIndex] ? 'selected-answer' : "unselected") + " color-" + answerIndex}>
                        <img src={require("./img/" + item.images[answerIndex])} alt="img" className="answer-image img-fluid " />
                        <p style={{minHeight: '50px'}} className="mt-4">{suggestion}</p>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <p className="pt-5 font-weight-bold" style={{minHeight: '200px'}}>{item.results[this.state.guesses[questionIndex]]}</p>
            <div className="button mt-0 text-center">
              <button className={firstQuestion ? 'hidden' : 'btn btn-lg btn-orange mx-3' } onClick={this.prevQuestion}>
                Previous
              </button>

              {lastQuestion? (
                <input className={'btn btn-lg btn-gray px-3'} disabled={!isAnswered} type="submit" value="FINISH" />
              ):(
                <button className={'btn btn-lg btn-gray px-5'} disabled={!isAnswered} onClick={this.nextQuestion}>Next</button>
              )}

            </div>
          </div>
        </div>
      )
    });

    return (
      <div className="App container">
        <div className="row">
          <div className="col-10 mx-auto mt-3" style={{minHeight: '50px'}}>
            {this.state.quizRunning   && <Sidebar totalExposure={this.state.totalExposureLevel} />  }
          </div>
          <div className="col-md-10 py-4 p-md-5 mx-auto bg-white">
            <form onSubmit={this.handleSubmit}>
              {this.state.quizRunning && eachQuiz}
              {this.state.welcome     && <Languages lang={this.state.langNr} mySelectLanguage={this.changeLanguage} />}
              {this.state.welcome     && <Welcome language={this.state.langNr} startQuiz={this.startQuiz} />}
            </form>
            {this.state.quizEnded   &&
                <div>
                  <Final totalExposure={this.state.totalExposureLevel} allTips={this.state.myTips} language={this.state.langNr} />
                  <form onSubmit={this.submitEmail}>
                    <div className="input-group justify-content-center mt-4">
                      <input autofocus="autofocus" required className="text-center" type="text" name="email" value={this.state.email} onChange={this.changeEmail}  placeholder="Email address here.." />
                      <div class="input-group-append">
                        <input className='btn btn-gray' type="submit" value="Submit Email" />
                      </div>
                    </div>
                  </form>
                </div>
            }
          </div>
          <div className="col-12 my-3 text-center">
            <a href="https://www.redbull.com">
              <img src={require("./img/vvalue_logo.png")} style={{height: '90px'}} alt='place' />
            </a>
          </div>
        </div>
      </div>
    )
  }
}

function Languages(props){
  return(
    <div className="row justify-content-between mb-5 text-center">
      <div className={(props.lang === 0 ? "selected-lang" : '') + " col-3"} value="es" onClick={() => props.mySelectLanguage('en')}>
        <img className="img-fluid" src={require("./img/britain.svg")} alt='English' />
        English
      </div>
      <div className={(props.lang === 1 ? "selected-lang" : '') + " col-3"} value="es" onClick={() => props.mySelectLanguage('es')}>
        <img className="img-fluid" src={require("./img/spain-flag-small.png")} alt='English' />
        Espanol
      </div>
      <div className={(props.lang === 2 ? "selected-lang" : '') + " col-3"} value="ca" onClick={() => props.mySelectLanguage('ca')}>
        <img className="img-fluid" src={require("./img/catalunya.svg")} alt='English' />
        Catalan
      </div>
    </div>
  )
}

function Final(props) {
  let lang = props.language;
  let finalExposureText = 'medium';
  let finalExposureColor = 'orange';

  if (props.totalExposure < 3) {
    finalExposureText = 'low'
    finalExposureColor = 'green';
  }
  if (props.totalExposure > 4) {
    finalExposureText = 'high'
    finalExposureColor = 'red';
  }
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
      <h3 className="font-weight-bold mb-3">{helper[lang].score}: {props.totalExposure}
      </h3>
      <br />
      <p className="mt-4">{helper[lang].finaltips}</p>
      <br />
      <p className="mt-4">{helper[lang].quizagain}</p>

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
      <p className="my-5">{helper[lang].p2}</p>
      <p>{helper[lang].click_image}</p>
      <br />
      <button className="btn btn-lg btn-gray px-5 my-2" onClick={props.startQuiz}>{helper[lang].startquiz}</button>
      <p id="gamepad-controller" style={{color: 'purple'}}></p>
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
    <div className="text-center">
      <p>Your score is: {props.totalExposure}</p>
    </div>
  )
}

function Meter(props){
  return (
    <div className="mx-auto w-75">
      <meter className={props.rotate? "meter rotate w-75" : "meter w-75"}
        min='0'
        max='6'
        optimum='0'
        low='2'
        high='4'
        style={{height: '25px'}}
        value={props.meterExposureLevel}></meter>
    </div>
  )
}

export {App};
export {Meter};
export {Questions};
export {Welcome};
