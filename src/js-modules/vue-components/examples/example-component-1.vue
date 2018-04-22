<template>
  <div class="example-vue-component-1">
    <p><strong>{{ componentTitle }}</strong></p>
    <p v-html="msg"/>

    <p v-if="displayIcon">
      <svg class="icon-sample">
        <use :xlink:href="iconHref"/>
      </svg>
      <span>SVG icon system rulez.</span>
    </p>
    <p v-else>
      <em>Page settings not available for checking SVG icons.</em>
    </p>

    <div
      v-show="showPayload"
      class="stackable--grid-match"
    >
      <span>Payload:</span>
      <div v-html="payload"/>
    </div>

    <example-component-2
      :payload="passThrough"
      component-title="Example Vue Component 2, nested"
    />
  </div>
</template>

<script>
  export default {

    props: {
      componentTitle: {
        type: String,
        default: 'Example Vue Component 1'
      },
      payload: {
        type: String,
        default: ''
      },
      showPayload: {
        type: Boolean,
        default: false
      },
      passThrough: {
        type: String,
        default: ''
      },
    },

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
    },

    mounted() {
      console.log(this);
    }
  }
</script>

<style lang="scss">
  .example-vue-component-1 {
    @include vari-gap(margin, vertical, 1);
    @include vari-gap(padding, all, 1);
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
