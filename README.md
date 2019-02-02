# Air pollution Quiz for the iSCAPE project.

[![DOI](https://zenodo.org/badge/119367584.svg)](https://zenodo.org/badge/latestdoi/119367584)

More about iScape:

https://www.iscapeproject.eu/

https://www.iscapeproject.eu/about/

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

**Guesses** is an array of the question answered.
For example:
* [1,1,1,1] if you only answered 4 questions, always the later answer. 
* [0,0,1] if you only answered 3 questions, first 2 questions the first answer, and the third question the later answer. 

## Funding

This work has received funding from the European Union's Horizon 2020 research and innovation program under the grant agreement [No. 689954](https://cordis.europa.eu/project/rcn/202639_en.html)

