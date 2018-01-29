var poker =  require('./rules.js');
var fs = require('fs');
//there is always one winner


fs.readFile('poker.txt', 'utf8', (err, data) => {
  if (err) {
    throw err;
  }
  //read poker text file
  var p1 = 0;
  var arr = data.split('\n')
  //split by spacing
  for (var i = 0; i < arr.length; i++) {
    //split by first and 2nd player
    var player1 = arr[i].split(' ').slice(0, 5).join(' ');
    var player2 = arr[i].split(' ').slice(5, arr.length - 1).join(' ');
    var evaluate = [player1, player2];

    if (poker.findWinner(evaluate) === 0) {
      //if it's 0 player 1 is winner if it's 1 player 2 is winner
      p1 += 1
    }
  }

  console.log('player1 won ' + p1 + ' times');
  return p1;
})

