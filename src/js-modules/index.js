
console.log("webpack here goes!");

import Vue from "vue";

window.Vue = Vue;


// #############################################################################
// Vue components.

import exampleComponent from "./vue-components/example-component.vue";
Vue.component('example-vue-component', exampleComponent);

import agileAccordion from "./vue-components/agile-accordion/agile-accordion";
Vue.component('agile-accordion', agileAccordion);


// #############################################################################
// Initializing global Vue app.

const globalVueAppMount = document.getElementById('vue-app');

if (globalVueAppMount) {
  new Vue({
    'el': globalVueAppMount
  });
}
