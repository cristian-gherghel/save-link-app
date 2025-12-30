<template>
  <form class="search-form" @submit.prevent>
    <label class="search-container">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="search-icon">
        <path d="M15.5 14H14.71L14.43 13.73C15.444 12.5541 16.0012 11.0527 16 9.5C16 8.21442 15.6188 6.95772 14.9046 5.8888C14.1903 4.81988 13.1752 3.98676 11.9874 3.49479C10.7997 3.00282 9.49279 2.87409 8.23192 3.1249C6.97104 3.3757 5.81285 3.99477 4.90381 4.90381C3.99477 5.81285 3.3757 6.97104 3.1249 8.23192C2.87409 9.49279 3.00282 10.7997 3.49479 11.9874C3.98676 13.1752 4.81988 14.1903 5.8888 14.9046C6.95772 15.6188 8.21442 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="none"/>
      </svg>
      <input
          @keydown.enter.prevent
          v-model="searchValue"
          @input="Handle_Search"
          type="search"
          placeholder="search bookmark"
          :class="['search-bar', { isLightTheme: theme === 'light' }]"/>
    </label>

    <label class="btn-containers">
      <button type="button" @click.prevent="handleAddBookMark">
        <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 1C14.5523 1 15 1.44772 15 2V13H26C26.5523 13 27 13.4477 27 14C27 14.5523 26.5523 15 26 15H15V26C15 26.5523 14.5523 27 14 27C13.4477 27 13 26.5523 13 26V15H2C1.44772 15 1 14.5523 1 14C1 13.4477 1.44772 13 2 13H13V2C13 1.44772 13.4477 1 14 1Z" fill="red"/>
        </svg>
      </button>

      <button :class="{ isOpen: showSettings }" @click.prevent="handleOpenSettings">
        <i v-html="icons.settingsIcon"></i>
      </button>
    </label>

    <div class="scroll-loader" :style="{ width: scrollProgres + '%' }"></div>
  </form>
</template>

<script setup>
  import { icons, useBreakpoints } from "../utils.js";
  import {computed, watch} from "vue";
  import { useStore } from "vuex";

  const { state, commit,getters } = useStore();
  const { theme, scrollProgres } = defineProps({ theme: String, scrollProgres: String });
  const { width, type } = useBreakpoints()

  const emit = defineEmits(["search", 'click', 'settings']);
  const showSettings = computed(() => getters.showSettings);
  const searchValue = computed({
    get: () => state.search,
    set: (val) => commit("SET_SEARCH", val),
  });

  function handleAddBookMark () {
    emit('click')
  }

  function handleOpenSettings () {
    emit('open-settings')
  }

  function Handle_Search (ev) {
    emit('search', ev.target.value);
  }
</script>

<style lang="scss">
  .search-form {
    @media only screen and (min-width: 0) {
      position: fixed;
      display: flex;
      gap: 10px;
      top: 0;
      width: 100%;
      //background-color: var(--input-search-pannel);
      background-color: transparent;
      z-index: 100;
      height: 55px;
      padding: 0 10px;
      transition: bottom 0.2s ease;

      .scroll-loader {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--accent-primary), #818cf8);
        transition: width 0.1s ease;
        box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
        z-index: 200;
      }

      .search-container {
        position: relative;
        flex: 1;
        display: flex;
        align-items: center;
        padding-left: 15px;

        .search-bar {
          color: black;
          &.isLightTheme {
            color: white;
            &::-webkit-search-cancel-button {
              background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E");
            }
          }
          &::-webkit-search-cancel-button {
            -webkit-appearance: none;
            appearance: none;
            height: 16px;
            scale: 1.2;
            width: 16px;
            cursor: pointer;
            opacity: 1;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
          }
          &::placeholder {
            color: var(--input-placeholder-color);
            font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif !important;
            opacity: 0.5;
          }
        }

        .search-icon {
          position: absolute;
          left: 3px;
          top: 43%;
          transform: translateY(-50%);
          opacity: 0.9;
          pointer-events: none;
          width: 25px;
          height: 25px;
          path {
            fill: var(--input-icon)
          }
        }
      }

      .btn-containers {
        z-index: 999;
        display: flex;
        button {
          background: transparent;
          border: none;
          padding: 0;
          margin: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          &:first-child {
            padding: 0 10px;
          }
          &:last-child {
            padding: 0 10px;
          }
          i {
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.4s ease;
            transform-origin: center center;
          }
          svg path {
            fill: var(--input-icon);
          }

          i *, svg {
            display: block;
            transition: transform 0.4s ease;
            transform-origin: center center;
          }

          &.isOpen i,
          &.isOpen i > * {
            transform: rotate(190deg);
          }
        }
      }

      input {
        padding: 6px 5px 5px 30px;
        flex: 1;
        font-size: 18px;
        background-color: transparent;
        border: none;
        border-bottom: 1px solid var(--input-search-border);
        outline: none;
        margin: 0;
        width: 100%;
        border-radius: 0;

      }
    }

    @media only screen and (min-width: 1024px) {
      padding: 0;
      width: initial;
      background-color: transparent;
      position: initial;
      display: initial;
      bottom: auto;

      .btn-containers {
        display: none;
      }
      .scroll-loader {
        display: none;
      }

      .search-container {
        position: relative;
        display: inline-block;
        padding-left: 3px;

        .search-bar {
          color: var(--input-text);
          &.isLightTheme {
            color: black;
          }
          &::-webkit-search-cancel-button {
            -webkit-appearance: none;
            appearance: none;
            height: 16px;
            scale: 1.2;
            width: 16px;
            cursor: pointer;
            opacity: 1;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
          }
          &::placeholder {
            color: var(--input-placeholder);
          }
        }
        .search-icon {
          position: absolute;
          left: 8px;
          top: 43%;
          transform: translateY(-50%);
          opacity: 0.9;
          pointer-events: none;
          svg, path {
            fill: var(--input-icons);
          }
        }
      }

      .search-bar {
        display: initial;
        position: initial;
        height: 40px;
        background-color: transparent;
        color: var(--text-primary);
        border: none;
        outline: none;
        border-bottom: 1px solid var(--input-border);
        border-radius: 0;
        width: 530px;
        padding: 0 4px 0 38px;
        text-align: left;
        font-size: 1.8rem;
        transition: border-color 0.2s ease;
        &:focus {
          border-bottom-color: var(--text-primary);
        }
      }
    }
  }
</style>