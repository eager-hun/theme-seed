/**
 * @file
 *
 * JS bundler entry.
 */

// const vueMode = "runtime";
const vueMode = "compiler";

console.log("Vue mode:", vueMode);


// #############################################################################
// Vue apps.

require("./vue-apps-for-runtime");

if (vueMode === "compiler") {
  require("./vue-apps-for-compiler");
}
