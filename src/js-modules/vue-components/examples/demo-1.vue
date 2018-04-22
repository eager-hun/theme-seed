<template>
  <div class="demo-1-vue-component">
    <p><strong>{{ componentTitle }}</strong></p>

    <p class="happy-message">{{ successMessage }}</p>

    <p v-if="displayIcon">
      <svg class="icon-sample">
        <use :xlink:href="iconHref"/>
      </svg>
      <span>SVG icon system rulez.</span>
    </p>
    <p v-else>
      <em>Page settings not available for checking SVG icons.</em>
    </p>

  </div>
</template>

<script>
  export default {
    name: "DemoComponent1",

    props: {
      componentTitle: {
        type: String,
        default: "Demo 1 Vue component"
      },
      successMessage: {
        type: String,
        default: "Rendered successfully."
      }
    },

    data() {
      return {
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
  .demo-1-vue-component {
    @include vari-gap(margin, vertical, 1);
    @include vari-gap(padding, all, 1);
    @include fit-content();

    background: color(blockfill);

    .happy-message {
      color: color(accent-2);
      font-weight: 700;
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
