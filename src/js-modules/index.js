
console.log("webpack here goes!");

import Vue from 'vue';
import exampleComponent from "./vue-components/example-component.vue";

const exampleVue = new Vue({
    el: "#example-vue__mount",
    render: h => h(exampleComponent)
});
