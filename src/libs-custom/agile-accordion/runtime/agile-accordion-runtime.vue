
<template>
  <div
    v-cloak
    :class="currentModeClass"
    class="accdn"
  >
    <div
      v-if="batchControls && ! exclusiveItems"
      class="accdn__batch-controls"
    >
      <button
        :disabled="currentlyOpenItems.length === itemsCount"
        class="accdn__batch-open"
        @click="batchOpen"
      >Open all</button>
      <button
        :disabled="currentlyOpenItems.length === 0"
        class="accdn__batch-close"
        @click="batchClose"
      >Close all</button>
    </div>

    <div class="accdn__tabs">
      <div
        v-for="(item, key, index) in items"
        :key="`${item.id}_tab_${key}`"
        :class="{ 'is-active': currentlyActiveItem === index }"
        class="accdn__tab"
      >
        <button
          :ref="`tab_${index}_button`"
          @click="toggleItem(index)"
        >
          <span class="text">
            {{ item.title }}
          </span>
        </button>
      </div>
    </div>

    <div
      v-for="(item, key, index) in items"
      :key="item.id"
      :id="item.id"
      :class="{
        'is-open': currentlyOpenItems.indexOf(index) !== -1,
        'is-active': currentlyActiveItem === index
      }"
      :ref="`item_${index}`"
      class="accdn__item"
    >
      <div class="accdn__head">
        <button
          type="button"
          @click="toggleItem(index)"
        >
          <span class="accdn__marker"/>
          <span class="text">
            {{ item.title }}
          </span>
        </button>
      </div>

      <div
        class="accdn__body"
        v-html="item.content"
      />

    </div>
  </div>
</template>

<script>
  import agileAccordionMixins from "../shared/agile-accordion-mixins";

  export default {
    mixins: [agileAccordionMixins]
  }
</script>
