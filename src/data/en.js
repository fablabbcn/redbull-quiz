export default [
  {
    question: 'Where do you live?',
    suggestions: ['I live in a house near a busy highway', 'I live in a house near a quiet lane'],
    results: [
      'Pollution is typically higher near busy highways since traffic is a major source of air pollution. 50% of vehicle emissions can also travel a distance of up to 150 meters from their source.  Consider planting a hedge row or asking your landlord to do it. A hedge row could act as a green barrier between you and vehicle emissions, this will help to reduce your exposure to air pollution on a daily basis.',
      'Great! Pollution is typically lower away from busy roads since traffic is a major source of air pollution.'
    ],
    images:[
      'House-near-busy-highway.png',
      'House-near-quiet-lane.png'
    ],
    danger: [4, 1]
  },
  {
    question: 'Which of this roads do you walk down more often?',
    suggestions: ['Stoke Road', 'Park Way'],
    results: [
      'Unfortunately pollution exposure is typically higher on Stoke Road compared to Park Way. This is because it has fewer hedges along the road side. Hedges can help to reduce air pollution by up to to 60%.  If you want to try and reduce your exposure to air pollution whist travelling around Guildford, try to walk down roads with hedges and trees next time you are out and about.',
      'Well Done!  Walking down Park Way exposes you to a lot less pollution than walking down Stoke Road. This is because the hedges at the side of the road help to reduce air pollution exposure by up to to  60%.  '
    ],
    images:[
      'Stoke-road-no-hedges.png',
      'Stoke-road-no-hedges.png'
    ],
    danger: [2, 5]
  },
  {
    question: 'Where would you as a pedestrian stand while waiting to cross at the traffic lights?',
    suggestions: ['Next to the curb, so I can start crossing right when it’s green', 'A few metres back from the curb'],
    results: [
      'Pollution is typically higher at the road edge but 20% of  vehicle emissions reduce within 10 meters back from the curb.  If you want to try and reduce your exposure to air pollution stand as far away from the curb as possible.  ',
      'Great!  Pollution is typically higher at the road edge but 20% of  vehicle emissions reduce within 10 meters back from the curb.  By standing as far back as you can from the edge of the road you can reduce your exposure to air pollution.  '
    ],
    images:[
      'Airport.png',
      'Car-window-closed.png'
    ],
    danger: [3, 6]
  }
]
/*
  images:[
    'Airport.png',
    'Car-window-closed.png'
'Car-window-open.png'
'Cycling-at-rush-hour.png'
  ],
  images:[

'Cycling-off-peak.png'
'Exposure to air pollution.png'
  ],
  images:[
'Idling-car.png'
'Non-Idling-car.png'
  ],
  images:[
'Park-road-with-hedges.png'
'PM-smaller-than-hair.png'
'PM-visible-in-smog.png'
  ],
  images:[
'Start-quiz.png'
'Traffic.png'
  ],
  images:[
'Waiting-few-meters-from-curb.png'
'Waiting-next-to-curb.png'
  ],
  */
