<template>
  <div class="example-vue-component-2">
    <p><strong>{{ componentTitle }}</strong></p>
    <span><em>Payload:</em></span>

    <div v-html="payload"/>
  </div>
</template>

<script>
  export default {
    props: {
      componentTitle: {
        type: String,
        default: 'Example Vue Component 2'
      },
      payload: {
        type: String,
        default: ''
      }
    },
  }
</script>

<style lang="scss">
  .example-vue-component-2 {
    @include vari-gap(padding, all, 1);
    @include fit-content();

    border: 1px solid rgba(black, 0.25);
  }
</style>