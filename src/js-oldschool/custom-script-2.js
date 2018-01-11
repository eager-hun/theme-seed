/**
 * @file
 * Custom script 2.
 */

(function(window, document, undefined) {
  "use strict";

  var logMsg = "Greetings from custom script 2.";
  console.log(logMsg);

  console.log(window.apSettings.testVariable);

  // The intentionally missing semicolon can trigger a jshint error report.
  // var seeIfJshintWorks = "foo"

})(this, this.document);

