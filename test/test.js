var core        = require("rle-core")
  , components    = require("../components.js");

var shape = core.sampleSolid([-32, -32, -32], [32, 32, 32], function(x) {
  var s = Math.sin(x[0]) + Math.sin(x[1]) + Math.sin(x[2]);
  var b = Math.max(Math.abs(x[0]), Math.abs(x[1]), Math.abs(x[2]));
  return Math.max(s + 2.2, b - 9.9);
});

var labels = components.label(shape);
console.log(labels);

var components = components.split(shape, labels);
console.log(components);

