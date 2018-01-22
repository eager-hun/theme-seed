/**
 * @file
 * Custom script 2.
 */

(function() {
  "use strict";

  var logMsg = "Greetings from custom script 2.";
  console.log(logMsg);

  console.log(window.apSettings.testVariable);

  var interpolateString = '---> works';
  var es6template = `ESNext transcompiler ${interpolateString}.`;
  console.log(es6template);

})();

