
import ally from "ally.js";

export default {

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
        return {}
      }
    }
  },

  data() {
    return {
      exclusiveItems: this.settings.exclusiveItems,
      batchControls: this.settings.batchControls,
      itemsCount: Object.keys(this.items).length,
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
        if (this.items[i]['is_open']) {
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
      // When in accordion mode, check if it's not already among the opened ones.
      if ((this.currentMode === 'accordion' && this.currentlyOpenItems.indexOf(index) === -1)
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
      // If it's not already among the opened ones.
      if (this.currentlyOpenItems.indexOf(index) === -1) {
        this.currentlyOpenItems.push(index);
      }

      // The last opened item becomes "currently active".
      this.currentlyActiveItem = index;

      // If tabs mode, focus the first focusable item in content.
      if (this.currentMode === 'tabs'
        && this.items[index].focusables
        && this.items[index].focusables.length) {
        this.$nextTick(() => this.focusFirstFocusableInContent(index));
      }
    },

    /**
     * Close an individual item.
     *
     * @param index
     */
    closeItem(index) {
      const itemKey = `item_${index}`;

      if (this.$refs[itemKey]
        && this.$refs[itemKey].dataset
        && this.$refs[itemKey].dataset.initiallyOpen !== undefined) {
        delete this.$refs[itemKey].dataset.initiallyOpen;
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
      const openItemsArray = []
      for (var i = 0; i < this.itemsCount; i++) {
        openItemsArray.push(i);
      }
      this.currentlyOpenItems = openItemsArray;

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

        if (this.$refs[itemRef]) {
          let id = undefined;

          if (this.$refs[itemRef].id) {
            id = this.$refs[itemRef].id;
          }
          else if (this.$refs[itemRef][0].id) {
            id = this.$refs[itemRef][0].id
          }

          if (id !== undefined) {
            const itemBodySelector = `#${id} .accdn__body`;

            this.items[index].focusables = ally.query.focusable({
              context: itemBodySelector,
              includeContext: false,
              strategy: 'all',
            });
          }
        }
      }
    },

    /**
     * @param index
     */
    focusFirstFocusableInContent(index) {
      this.items[index].focusables[0].focus();
    },

    /**
     * When tabbing forwards in content, at the end, redirect to the next tab.
     *
     * @param index
     */
    hijackTabbingOnLastFocusableInContent(index) {
      // Only if it's not the last item's content.
      if (index < (this.itemsCount - 1)
        && this.items[index].focusables
        && this.items[index].focusables.length) {

        const focusablesCount = this.items[index].focusables.length
        const lastFocusable = this.items[index].focusables[focusablesCount - 1];

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
      if (this.items[index].focusables
          && this.items[index].focusables.length) {
        const firstFocusable = this.items[index].focusables[0];

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

        if (typeof this.$refs[nextTabButtonRef].focus === 'function') {
          typeof this.$refs[nextTabButtonRef].focus();
        }
        else if (typeof this.$refs[nextTabButtonRef][0].focus === 'function') {
          this.$refs[nextTabButtonRef][0].focus();
        }
      }
    },

    reFocusCurrentTab(indexOfCurrentTab) {
      const tabButtonRef = `tab_${indexOfCurrentTab}_button`;

      if (typeof this.$refs[tabButtonRef].focus === 'function') {
        typeof this.$refs[tabButtonRef].focus();
      }
      else if (typeof this.$refs[tabButtonRef][0].focus === 'function') {
        this.$refs[tabButtonRef][0].focus();
      }
    },
  },

  created() {
    this.determineInitialItemStates();
    this.determineMode();
  },

  mounted() {
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
