
console.log("webpack here goes!");

import Vue from 'vue';
import exampleComponent from "./vue-components/example-component.vue";

if (document.getElementById("example-vue__mount")) {
    new Vue({
        el: "#example-vue__mount",
        render: h => h(exampleComponent)
    });
}
