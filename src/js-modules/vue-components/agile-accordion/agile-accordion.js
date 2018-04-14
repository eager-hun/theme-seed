
const _merge = require('lodash/merge');

module.exports = {
  props: ['settings', 'itemsData'],

  data() {
    console.log(this.itemsData);
    console.log(typeof this.itemsData);

    const data = {

    }
    _merge(data, this.itemsData);

    return data;
  },

  methods: {
    toggle(index) {
      const itemKey = `item_${index}`

      if (this[itemKey].isOpen) {
        this[itemKey].isOpen = false;
        delete this.$refs[itemKey].dataset.initiallyOpen
      }
      else {
        this[itemKey].isOpen = true;
      }
    }
  }
}
