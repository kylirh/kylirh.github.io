function Scorecard() {
    var self = this;

    function getPoints(bowl) {
        return (!isNaN(parseFloat(bowl)) && isFinite(bowl)) ? bowl : 0;
    }

    function addFrame() {
        self.frames.push(new Frame());
        if (self.frames.length > 1) {
            self.frames[self.frames.length - 1].total = self.frames[self.frames.length - 2].total;
        }
    };

    function Frame() {
        var self = this;
        this.total = 0;
        this.bowls = [];
        this.scorable = false;

        this.addBowl = function(bowl) {
            self.bowls.push(bowl);
            self.total += getPoints(bowl);
        }
    }

    this.score = function(bowls) {
        self.frames = [];
        addFrame();

        for (var i = 0; i < bowls.length; i++) {
            var frame = self.frames[self.frames.length - 1];
            var bowl = bowls[i];
            frame.addBowl(bowl);

            if (self.frames.length > 9) {
                continue;
            }

            if (frame.bowls.length === 1) {
                // Strike
                if (bowl === 10) {
                    frame.total += getPoints(bowls[i + 1]) + getPoints(bowls[i + 2]);
                    addFrame();
                }
            }
            else {
                // Spare
                if (getPoints(bowls[i - 1]) + bowl === 10) {
                    frame.total += getPoints(bowls[i + 1]);
                }
                addFrame();
            }
        }

        return self.frames[self.frames.length - 1].total;
    };

    this.frames = [];
}

