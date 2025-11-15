<template>
  <div
      v-clickOutside="handleClickOutside"
      v-if="!isAddBookmarkForm"
      class="settings-button-container"
  >

    <div v-if="showOnlyFavorites" class="notification">
      <svg width="18" height="17" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 18.35L8.55 17.03C3.4 12.36 0 9.27 0 5.5C0 2.41 2.42 0 5.5 0C7.24 0 8.91 0.81 10 2.08C11.09 0.81 12.76 0 14.5 0C17.58 0 20 2.41 20 5.5C20 9.27 16.6 12.36 11.45 17.03L10 18.35Z" fill="#FF0000"/>
      </svg>
    </div>

    <button
        @click.stop="toggleSetting"
        class="settings-button"
        :class="{
        'is-open': showSettings,
        'isLightTheme': currentTheme === 'light',
        'isMidnightTheme': currentTheme === 'midnight'
      }"
    >
      <i v-html="icons.plusIcon"></i>
    </button>

    <Transition :name="type === 'xs' ? 'fade-mobile' : 'accordion'">
      <div v-if="showSettings" class="settings-panel">
        <div class="settings-header">
          <h3>Theme</h3>
        </div>

        <div class="settings-options">
          <label
              v-for="(theme, index) in themes"
              :key="index"
              class="radio-option"
              @click="handleThemeClick(theme.value)"
          >
            <input
                type="radio"
                name="theme"
                :value="theme.value"
                v-model="currentTheme"
            />
            <span class="radio-label">
              <span class="radio-title">{{ theme.icon }} {{ theme.title }}</span>
              <span class="radio-description">{{ theme.description }}</span>
            </span>
          </label>
        </div>

        <div
            v-if="type === 'xs'"
            class="about-icon"
            @click="handleAboutBookmark"
        >
          <i v-html="icons.aboutIcon"></i>
          <span>About</span>
        </div>
        <div
            class="favorite-action"
            @click="toggleFavorites"
            :class="{ active: showOnlyFavorites }"
        >
          <i v-html="icons.favoriteIcon"></i>
          <span>{{ showOnlyFavorites ? 'Show all bookmarks' : 'Show favorites only' }}</span>
        </div>

        <div class="logout-action" @click="handleLogout">
          <i v-html="icons.logoutIcon"></i>
          <span>Logout</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { icons, useBreakpoints } from '../utils.js';

const { getters, dispatch, commit } = useStore();
const { type } = useBreakpoints();

const showSettings = computed(() => getters.showSettings);
const isAddBookmarkForm = computed(() => getters.isAddBookmarkForm);
const currentTheme = computed(() => getters.currentTheme);
const themes = computed(() => getters.availableThemes);
const showOnlyFavorites = computed(() => getters.showOnlyFavorites);


function handleAboutBookmark () {
  commit('SHOW_ABOUT_BOOKMARK')
}
function toggleSetting() {
  commit('TOGGLE_UI_STATE', 'showSettings');
}

function closeShowSettings () {
  commit('SET_UI_STATE', { key: 'showSettings', value: false });
}

function handleClickOutside(event) {
  if (event.target.closest('.search-bar') || event.target.closest('.btn-containers')) {
    return;
  }

  closeShowSettings()
}

function toggleFavorites() {
  commit('TOGGLE_SHOW_FAVORITES');
  commit('CLEAR_SEARCH')
  commit('CLEAR_SORT')
  closeShowSettings()
}

function handleLogout() {
  dispatch('logout');
  closeShowSettings()
}

function handleThemeClick(themeValue) {
  if (themeValue !== currentTheme.value) {
    commit('SET_THEME', themeValue);
  }
  closeShowSettings()
}
</script>

<style lang="scss">
.settings-button-container {
  position: fixed;
  top: 22px;
  right: 32px;
  z-index: 100;
  transform: translateZ(0);

  .settings-button {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(99, 102, 241, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(99, 102, 241, 0.2);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(99, 102, 241, 0.25);
    }

    &.isMidnightTheme {
      background-color: #092b44;
    }

    &.isLightTheme {
      background-color: transparent;
      svg,
      path {
        opacity: 0.8;
        fill: black;
      }
    }

    &.is-open {
      svg {
        transform: rotate(120deg);
        transform-origin: center;
      }
    }

    &:active {
      transform: scale(0.95);
    }

    svg {
      display: block;
      width: 24px;
      height: 24px;
      transition: transform 0.4s ease-in-out;
    }
  }
  .settings-panel {
    position: absolute;
    top: 65px;
    right: 0;
    width: 320px;
    background: var(--bg-primary);
    border-radius: 16px;
    border: 1px solid var(--border-card);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);

    .favorite-action,
    .about-icon {
      border-bottom: 1px solid var(--border-color-switcher);
      border-top: 1px solid var(--border-color-switcher);
    }

    .logout-action,
    .favorite-action,
    .about-icon {
      cursor: pointer;
      padding: 20px 0 20px 34px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.8rem;
      color: var(--settings-text);
    }

    .about-icon {
      padding: 20px 0 20px 26px;

      svg,
      path {
        fill: var(--text-primary);
        transition: fill 0.2s ease;
      }
    }

    .favorite-action {
      transition: color 0.2s ease;

      svg,
      path {
        fill: var(--text-primary);
        transition: fill 0.2s ease;
      }

      &.active {
        color: #f82c2c;

        svg,
        path {
          fill: #f82c2c;
        }
      }
    }

    .logout-action {
     i {
       transform: translateY(3px);
       svg {
         width: 20px;
         height: 18px;
         color: var(--text-primary);
         transition: color 0.2s ease;
       }
     }

      &:hover svg {
        color: var(--text-secondary);
      }
    }

    .settings-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid var(--border-card);

      h3 {
        margin: 0;
        font-size: 1.8rem;
        font-weight: 600;
        color: var(--text-primary);
      }

      .close-btn {
        background: none;
        border: none;
        color: var(--text-tertiary);
        font-size: 2.4rem;
        cursor: pointer;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        transition: background-color 0.15s ease;

        &:hover {
          background: var(--bg-input);
          color: var(--text-primary);
        }
      }
    }

    .settings-options {
      padding: 12px;

      .radio-option {
        display: flex;
        align-items: flex-start;
        padding: 16px;
        border-radius: 12px;
        cursor: pointer;
        transition: background-color 0.15s ease;
        margin-bottom: 8px;

        &:hover {
          background: var(--bg-input);
        }

        &:last-child {
          margin-bottom: 0;
        }

        input[type='radio'] {
          margin-right: 12px;
          margin-top: 4px;
          width: 18px;
          height: 18px;
          cursor: pointer;
          appearance: none;
          border: 2px solid var(--accent-primary);
          border-radius: 50%;
          background: transparent;
          position: relative;
          transition: all 0.2s ease;

          &:checked {
            border-color: var(--accent-primary);

            &::after {
              content: '';
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: var(--accent-primary);
            }
          }
        }

        .radio-label {
          display: flex;
          flex-direction: column;
          flex: 1;

          .radio-title {
            color: var(--text-primary);
            font-size: 1.5rem;
            font-weight: 500;
            margin-bottom: 4px;
            display: block;
          }

          .radio-description {
            color: var(--text-tertiary);
            font-size: 1.3rem;
            line-height: 1.4;
            display: block;
          }
        }
      }
    }
  }
}

.settings-button-container {
  position: fixed;
  top: 22px;
  right: 32px;
  z-index: 100;
  transform: translateZ(0);

  .settings-button {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(99, 102, 241, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(99, 102, 241, 0.2);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(99, 102, 241, 0.25);
    }

    &.isMidnightTheme {
      background-color: transparent;
    }

    &.isLightTheme {
      background-color: transparent;
      svg,
      path {
        opacity: 0.8;
        fill: black;
      }
    }

    &.is-open {
      svg {
        transform: rotate(120deg);
        transform-origin: center;
      }
    }

    &:active {
      transform: scale(0.95);
    }

    svg {
      display: block;
      width: 24px;
      height: 24px;
      transition: transform 0.4s ease-in-out;
    }
  }

  .settings-panel {
    position: absolute;
    top: 65px;
    right: 0;
    width: 320px;
    background: var(--bg-primary);
    border-radius: 16px;
    border: 1px solid var(--border-card);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);

    .favorite-action,
    .about-icon {
      border-bottom: 1px solid var(--border-color-switcher);
      border-top: 1px solid var(--border-color-switcher);
    }

    .logout-action,
    .favorite-action,
    .about-icon {
      cursor: pointer;
      padding: 20px 0 20px 34px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.8rem;
      color: var(--settings-text);
    }

    .about-icon {
      padding: 20px 0 20px 26px;

      svg,
      path {
        fill: var(--text-primary);
        transition: fill 0.2s ease;
      }
    }

    .favorite-action {
      transition: color 0.2s ease;

      svg,
      path {
        fill: var(--text-primary);
        transition: fill 0.2s ease;
      }

      &.active {
        color: #f82c2c;

        svg,
        path {
          fill: #f82c2c;
        }
      }
    }

    .logout-action {
      i {
        transform: translateY(3px);
        svg {
          width: 20px;
          height: 18px;
          color: var(--text-primary);
          transition: color 0.2s ease;
        }
      }

      &:hover svg {
        color: var(--text-secondary);
      }
    }

    .settings-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid var(--border-card);

      h3 {
        margin: 0;
        font-size: 1.8rem;
        font-weight: 600;
        color: var(--text-primary);
      }

      .close-btn {
        background: none;
        border: none;
        color: var(--text-tertiary);
        font-size: 2.4rem;
        cursor: pointer;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        transition: background-color 0.15s ease;

        &:hover {
          background: var(--bg-input);
          color: var(--text-primary);
        }
      }
    }

    .settings-options {
      padding: 12px;

      .radio-option {
        display: flex;
        align-items: flex-start;
        padding: 16px;
        border-radius: 12px;
        cursor: pointer;
        transition: background-color 0.15s ease;
        margin-bottom: 8px;

        &:hover {
          background: var(--bg-input);
        }

        &:last-child {
          margin-bottom: 0;
        }

        input[type='radio'] {
          margin-right: 12px;
          margin-top: 4px;
          width: 18px;
          height: 18px;
          cursor: pointer;
          appearance: none;
          border: 2px solid var(--accent-primary);
          border-radius: 50%;
          background: transparent;
          position: relative;
          transition: all 0.2s ease;

          &:checked {
            border-color: var(--accent-primary);

            &::after {
              content: '';
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: var(--accent-primary);
            }
          }
        }

        .radio-label {
          display: flex;
          flex-direction: column;
          flex: 1;

          .radio-title {
            color: var(--text-primary);
            font-size: 1.5rem;
            font-weight: 500;
            margin-bottom: 4px;
            display: block;
          }

          .radio-description {
            color: var(--text-tertiary);
            font-size: 1.3rem;
            line-height: 1.4;
            display: block;
          }
        }
      }
    }
  }
}

@media only screen and (min-width: 1001px) {
  .settings-button-container {
    .notification {
      position: absolute;
      left: 0px;
      top: 0px;
      z-index: 99;
    }

    .settings-panel {
      transform-origin: top right;
    }
  }

  .accordion-enter-active {
    transition:
        max-height 0.3s ease,
        opacity 0.2s ease,
        transform 0.3s ease;
    overflow: hidden;
  }

  .accordion-leave-active {
    transition:
        max-height 0.25s ease,
        opacity 0.15s ease,
        transform 0.25s ease;
    overflow: hidden;
  }

  .accordion-enter-from {
    max-height: 0;
    opacity: 0;
    transform: translateY(10px);
  }

  .accordion-enter-to {
    max-height: 700px;
    opacity: 1;
    transform: translateY(0);
  }

  .accordion-leave-from {
    max-height: 700px;
    opacity: 1;
    transform: translateY(0);
  }

  .accordion-leave-to {
    max-height: 0;
    opacity: 0;
    transform: translateY(10px);
  }
}

@media only screen and (min-width: 589px) and (max-width: 1000px) {
  .settings-button-container {
    .notification {
      position: absolute;
      left: 5px;
      bottom: 0;
      z-index: 99;
    }

    .settings-button {
      display: none;
    }

    .settings-panel {
      transform-origin: top right;
    }
  }

  .settings-options {
    .radio-option {
      input[type='radio'] {
        display: none;
      }
    }
  }

  .accordion-enter-active {
    transition:
        max-height 0.3s ease,
        opacity 0.2s ease,
        transform 0.3s ease;
    overflow: hidden;
  }

  .accordion-leave-active {
    transition:
        max-height 0.25s ease,
        opacity 0.15s ease,
        transform 0.25s ease;
    overflow: hidden;
  }

  .accordion-enter-from {
    max-height: 0;
    opacity: 0;
    transform: translateY(10px);
  }

  .accordion-enter-to {
    max-height: 700px;
    opacity: 1;
    transform: translateY(0);
  }

  .accordion-leave-from {
    max-height: 700px;
    opacity: 1;
    transform: translateY(0);
  }

  .accordion-leave-to {
    max-height: 0;
    opacity: 0;
    transform: translateY(10px);
  }
}

@media only screen and (max-width: 588px) {
  .settings-button-container {
    bottom: auto;
    top: 5px;
    right: 5px;

    .notification {
      position: absolute;
      right: 0px;
      bottom: 30px;
      z-index: 99;
    }

    .settings-button {
      width: 48px;
      height: 48px;
      background: transparent;
      border: none;
      backdrop-filter: none;
      &:hover {
        background: transparent;
      }
      svg {
        display: none;
        width: 20px;
        height: 20px;
      }
    }

    .settings-panel {
      width: 260px;
      bottom: auto;
      top: 60px;
      right: 0;

      .settings-header {
        padding: 16px;

        h3 {
          font-size: 1.6rem;
        }

        .close-btn {
          font-size: 2rem;
          width: 28px;
          height: 28px;
        }
      }

      .settings-options {
        padding: 8px;

        .radio-option {
          padding: 12px;
          margin-bottom: 6px;

          input[type='radio'] {
            width: 16px;
            height: 16px;
            margin-right: 10px;
            display: none;
          }
          &:hover {
            background: transparent;
          }
          .radio-label {
            .radio-title {
              font-size: 1.4rem;
              margin-bottom: 2px;
            }

            .radio-description {
              font-size: 1.2rem;
            }
          }
        }
      }

      .logout-action,
      .favorite-action,
      .add-bookmark-btn {
        padding: 16px 0 16px 24px;
        font-size: 1.6rem;

        svg {
          width: 18px;
          height: 18px;
        }
      }
    }
  }

  .fade-mobile-enter-active,
  .fade-mobile-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .fade-mobile-enter-from,
  .fade-mobile-leave-to {
    opacity: 0;
    transform: translateY(12px);
  }
}
</style>