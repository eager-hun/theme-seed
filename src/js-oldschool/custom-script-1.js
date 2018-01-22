/**
 * @file
 * Custom script 1.
 */

if (typeof console === "undefined") {
  this.console = { log: function() {} };
}

(function() {
  "use strict";

  var logMsg = "Greetings from custom script 1.";
  console.log(logMsg);

  window.apSettings = window.apSettings || {};
  window.apSettings.testVariable = "testVariable works.";

})();
