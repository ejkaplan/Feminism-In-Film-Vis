var s = function(sketch) {

  sketch.preload = function() {

  }

  sketch.setup = function() {
    canvas = sketch.createCanvas(640, 480);
  }

  sketch.draw = function() {
    sketch.background(Math.random(255), Math.random(255), Math.random(255));
  }

}

var myp5 = new p5(s, "exploration-holder");