// Initialize the game.
$(function() {
     // Initialize the three different "steering" states.
     history.replaceState(dash.left, "LEFT!", "index.htm#left");
     history.pushState(dash.straight, "The Derby Dash!");
     history.pushState(dash.right, "RIGHT!", "index.htm#right");

     // Make sure the history state is in the right place (Going straight) and wire up the onpopstate event handler.
     // TODO: Figure out if you are on a right or left turn (by possibly navigating backwards from a "future" page or starting from a bookmark)
     history.back();
     onpopstate = dash.popState;

     // Draw the initial map.
     dash.drawMap();
     $("#advance").click(dash.advance);
});

// The dash namespace.
var dash = {};

// The three types of driving actions.
dash.left = 1;
dash.straight = 2;
dash.right = 3;

// The inital position of the car.
dash.x = 5;
dash.y = 0;
dash.vision = 8;

// Handles when the back/forward button is pressed.
dash.popState = function(event) {
     if (event.state === dash.left)
          dash.goLeft();
     else if (event.state === dash.right)
          dash.goRight();
}

// Handles turning left.
dash.goLeft = function() {
     $("#log").append("LEFT!<br />");
     history.forward();
}

// Handles turning right.
dash.goRight = function() {
     $("#log").append("RIGHT!<br />");
     history.back();
}

dash.renderTile = function(definition) {
     return "<span>" + definition + "</span>";
}

dash.drawMap = function() {
     // Reset the map tiles.
     var tiles = "";

     // Render the tiles from the map definition.
     for (var i = dash.map.length - (dash.y + dash.vision), limit = dash.map.length - (dash.y + 1); i < limit; i++) {
          for (var j = 0; j < dash.map[i].length; j++) {
               tiles += dash.renderTile(dash.map[i][j]);
          }
          tiles += "<br />";
     }

     // Put the rendered map into the DOM.
     $("#map").empty().append(tiles);
}

dash.advance = function() {
     dash.y++;
     dash.drawMap();
}

dash.map = [
     ["D", "*", "*", "*", "S", "*", "*", "*", "D"],
     ["D", "*", "*", "*", "S", "*", "*", "*", "D"],
     ["D", "*", "*", "*", "S", "*", "*", "*", "D"],
     ["D", "*", "*", "*", "S", "*", "*", "*", "D"],
     ["D", "*", "*", "*", "S", "*", "*", "*", "D"],
     ["D", "*", "*", "*", "S", "*", "*", "*", "D"],
     ["D", "|", "*", "*", "S", "*", "*", "|", "D"],
     ["D", "|", "*", "*", "S", "*", "*", "|", "D"],
     ["D", "|", "*", "*", "*", "*", "*", "|", "D"],
     ["D", "|", "*", "*", "*", "*", "*", "|", "D"],
     ["D", "\\", "*", "*", "*", "*", "*", "|", "D"],
     ["D", "D", "|", "*", "*", "*", "*", "|", "D"],
     ["D", "D", "|", "*", "*", "*", "*", "|", "D"],
     ["D", "D", "|", "*", "*", "*", "*", "|", "D"],
     ["D", "D", "\\", "*", "*", "*", "*", "/", "D"],
     ["D", "D", "D", "|", "*", "*", "|", "D", "D"],
     ["D", "D", "D", "|", "*", "*", "|", "D", "D"],
     ["D", "D", "D", "|", "*", "*", "|", "D", "D"],
];
