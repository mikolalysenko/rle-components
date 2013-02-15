var UnionFind          = require("union-find");
var core               = require("rle-core");
var stencils           = require("rle-stencils");
var repair             = require("rle-repair");
var DEFAULT_SOLID_FUNC = new Function("p", "return !!p;");
var DEFAULT_LINK_FUNC  = new Function("a", "b", "return true;");

//Extracts all connected components of the volume
function labelConnectedComponents(volume, link_func, solid_func) {
  if(!link_func) {
    link_func = DEFAULT_LINK_FUNC;
  }
  if(!solid_func) {
    solid_func = DEFAULT_SOLID_FUNC;
  }
  var len = volume.length();
  
  //First assign labels
  var forest = new UnionFind(len);
  for(var iter=core.beginStencil(volume, stencils.CUBE_STENCIL); iter.hasNext(); iter.next()) {
    var a = volume.phases[iter.ptrs[0]];
    if(!solid_func(a)) {
      continue;
    }
    for(var i=1; i<8; ++i) {
      var b = volume.phases[iter.ptrs[i]];
      if(!solid_func(b)) {
        continue;
      }
      if(link_func(a, b)) {
        forest.link(iter.ptrs[0], iter.ptrs[i]);
      }
    }
  }
  //Then mark components using labels
  //HACK: Reuse rank array for labels
  var clabels          = forest.ranks
    , root2label       = []
    , component_count  = 0;
  for(var i=0; i<len; ++i) {
    if(!solid_func(volume.phases[i])) {
      clabels[i] = -1;
      continue;
    }
    var root = forest.find(i);
    if(root in root2label) {
      clabels[i] = root2label[root];
    } else {
      root2label[root] = component_count;
      clabels[i] = component_count;
      component_count++;
    }
  }
  return {
      count: component_count
    , labels: clabels
  }
}
exports.label = labelConnectedComponents;

//Extracts all components.  label_struct is the result of running labelComponents
// and is reused if possible
function splitConnectedComponents(volume, label_struct) {
  if(!label_struct) {
    label_struct = labelConnectedComponents(volume);
  }
  var count       = label_struct.count
    , labels      = label_struct.labels
    , components  = new Array(count);
  for(var i=0; i<count; ++i) {
    components[i] = new core.DynamicVolume();
  }
  for(var iter=core.beginStencil(volume, stencils.CROSS_STENCIL); iter.hasNext(); iter.next()) {
    var idx = iter.ptrs[0];
    var label = labels[idx];
    var phase = volume.phases[idx];
    var distance = volume.distances[idx];
    if(label < 0) {
      for(var i=1; i<7; ++i) {
        if(labels[iter.ptrs[i]] >= 0) {
          components[labels[iter.ptrs[i]]].push(iter.coord[0], iter.coord[1], iter.coord[2], distance, 0);
        }
      }
    } else {
      components[label].push(iter.coord[0], iter.coord[1], iter.coord[2], distance, phase);
    }
  }
  for(var i=0; i<count; ++i) {
    components[i] = repair.removeDuplicates(components[i]);
  }
  return components;
}
exports.split = splitConnectedComponents;
