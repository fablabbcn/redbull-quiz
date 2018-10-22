# Air pollution Quiz for the iSCAPE project.

More about iScape:

https://www.iscapeproject.eu/

https://www.iscapeproject.eu/about/


## TODO:
- [x] Google analytics
- [ ] Instruction on the page, mention keyboard shortcuts
- [x] Favicon

## Features
Keyboard shortucts:
* 's' for **S**tart quiz
* '1' for guessing answer nr 1
* '2' for guessing answer nr 2
* 'n' for **N**ext
* 'p' for **P**rev
* 'f' for **F**inish (Submit)

## Joystick
You can use a joystick to select between answers (left - right)

Blue button: PREVIOUS
Green button: NEXT

Both buttons: RESTART QUIZ

![Joystick setup](https://github.com/fablabbcn/iscape-air-pollution-quiz/blob/master/IMG_20180418_164213.jpg "Joystick setup")


### Development

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

1. Install dependencies with
  `yarn`

2. Start development with:
  `yarn start`

3. Deploy to Github Pages with:
  `yarn deploy`

4. If the repository is changed, check `package.json` if the following url matches "homepage:"

  "homepage": "http://quiz.iscape.smartcitizen.me/",

## Offline
To run offline, and to run with a logger do

`npm run logger`

Whenever someone finishes a quiz in offline mode, it is logged to a file called `log.txt` on `/home/pi` (on a Raspberry PI)

The format of `log.txt` is:

**StartTime, EndTime, TotalExposure, Guesses**
