/**
 * @file
 *
 * Runtime-mode Vue components & apps.
 */

import Vue from "vue";

import { vueComponents, registerVueComponents } from "./vue-global-components";

registerVueComponents(Vue);


// #############################################################################
// Apps.

// -----------------------------------------------------------------------------
// Demo 1 app in runtime-mode.

const demo1MountEl = document.querySelector('.vue-demo-1-runtime-mount');

if (demo1MountEl) {
  new Vue({
    el: demo1MountEl,
    render: h => h(vueComponents.demo1, {
      props: {
        componentTitle: "Runtime-mode Vue component"
      }
    })
  });
}

// -----------------------------------------------------------------------------
// Agile accordions, runtime-mode implementation.

const agileAccordionElements = document.querySelectorAll('.agile-accordion-runtime');

agileAccordionElements.forEach(element => {
  new Vue({
    el: element,
    render: h => h(vueComponents.agileAccordionRuntime, {
      props: {
        items: element.dataset.items ? JSON.parse(element.dataset.items) : undefined,
        settings: element.dataset.settings ? JSON.parse(element.dataset.settings) : undefined,
      }
    })
  });
});

// -----------------------------------------------------------------------------
// Vue studies.

const exampleVueApp1El = document.getElementById('example-vue-app-1');

if (exampleVueApp1El) {
  new Vue({
    el: exampleVueApp1El,
    render: h => h(vueComponents.exampleVueComponent1, {
      props: {
        componentTitle: exampleVueApp1El.dataset.componentTitle,
        payload:        exampleVueApp1El.dataset.payload,
        showPayload:    Boolean(exampleVueApp1El.dataset.showPayload),
        passThrough:    exampleVueApp1El.dataset.passThrough,
      }
    })
  });
}
