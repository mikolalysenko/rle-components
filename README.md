rle-components
==============
Connected component labelling for narrowband level sets.  It is part of the [rle-* collection of libraries](https://github.com/mikolalysenko/rle-core) for processing narrow band level sets.


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

Here is the result:

<img src="https://raw.github.com/mikolalysenko/rle-components/master/images/components.png" width=40%>

You can try out a [demo in your browser](http://mikolalysenko.github.com/rle-components/examples/www/index.html).

`require("rle-components").label(volume[, link_func, solid_func])`
-----------------------------------------
This takes a narrowband level set as input and assigns labels to the components.

* `volume` is the level set we are labelling
* `link_func(a,b)` determines if two phases should be considered linked in the same component.  By default, always returns true.
* `solid_func(a)` determines if a phase should be included in the components.  By default, returns false for phase 0.

The result of calling the function is a `labelStruct` object which has the following properties:

* `count` The number of connected components
* `labels` An array of integers of length = `volume.length()` which gives the name of the connected component, starting at 0.  Not solid components are labeled -1.

`require("rle-components").split(volume[, labelStruct])`
--------------------------------------------------------
This splits a volume into a collection of volumes with different connected components.

* `volume` is the volume to split
* `labelStruct` (Optional) is the result of calling `label()` (see above) on the volume.  If not specified, `label` is called with the default arguments.

Returns an array of of volumes representing the different connected components of `volume`

Credits
=======
(c) 2013 Mikola Lysenko. BSD