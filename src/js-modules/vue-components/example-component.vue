<template>
  <div class="example-vue-component">
    <p><strong>Example Vue component</strong></p>
    <ul class="bare-list">
      <li v-html="msg"></li>
      <li v-if="displayIcon">
        <svg class="icon-sample">
          <use v-bind:xlink:href="iconHref"/>
        </svg>
        <span>SVG icon system rulez.</span>
      </li>
      <li v-else>
        <em>Page settings not available for checking SVG icons.</em>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "example-component",
    data() {
      return {
        msg: `<strong class="happy-message">Rendering Vue template is successful.</strong>`,
        iconId: "icon-sprite__arrow-right",
        displayIcon: false
      };
    },
    computed: {
      iconHref() {
        return `#${this.iconId}`
      }
    },
    created() {
      if ("apSettings" in window) {
        this.displayIcon = true;
      }
    }
  }
</script>

<style lang="scss">
  .example-vue-component {
    @include gap(margin, vertical, 1);
    @include gap(padding, all, 1);
    @include fit-content();

    background: color(blockfill);

    .happy-message {
      color: color(accent-2);
    }

    .icon-sample {
      display: inline-block;

      width: 1.5rem;
      height: 1.5rem;
      margin-right: 0.5rem;
      vertical-align: middle;

      fill: color(prim);
    }
  }
</style>
