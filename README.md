rle-components
==============
Connected component labelling for narrowband level sets.


Usage/Installation
==================
First, install the package using npm:

    npm install rle-components
    
Then you can use the library to split a level set into its connected components.  For example:

    //First create a volume
    var volume = require("rle-sample").solid.dense([-32, -32, -32], [32, 32, 32], function(x) {
      var s = Math.sin(x[0]) + Math.sin(x[1]) + Math.sin(x[2]);
      var b = Math.max(Math.abs(x[0]), Math.abs(x[1]), Math.abs(x[2]));
      return Math.max(s + 2.2, b - 9.9);
    });
    
    //Then split into separate components
    var components = require("rle-components").split(volume);

Here is the result



Credits
=======
(c) 2013 Mikola Lysenko. BSD