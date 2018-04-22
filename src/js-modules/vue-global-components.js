/**
 * @file
 *
 * Vue components registered globally.
 */

import demo1 from "./vue-components/examples/demo-1.vue";
import exampleVueComponent1 from "./vue-components/examples/example-component-1.vue";
import exampleVueComponent2 from "./vue-components/examples/example-component-2.vue";
import agileAccordionPe from "./vue-components/agile-accordion/pe/agile-accordion-pe";
import agileAccordionRuntime from "./vue-components/agile-accordion/runtime/agile-accordion-runtime.vue";

export const vueComponents = {
  demo1,
  exampleVueComponent1,
  exampleVueComponent2,
  agileAccordionPe,
  agileAccordionRuntime
}

export function registerVueComponents(Vue) {
  Vue.component('vue-demo-1', demo1);
  Vue.component('example-component-1', exampleVueComponent1);
  Vue.component('example-component-2', exampleVueComponent2);
  Vue.component('agile-accordion-pe', agileAccordionPe);
  Vue.component('agile-accordion-runtime', agileAccordionRuntime);
}
