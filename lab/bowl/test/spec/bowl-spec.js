describe("The Bowling Calculator", function() {
    var scorecard;

    beforeEach(function() {
        scorecard = new Scorecard();
    });

    it("can correctly score a mediocre game without strikes or spares (like one that Kylir would bowl)", function() {
        var bowls = [5,4, 6,2, 3,3, 4,1, 0,2, 1,1, 3,6, 0,0, 2,3, 8,1];
        expect(scorecard.score(bowls)).toEqual(55);
    });

    it("correctly scores a partial game", function() {
        var bowls = [5,4, 6,2, 3];
        expect(scorecard.score(bowls)).toEqual(20);
    });

    it("can score a game of all spares and two gutter balls", function() {
        var bowls = [5,5, 5,5, 5,5, 5,5, 5,5, 5,5, 5,5, 5,5, 5,5, 0,0];
        expect(scorecard.score(bowls)).toEqual(130);
    });

    it("can score a game of all spares", function() {
        var bowls = [5,5, 5,5, 5,5, 5,5, 5,5, 5,5, 5,5, 5,5, 5,5, 5,5,10];
        expect(scorecard.score(bowls)).toEqual(155);
    });

    it("can score a game of all strikes and two gutter balls", function() {
        var bowls = [10, 10, 10, 10, 10, 10, 10, 10, 10, 0,0];
        expect(scorecard.score(bowls)).toEqual(240);
    });

    it("can score a game of all strikes", function() {
        var bowls = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10,10,10];
        expect(scorecard.score(bowls)).toEqual(300);
    });

    it("can score a game with a mix of spares and strikes", function() {
        var bowls = [10, 7,3, 9,0, 10, 0,8, 8,2, 0,6, 10, 10, 10,8,1];
        expect(scorecard.score(bowls)).toEqual(167);
    });

    it("can score a game of 100% gutter balls", function() {
        var bowls = [0,0, 0,0, 0,0, 0,0, 0,0, 0,0, 0,0, 0,0, 0,0, 0,0];
        expect(scorecard.score(bowls)).toEqual(0);
    });

    it("can score a game with fouls in it", function() {
        var bowls = [10, 7,3, 9,0, 10, 0,8, 8,2, "F",6, 10, 10, 10,8,1];
        expect(scorecard.score(bowls)).toEqual(167);
    });
});
