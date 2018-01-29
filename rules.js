var _ = require('lodash');

//convert face cards to something sortable
var count = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  'T': 10,
  'J': 11,
  'Q': 12,
  'K': 13,
  'A': 14
}


function sortCards(hand) {
  //maps cards to array and sorts the cards from highest to lowest value
  var sorted = Object.keys(valueCounter(hand)).sort(function(a,b) {
    if (count[a] > count[b]) {
      return -1;
    } else {
      return 1;
    }
  })
  return sorted;
}

function countCards(index, hand) {
  //find the count how much cards or suits are in the hand
  hand = hand.split(' ');
  var cardCount = {};
  for (var i = 0; i < hand.length; i++) {
    if (!cardCount[hand[i][index]]) {
      cardCount[hand[i][index]] = 1;
    } else {
      cardCount[hand[i][index]] += 1;
    }
  }
  return cardCount;
}

function highCard(hand) {
  //filter out pairs and find the highest card
  return sortCards(hand).filter(function (value) {
    return value !== pair(hand);
  });
}


var valueCounter = _.curry(countCards)(0);
//create a function that takes index as a parameter
  //at 0 it calculates for our card strength
  //at 1 it calculates for our suits
var countSuits = _.curry(countCards)(1);



function twoPair(hand) {
  var values = valueCounter(hand);

  //find the left pair
  var leftPair = _.findKey(values, _.curry(_.eq)(2));
  //find the right pair
  var rightPair = _.findLastKey(values, _.curry(_.eq)(2));
  if (leftPair && rightPair && leftPair !== rightPair) {
    //delete the pairs from our object
    delete values[leftPair];
    delete values[rightPair];

    var holder = Object.keys(values)[0];
    //sort our pairs
    var sorted = sortCards(leftPair + ' ' + rightPair)
    //push the remaining number last
    sorted.push(holder)

    return sorted;
  }
}


function anyKind(count, hand) {
  //finds the key with the count we're looking for
  var valueCount = valueCounter(hand);
  for (var key in valueCount) {
    if (valueCount[key] === count) {
      return key;
    }
  }
}

var pair = _.curry(anyKind)(2);
var three = _.curry(anyKind)(3);
var four = _.curry(anyKind)(4);


function flush(hand) {
//check for a flush
var hand = countSuits(hand);
  for (var key in hand) {
    if (hand[key] === 5) {
    return key;
    }
  }
}


function fullHouse(hand) {
  var values = valueCounter(hand);
  var set;
  var pair;

  for (var keys in values) {
    if (values[keys] === 3) {
      set = keys;
    } else if (values[keys] === 2) {
      pair = keys;
    }
  }
  //only if theres a set and a pair then return that fullhouse
  if ((set) && (pair)) {
    return [set, pair];
  }
}

function straight(hand) {
  //check for subsequence if it stays -1 4 times its a straight
  var sortedCards = highCard(hand);
  var num = 0;

  for (var i = 0; i < sortedCards.length; i++) {
    if ((count[sortedCards[i+1]]) - (count[sortedCards[i]]) === -1) {
      num++;
    }
  }
  if (num === 4) {
    return sortedCards
  }
  return false;
}

function straightFlush(hand) {
  //if theres a flush and a straight
  if (flush(hand)) {
    return straight(hand);
  }
}

function royalFlush(hand) {
  if (straightFlush(hand)) {
    //if top card is an ace its a royal flush
    if (straightFlush(hand)[0] === 'A') {
      return true
    }
  }
  return false;
}
//hand rankings goes from 0-9 to make sure the highest value is always grabbed first before going down


var ranking = [
  royalFlush,
  straightFlush,
  four,
  fullHouse,
  flush,
  straight,
  three,
  twoPair,
  pair,
  highCard
];


function handRanking(hand) {
//keep checking each function to find it's handStrength number
  for (var i = 0; i < ranking.length; i++) {
    if (ranking[i](hand)) {
      return i;
    }
  }
}

function findWinner(players) {
  //map the players hands in position [0] is player1 and [1] is player2
  var handStrengths = players.map(handRanking);
  //if both players hands aren't the same we can return the index of the strongest hand
  if (handStrengths[0] !== handStrengths[1]) {
    return handStrengths.indexOf(Math.min(...handStrengths));
  }
  //if theres a tie get the values of both of the hands
  var tiebreakers = players.map(ranking[handStrengths[0]]);

  //compare them directly from each other
  for (var i = 0; i < tiebreakers[0].length; i++) {
    if (count[tiebreakers[0][i]] > count[tiebreakers[1][i]]) {
      return 0
    } else if ((count[tiebreakers[0][i]] < count[tiebreakers[1][i]])) {
      return 1;
    }
  }


//absolute worst case scenario if both of their hands are still the same then we sort the cards, loop thru the values, and find the largest value
  var player1 = players[0];
  var player2 = players[1];


  var sort1 = sortCards(player1);
  var sort2 = sortCards(player2);
  for (var i = 0; i < sort1.length; i++) {
    if (count[sort1[i]] > count[sort2[i]]) {
      return 0
    } else if (count[sort1[i]] < count[sort2[i]]) {
      return 1;
    }
  }
}

module.exports = {
  handRanking: handRanking,
  findWinner: findWinner,
  highCard: highCard,
  pair: pair,
  twoPair: twoPair,
  three: three,
  straight: straight,
  flush: flush,
  fullHouse: fullHouse,
  four: four,
  straightFlush: straightFlush,
  royalFlush: royalFlush

};