
module.exports = {
  props: {
    'settings': {
      type: Object,
      default() {
        return {
          tabsAt: 750,
          exclusiveItems: false,
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
      itemsCount: Object.keys(this.itemsData).length,
      currentlyActiveItem: undefined,
      currentlyOpenItems: [],
      currentMode: 'accordion',
      currentModeClass: '',
    }
  },

  methods: {

    debugState() {
      console.log('active: ', this.currentlyActiveItem);
      console.log('open: ', this.currentlyOpenItems);
    },

    /**
     * Mark the first open item, or, if none open, mark the first as active.
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

        this.debugState();
      }
      else {
        this.closeItem(index);

        this.debugState();
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
     * Close items; (except for the one whose index is passed in).
     *
     * @param index
     */
    closeItems(index = undefined) {
      for (var i = 0; i < this.itemsCount; i++) {
        if (index === undefined || index !== i) {
          this.closeItem(i);
        }
      }
    }
  },

  created() {
    console.log('settings: ', this.settings);

    this.determineInitialItemStates();
    this.determineMode();
  },

  mounted() {
    this.debugState();

    window.addEventListener("resize", () => {
      this.determineMode();
    })
  }
}
