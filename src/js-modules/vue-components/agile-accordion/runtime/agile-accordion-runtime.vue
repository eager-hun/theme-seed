
<template>
  <div v-html="msg"/>
</template>

<script>
  module.exports = {
    props: {
      'settings': {
        type: Object,
        default() {
          return {
            tabsAt: 820,
            exclusiveItems: false,
            batchControls: false
          }
        }
      },
      'items': {
        type: Object,
        default() {
          return {
            0: {
              isOpen: true
            }
          }
        }
      }
    },

    data() {
      return {
        msg: 'Initial message.'
      }
    },


    mounted() {
      const updatedMsg = [`Agile accordion runtime-mode, <em>WIP</em>.`];

      if (this.items[0].content) {
        updatedMsg.push(this.items[0].content);
      }

      updatedMsg.push(`settings.tabsAt: ${this.settings.tabsAt}`);

      this.msg = updatedMsg.join('');
    }
  }

</script>
