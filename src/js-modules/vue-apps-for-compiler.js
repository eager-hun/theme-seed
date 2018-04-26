/**
 * @file
 *
 * Compiler-dependent Vue components & apps.
 */

import Vue from "vue";

import { registerVueComponents } from "./vue-global-components";

registerVueComponents(Vue);


// #############################################################################
// Apps.

const compilerDependentVueApps = document.querySelectorAll('.vue-compiler-dependent-app');

let element;

for (var i = 0; i < compilerDependentVueApps.length; i++) {
  element = compilerDependentVueApps[i];

  new Vue({
    el: element,
  });
}
