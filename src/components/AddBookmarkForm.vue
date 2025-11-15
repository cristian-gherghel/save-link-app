<template>
  <div v-if="isAddBookmarkForm" :class="['addbookmark-form', currentTheme === 'light' ? 'isLightTheme' : '']">
    <h3>Save a New Bookmark</h3>
    <form @submit.prevent="handleSubmit">
      <label for="name">
        name
        <input
            type="text"
            id="name"
            :value="bookmark.name"
            @input="handleInput"
            @keyup.enter="handleSubmit"
            placeholder="bookmark name"
            cy="bookmark-title-input">
      </label>
      <label for="url">
        link
        <input
            type="text"
            id="url"
            :value="bookmark.url"
            @keyup.enter="handleSubmit"
            @input="handleInput"
            placeholder="https://example.com"
            cy="bookmark-url-input">
      </label>
      <div class="btns-container">
        <button type="button"
                class="m-left-auto"
                @click="handleCancel"
                cy="cancel-bookmark-button">Cancel</button>
        <button
            type="button"
            :disabled="Object.keys(bookmark).every((key) => !bookmark[key])"
            @click="handleSubmit"
            cy="submit-bookmark-button">
              Save
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import {computed, reactive} from "vue";
import {useStore} from "vuex";
import {cloneObject} from "../utils.js";

const { state, commit, getters } = useStore();
const emit = defineEmits(['submit', 'close'])
const data = reactive({name: '', url: ''})
const bookmark = computed(() => state.bookmark)

function handleClear () {
  commit('SET_BOOKMARK', { name: '', url: '' });
}

function handleInput (ev) {
  commit('SET_BOOKMARK_FIELD', {
    name: ev.target.id,
    value: ev.target.value,
  })
}

function handleCancel () {
  emit('close')
  handleClear()
}

function handleSubmit () {
  emit('submit', cloneObject(bookmark.value))
  handleClear()
}

const isAddBookmarkForm = computed(() => getters.isAddBookmarkForm);
const currentTheme = computed(() => getters.currentTheme)
console.log(currentTheme)
</script>


<style lang="scss">
.addbookmark-form {
  @media only screen and (min-width: 0) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999999999;
    background: var(--background-add-bookmark);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    &.isLightTheme {
      background: var(--bg-icons), var(--bg-primary);
      background-repeat: repeat, repeat;
      background-position: center, center;
      background-size: auto, cover;
      background-attachment: fixed, fixed;
      min-height: 100vh;
    }
    h3 {
      font-size: 2.2rem;
      color: var(--heading-color-add-bookmark);
    }
    form {
      width: 100%;
      max-width: 500px;
      border-radius: 20px;
      background: transparent;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      padding: 21px 21px 0px 21px;
      margin-bottom: 320px;
      .btns-container {
        width: 100%;
        display: flex;
        justify-content: end;
        gap: 14px;
        margin: 28px 0 20px 0;
        button {
          font-size: 1.5rem;
          color: white;
          border-radius: 4px;
          background-color: rgba(#475569, 0.2);
          padding: 13px 25px;
          &:hover {
            background-color: var(--button-cancel-add-bookmark);
          }
          &:last-child {
            background-color: #0f680f;
          }
        }
      }
      label,input {
        display: block;
        color: white;
      }
      label {
        width: 100%;
        font-size: 15px;
        color: var(--color-label-add-bookmark);
        font-weight: 300;
        &:first-child {
          margin-bottom: 24px;
        }
      }
      input {
        margin-top: 8px;
        background-color: var(--input-background-add-bookmark);
        border: 1px solid rgba(#FFFFFF, 0.1);
        border-radius: 4px;
        max-width: 500px;
        width: 100%;
        height: 52px;
        padding: 0 10px;
        font-size: 16px;
        &:focus {
          border: 1px solid var(--input-outline-add-bookmark);
          outline: none;
        }
        &::placeholder {
          color: white;
          opacity: 0.5;
        }
      }
    }
  }
}
</style>