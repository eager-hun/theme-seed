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

compilerDependentVueApps.forEach(element => {
  new Vue({
    el: element,
  });
});
