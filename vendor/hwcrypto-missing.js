/*
 Copyright 2015 SignWise Corporation Ltd.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

// Missing functions for using hwcrypto.js library

function checkEstIdPlugin(cb) {
  hwcrypto.use("chrome").then(function(result) {
    if (!result) {
      return tryNpapi();
    }
    hwcrypto.debug().then(function(result) {
      if (-1 !== result.indexOf('failing')) {
        return tryNpapi();
      }
      cb(true);
    });
  });
  function checkNavigatorPlugin(mimeType) {
    if (!navigator || !navigator.plugins) {
      return false;
    }
    for (var i = 0; i < navigator.plugins.length; i++) {
      if (navigator.plugins[i]['0'] && navigator.plugins[i]['0'].type === mimeType) {
        return true;
      }
    }
    return false;
  }
  function tryNpapi() {
    var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    if (!isChrome || checkNavigatorPlugin('application/x-digidoc')) {
      hwcrypto.use("npapi").then(cb);
    } else {
      cb(false);
    }
  }
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

function hex2char(hex) {
  hex = hex.match(/[0-9a-f]{2}/igm);
  if (!hex) { return ""; }

  hex = hex.map(function(el){
    return String.fromCharCode(parseInt(el,16));
  });
  return hex.join("");
}

function hex2b64(hex) {
  return btoa(hex2char(hex));
}

function toCertFormat(data) {
  data = hex2b64(data);
  var lineLength = 64;
  var result = "-----BEGIN CERTIFICATE-----\n";
  for (var i = 0; i < data.length; i += lineLength) {
    result += i >= data.length - lineLength ? data.substring(i) : data.substring(i, i + lineLength) + "\n";
  }
  result += "\n-----END CERTIFICATE-----";
  return result;
}