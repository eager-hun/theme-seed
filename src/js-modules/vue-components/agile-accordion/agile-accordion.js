
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
      if (this.currentMode === 'tabs'
          && this.itemsData[index].focusables.length) {
        this.$nextTick(() => this.focusFirstFocusableInContent(index));
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

    // -------------------------------------------------------------------------
    // Batch ops.

    batchOpen() {
      this.currentlyOpenItems = [...Array(this.itemsCount).keys()];
      this.currentlyActiveItem = 0;
    },

    batchClose() {
      this.closeItems();
      this.currentlyActiveItem = 0;
    },

    // -------------------------------------------------------------------------
    // Focusing games.

    /**
     * Find focusable content in all accordion/tab contents.
     *
     * See https://allyjs.io/api/query/focusable.html
     */
    findFocusableContents() {
      for (var index = 0; index < this.itemsCount; index++) {
        const itemRef = `item_${index}`;

        if (this.$refs[itemRef] && this.$refs[itemRef].id) {
          const itemBodySelector = `#${this.$refs[itemRef].id} .accdn__body`;

          this.itemsData[index].focusables = ally.query.focusable({
            context: itemBodySelector,
            includeContext: false,
            strategy: 'all',
          });
        }
      }
    },

    /**
     * @param index
     */
    focusFirstFocusableInContent(index) {
      this.itemsData[index].focusables[0].focus();
    },

    /**
     * When tabbing forwards in content, at the end, redirect to the next tab.
     *
     * @param index
     */
    hijackTabbingOnLastFocusableInContent(index) {
      // Only if it's not the last item's content.
      if (index < (this.itemsCount - 1)
        && this.itemsData[index].focusables.length) {
        const focusablesCount = this.itemsData[index].focusables.length
        const lastFocusable = this.itemsData[index].focusables[focusablesCount - 1];

        lastFocusable.addEventListener('keydown', (event) => {
          var kCode = (event.keyCode ? event.keyCode : event.which);
          if (this.currentMode === 'tabs'
            && kCode == 9
            && ally.is.activeElement(lastFocusable)
            && ! event.shiftKey
          ) {
            event.preventDefault();
            this.focusNextTab(index);
          }
        }, false);
      }
    },

    /**
     * When tabbing backwards in content, at the top, redirect to the current tab.
     *
     * @param index
     */
    hijackTabbingOnFirstFocusableInContent(index) {
      if (this.itemsData[index].focusables.length) {
        const firstFocusable = this.itemsData[index].focusables[0];

        firstFocusable.addEventListener('keydown', (event) => {
          var kCode = (event.keyCode ? event.keyCode : event.which);
          if (this.currentMode === 'tabs'
            && kCode == 9
            && ally.is.activeElement(firstFocusable)
            && event.shiftKey
          ) {
            event.preventDefault();
            this.reFocusCurrentTab(index);
          }
        }, false);
      }
    },

    focusNextTab(indexOfCurrentTab) {
      // Only if it's not the last tab.
      if (indexOfCurrentTab < (this.itemsCount - 1)) {
        const nextTabButtonRef = 'tab_' + (indexOfCurrentTab + 1) + '_button';
        this.$refs[nextTabButtonRef].focus();
      }
    },

    reFocusCurrentTab(indexOfCurrentTab) {
      const tabButtonRef = `tab_${indexOfCurrentTab}_button`;
      this.$refs[tabButtonRef].focus();
    },
  },

  created() {
    this.determineInitialItemStates();
    this.determineMode();
  },

  mounted() {
    // this.debugState();
    this.findFocusableContents();

    for (var index = 0; index < this.itemsCount; index++) {
      this.hijackTabbingOnLastFocusableInContent(index);
      this.hijackTabbingOnFirstFocusableInContent(index);
    }

    window.addEventListener("resize", () => {
      this.determineMode();
    })
  }
}
