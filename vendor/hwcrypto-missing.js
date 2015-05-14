// Missing functions for using hwcrypto.js library

function checkEstIdPlugin(cb) {
  hwcrypto.use("chrome").then(function(result) {
    if (result) {
      hwcrypto.debug().then(function(result) {
        if (-1 !== result.indexOf('failing')) {
          hwcrypto.use("npapi").then(cb);
          return;
        }
        cb(true);
      });
      return;
    }
    hwcrypto.use("npapi").then(cb);
  });
}

function _hex2array(str) {
  if (typeof str == "string") {
    var ret = new Uint8Array(Math.floor(str.length / 2));
    var i = 0;
    str.replace(/(..)/g, function(str) {
      ret[i++] = parseInt(str, 16);
    });
    return ret;
  }
}

function _array2hex(args) {
  var ret = "";
  for (var i = 0; i < args.length; i++) ret += (args[i] < 16 ? "0" : "") + args[i].toString(16);
  return ret;
}