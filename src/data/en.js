export default [
  {
    question: 'Where do you live?',
    suggestions: [
      'I live in a house near a busy highway',
      'I live in a house near a quiet lane'
    ],
    results: [
      'Pollution is typically higher near busy highways since traffic is a major source of air pollution. 50% of vehicle emissions can also travel a distance of up to 150 meters from their source. Consider planting a hedge row or asking your landlord to do it. A hedge row could act as a green barrier between you and vehicle emissions, this will help to reduce your exposure to air pollution on a daily basis.',
      'Great! Pollution is typically lower away from busy roads since traffic is a major source of air pollution.'
    ],
    tips:[
    'Consider planting a hedge row or asking your landlord to do it.',
    '',
    ],
    images:[
      'House-near-busy-highway.png',
      'House-near-quiet-lane.png'
    ],
    danger: [4, 1]
  },
  {
    question: 'What kind of road do you walk down most often?',
    suggestions: [
      'On pavements close to traffic, e.g. Woodbridge Road',
      'On pavements behind hedges e.g. Shalford Road'
    ],
    results: [
      'Unfortunately pollution exposure is typically higher on these roads compared to roads with hedges. This is because it has fewer hedges along the roadside. Hedges can help to reduce air pollution by up to 60%. If you want to try and reduce your exposure to air pollution whilst travelling around Guildford, try to walk down roads with hedges and trees next time you are out and about. ',
      'Great!  Walking down a road behind hedges exposes you to a lot less pollution than walking down a road where the pavement is close to traffic. This is because the hedges at the side of the road can help to reduce air pollution exposure by up to to 60%. '
    ],
    tips:[
    'Try to walk down roads with hedges and trees next time you are out and about. ',
    '',
    ],
    images:[
      'Stoke-road-no-hedges.png',
      'Park-road-with-hedges.png'
    ],
    danger: [3, 1]
  },
  {
    question: 'Where are you most likely to stand while waiting to cross at the traffic lights?',
    suggestions: [
      'Next to the curb, so I can start crossing right when it’s green',
      'A few metres back from the curb'
    ],
    results: [
      'Pollution is typically higher at the road edge but 20% of vehicle emissions reduce within 10 meters back from the curb.  If you want to try and reduce your exposure to air pollution stand as far away from the curb as possible.  ',
      'Great!  Pollution is typically higher at the road edge but 20% of vehicle emissions reduce within 10 meters back from the curb.  By standing as far back as you can from the edge of the road you can reduce your exposure to air pollution.  '
    ],
    tips:[
    'Try to stand as far away from the curb as possible.',
    '',
    ],
    images:[
      'Waiting-next-to-curb.png',
      'Waiting-few-meters-from-curb.png'
    ],
    danger: [5, 3]
  },
  {
    question: 'When are you most likely to go cycling?',
    suggestions: [
      'Rush hour (roughly between 6-10am and 4-8pm',
      'Off-peak'
    ],
    results: [
      'Unfortunately you are likely to be exposed to higher levels of air pollution at this time of day. Air pollution is highest during the morning rush hours between 7-10am and evening rush hours between 4-7pm. If you can manage to travel during off-peak hours instead (10 am - 4 pm) it will not only reduce you exposure to pollution but your journey time too!',
      'Well done! Given a choice, commuting during the off-peak hours (10am - 4pm) could help reduce journey time and pollution exposure.'
    ],
    tips:[
    'Try to travel during off-peak hours',
    '',
    ],
    images:[
      'Cycling-at-rush-hour.png',
      'Cycling-off-peak.png'
    ],
    danger: [5, 2]
  },
  {
    question: 'When stopped in heavy traffic, do you prefer to have your car windows open or closed?',
    suggestions: [
      'Open',
      'Closed'
    ],
    results: [
      'Unfortunately this is not such a great idea. Leaving your car window open lets in a lot of harmful pollutants that can cause respiratory problems.',
      'Closing your windows reduces your exposure to air pollution. You should also change the air conditioning settings to reduce external intake and instead recirculate the air inside the car. '
    ],
    tips:[
    'Try closing your car window',
    '',
    ],
    images:[
      'Car-window-open.png',
      'Car-window-closed.png'
    ],
    danger: [5, 1]
  },
  {
    question: 'When stopping briefly in your car, for example, when picking someone up at the school gates or stopped in traffic, what do you do?',
    suggestions: [
      'I tend to leave the car running as I’m only stopping for a short time',
      'I always switch the motor off when stationary, even if it’s only briefly'
    ],
    results: [
      'An idling engine can produce up to twice as many exhaust emissions as an engine in motion.  If you want to try and reduce your emissions, switch off the motor while you wait.  ',
      'Great!  An idling engine can produce up to twice as many exhaust emissions as an engine in motion, so it’s best to switch it off when stopped.'
    ],
    tips:[
    'Switch off the motor while you wait',
    '',
    ],
    images:[
      'Idling-car.png',
      'Non-Idling-car.png'
    ],
    danger: [5, 1]
  },
  {
    question: 'Which of the following is a bigger cause of air pollution in Guildford?',
    suggestions: [
      'Airport',
      'Traffic'
    ],
    results: [
      'That’s not quite right - even though Guildford is in relatively close proximity to both Heathrow and Gatwick airport, the main cause of pollution is the amount of traffic in and around the city centre.',
      'Correct! Even though Guildford is in relatively close proximity to both Heathrow and Gatwick airport, the main cause of pollution is the amount of traffic in and around the city centre.'
    ],
    tips:[
    '',
    '',
    ],
    images:[
      'Airport.png',
      'Traffic.png'
    ],
    danger: [1, 3]
  },
  {
    question: 'A common pollutant is Particulate Matter (PM). How visible do you think this is in the air we breathe?',
    suggestions: [
      'It’s a large dust particle and can be found only in visible air pollution e.g. smog.',
      'Some types of PM are smaller than a human hair and are invisible to the naked eye.'
    ],
    results: [
      'Unfortunately that’s not correct. Although, particulate matter includes those particles found in visible air pollution such as smog, some types of PM are much smaller than a human hair and are invisible to the naked eye. They come from a number of natural and manmade sources including road dust, construction sites and burning wood or fossil fuels. These particles can be harmful to people and cause serious health problems. Particles less than 10 micrometers in diameter (x% of a human hair) pose the greatest problems, because they can get deep into your lungs, and some may even get into your bloodstream…',
      'Well done! Some types of Particulate Matter are much smaller than a human hair and are invisible to the naked eye. They come from a number of natural and manmade sources including road dust, construction sites and burning wood or fossil fuels. These particles can be harmful to people and cause serious health problems. Particles less than 10 micrometers in diameter (x% of a human hair) pose the greatest problems, because they can get deep into your lungs, and some may even get into your bloodstream… '
    ],
    tips:[
    '',
    '',
    ],
    images:[
      'PM-visible-in-smog.png',
      'PM-smaller-than-hair.png'
    ],
    danger: [3, 1]
  }

]
