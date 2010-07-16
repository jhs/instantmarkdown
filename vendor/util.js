// From http://stackoverflow.com/questions/130404/javascript-data-formatting-pretty-printer/130504#130504
function DumpObjectIndented(obj, indent) {
  var result = "";
  if (indent == null) indent = "";

  for (var property in obj) {
    var value = obj[property];
    if (typeof value == 'string')
      value = '"' + value + '"';
    else if (typeof value == 'object') {
      if (value instanceof Array) {
        // Just let JS convert the Array to a string!
        value = "[ " + value + " ]";
      } else {
        var od = DumpObjectIndented(value, indent + "  ");
        value = "{\n" + od + "\n" + indent + "}";
        //value = "\n" + indent + "{\n" + od + "\n" + indent + "}";
      }
    }
    result += indent + '"' + property + '": ' + value + ",\n";
  }

  return result.replace(/,\n$/, "");
};
 
exports.dir = function(obj) {
  return "{\n" + DumpObjectIndented(obj, '  ') + "}";
};

exports.typeOf = function(value) {
  var s = typeof value;
  if (s === 'object') {
    if (value) {
      if (value instanceof Array) {
        s = 'array';
      }
    } else {
      s = 'null';
    }
  }
  return s;
}

// Return whether the parameter is actually an associative array.
exports.is_hash = function(obj) {
  return exports.typeOf(obj) == 'object';
}
