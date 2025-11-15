<template>
  <ul class="alphabet-sorting flex flex-center">
    <li v-for="(letter, index) in alphabet"
        :key="index"
        class="pointer flex-center"
        :class="{selected: letter === selected}"
        @click="handleLetterSelect(letter)">
      {{ letter }}
    </li>
  </ul>
</template>

<script setup>
import {computed} from "vue";
import {useStore} from "vuex";

const { getters,commit } = useStore();

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const selected = computed(() => getters.sort);
const emit = defineEmits(['select']);

function handleLetterSelect (letter) {
  const newValue = selected.value === letter ? '' : letter;
  commit('SET_SORT', newValue);
}

</script>

<style lang="scss">

.alphabet-sorting {
  @media only screen and (min-width: 0) {
    display: none;
  }
  @media only screen and (min-width: 1250px) {
    gap: 6px;
    display: flex;
    li {
      width: 36px;
      height: 36px;
      font-size: 1.4rem;
      font-weight: 800;
      margin: 0 2px;
      background: var(--bg-input);
      color: var(--text-secondary);
      border: 1px solid var(--border-input);
      border-radius: 7px;
      transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;

      &.selected {
        background: var(--btn-primary-bg);
        color: white;
        font-weight: 600;
        box-shadow: 0 2px 8px var(--btn-primary-shadow);
      }

      &:hover {
        background: var(--bg-input-hover);
        border-color: var(--border-focus);

        &.selected {
          background: var(--btn-primary-bg);
          box-shadow: 0 4px 12px var(--btn-primary-shadow);
        }
      }

      &:active {
        opacity: 0.9;
      }
    }
  }
}
</style>