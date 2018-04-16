
const ally = require('ally.js');

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
    'itemsData': {
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
      exclusiveItems: this.settings.exclusiveItems,
      batchControls: this.settings.batchControls,
      itemsCount: Object.keys(this.itemsData).length,
      currentMode: 'accordion',
      currentModeClass: '',
      currentlyOpenItems: [],
      currentlyActiveItem: undefined,
    }
  },

  methods: {

    debugState() {
      console.log('active: ', this.currentlyActiveItem);
      console.log('open: ', this.currentlyOpenItems);
    },

    /**
     * Translate the itemsData prop to relevant Vue component data.
     */
    determineInitialItemStates() {
      let openItems = [];
      let activeItem = undefined;

      for (var i = 0; i < this.itemsCount; i++) {
        if (this.itemsData[i].isOpen) {
          openItems.push(i);

          // We want the first one being found open to be flagged as active.
          if (activeItem === undefined) {
            activeItem = i;
          }
        }
      }

      this.currentlyOpenItems = openItems;

      if (activeItem !== undefined) {
        this.currentlyActiveItem = activeItem;
      }
      else {
        // If none found active, flag the first one as active.
        this.currentlyActiveItem = 0;
      }
    },

    /**
     * Switch the widget between accordion and tabs state based on screen size.
     */
    determineMode() {
      if (window.innerWidth < this.settings.tabsAt) {
        this.currentMode = 'accordion';
        this.currentModeClass = 'accdn--accordion';

        // Restore exclusivity according to settings.
        this.exclusiveItems = this.settings.exclusiveItems;
      }
      else {
        this.currentMode = 'tabs';
        this.currentModeClass = 'accdn--tabs';

        // In tabs mode, force exclusive mode.
        this.exclusiveItems = true;
      }
    },

    /**
     * Handle clicking of an item.
     *
     * @param index
     */
    toggleItem(index) {
      if ((this.currentMode === 'accordion' && ! this.currentlyOpenItems.includes(index))
          || (this.currentMode === 'tabs' && this.currentlyActiveItem !== index)) {
        if (this.exclusiveItems) {
          // Close the rest.
          this.closeItems(index);
        }

        this.openItem(index);

        // this.debugState();
      }
      else {
        this.closeItem(index);

        // this.debugState();
      }
    },

    /**
     * Open an individual item.
     *
     * @param index
     */
    openItem(index) {
      if ( ! this.currentlyOpenItems.includes(index)) {
        this.currentlyOpenItems.push(index);
      }

      // The last opened item becomes "currently active".
      this.currentlyActiveItem = index;

      // If tabs mode, focus the first focusable item in content.
      if (this.currentMode === 'tabs') {
        const itemRef = `item_${index}`;

        if (this.$refs[itemRef] && this.$refs[itemRef].id) {
          const itemBodySelector = `#${this.$refs[itemRef].id} .accdn__body`;
          this.$nextTick(() => this.focusFirstFocusable(itemBodySelector));
        }
      }
    },

    /**
     * See https://allyjs.io/api/query/focusable.html
     *
     * @param selector
     */
    focusFirstFocusable(selector) {
      var focusables = ally.query.focusable({
        context: selector,
        includeContext: false,
        strategy: 'all',
      });

      if (focusables.length) {
        focusables[0].focus();
      }
    },

    /**
     * Close an individual item.
     *
     * @param index
     */
    closeItem(index) {
      const itemKey = `item_${index}`

      if (this.$refs[itemKey]
          && this.$refs[itemKey].dataset.initiallyOpen !== undefined) {
        delete this.$refs[itemKey].dataset.initiallyOpen
      }

      // Remove this index from the list of currently opened.
      this.currentlyOpenItems = this.currentlyOpenItems
        .filter(item => item !== index);
    },

    /**
     * Close items.
     *
     * If an index is passed in, make that an exception: don't close that one.
     *
     * @param index
     */
    closeItems(index = undefined) {
      for (var i = 0; i < this.itemsCount; i++) {
        if (index === undefined || index !== i) {
          this.closeItem(i);
        }
      }
    },

    batchOpen() {
      this.currentlyOpenItems = [...Array(this.itemsCount).keys()];
      this.currentlyActiveItem = 0;
    },

    batchClose() {
      this.closeItems();
      this.currentlyActiveItem = 0;
    }
  },

  created() {
    // console.log('settings: ', this.settings);

    this.determineInitialItemStates();
    this.determineMode();
  },

  mounted() {
    // this.debugState();

    window.addEventListener("resize", () => {
      this.determineMode();
    })
  }
}
