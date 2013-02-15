var $ = require("jquery-browserify");

var PALETTE = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
  [1, 1, 0],
  [1, 0, 1],
  [0, 1, 1],
  [1, 1, 1],
  [0, 0, 0],
  [1, 0.5, 0],
  [0.5, 1, 0],
  [0, 0.5, 1],
  [1, 0, 0.5],
  [0.5, 0, 1],
  [1, 0.5, 0],
  [0.3, 0.3, 0.3]
];

$(document).ready(function() { 
  var shape = require("rle-sample").solid.dense([-32, -32, -32], [32, 32, 32], function(x) {
    var s = Math.sin(x[0]) + Math.sin(x[1]) + Math.sin(x[2]);
    var b = Math.max(Math.abs(x[0]), Math.abs(x[1]), Math.abs(x[2]));
    return Math.max(s + 2.2, b - 9.9);
  });
  
  var components = require("../components.js").label(shape);
  for(var i=0; i<shape.length(); ++i) {
    if(components.labels[i] >= 0) {
      shape.phases[i] = components.labels[i] + 1;
    }
  }
  
  var mesh = require("rle-mesh")(shape);
  var faceColors = [];
  for(var i=0; i<mesh.cells.length; ++i) {
    faceColors.push(PALETTE[mesh.phases[i][0] % PALETTE.length]);
  }
  mesh.faceColors = faceColors;
  
  require("gl-shells").makeViewer().updateMesh(mesh);
  
});