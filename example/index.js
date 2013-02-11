var $           = require("jquery-browserify")
  , core        = require("rle-core")
  , mesh        = require("rle-mesh")
  , topology    = require("../index.js");

$(document).ready(function() {
  //Create viewer
  var viewer = require("gl-shells").makeViewer();
 
  var shape = core.sampleSolid([-32, -32, -32], [32, 32, 32], function(x) {
    var s = Math.sin(x[0]) + Math.sin(x[1]) + Math.sin(x[2]);
    var b = Math.max(Math.abs(x[0]), Math.abs(x[1]), Math.abs(x[2]));
    return Math.max(s + 2.2, b - 9.9);
  });
  
  var components = topology.split(shape);
  
  //Draw initial mesh
  viewer.updateMesh(mesh(shape));
});