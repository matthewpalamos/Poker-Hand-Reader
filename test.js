var poker = require('./rules.js');
var should = require('should');

describe('poker', function () {

  it('should find a royal flush', function () {
    poker.royalFlush('AD KD JD QD TD').should.eql(true);
  });

  it('should find a straight flush', function () {
    poker.straightFlush('4H 3H 6H 5H 7H').should.eql([ '7', '6', '5', '4', '3']);
  });

  it('should find a 4 of a kind', function () {
    poker.four('9D 9S KH 9H 9C').should.eql('9');
  });

  it('should find a full house', function () {
    poker.fullHouse('2H 2D 4C 4D 4S').should.eql([ '4', '2' ]);
    poker.fullHouse('3C 3D 3S 9S 9D').should.eql(['3', '9']);
  });


  it('should find a flush', function () {
    poker.flush('3D 6D 7D TD QD').should.eql('D');
  });

   it('should find a straight', function () {
    poker.straight('8D 6C 5S 7H 4S').should.eql(['8','7','6','5','4']);
  });

  it('should find three of a kind', function () {
    poker.three('2D 9C AS AH AC').should.eql('A');
  });

  it('should find 2 pair', function () {
    poker.twoPair('3H 9C 9S 2D 3D').should.eql(['9', '3', '2']);
    poker.twoPair('7S 8H 8C KH KS').should.eql(['K', '8', '7']);
  });

   it('should find a pair', function () {
    poker.pair('KC 6H 9H 9S 2C').should.eql('9');
    poker.pair('AS 2D 3D 4D AH').should.eql('A');
  });


  it('should find the high card', function () {
    poker.highCard('5D 8C 9S JS AC').should.eql(['A', 'J', '9', '8', '5' ]);
    poker.highCard('2C 5C 7D 8S QH').should.eql(['Q', '8', '7', '5', '2' ] );
  });

  it('should find the highest card that isnt a pair', function() {
      poker.highCard('4D 6S 9H QH QC').should.eql(['9', '6', '4' ]);
      poker.highCard('3D 6D 7H QD QS').should.eql(['7', '6', '3' ]);
  })

});