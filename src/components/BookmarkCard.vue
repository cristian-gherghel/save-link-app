<template>
  <li
      @mouseleave="handleHideCardAction"
      @mouseenter="handleShowCardAction"
      :title="data.name"
      v-click-outside="handleClickOutside"
      class="bookmark-card"
      :class="{ 'is-open': isOpen }">
    <header @click="toggleMenu" class="card-header">
      <button
          v-if="type === 'xs' || showActionBtn"
          class="card-menu"
          aria-label="Options"
          @click.stop="toggleMenu"
      >
        <i  :class="{ isLightTheme: theme === 'light' }"
                         class="close-icon" v-if="isOpen" v-html="baseIcons.closeIcon"></i>

        <span v-else class="dots-container" :class="{ 'show-dots': showActionBtn }">
          <i
              v-for="n in 3"
              :key="n"
              :class="{ isLightTheme: theme === 'light' }"
              class="dot"
              v-html="baseIcons.dropDownDots">
          </i>
        </span>
      </button>
      <transition name="dropdown-fade">
        <ul
            v-if="isOpen"
            :class="['actions-menu', { isLightTheme: theme === 'light', 'open-up': openUp }]"
        >
          <li
              v-for="(action, index) in actions"
              :key="index"
              @click.stop="action.handler"
              :class="action.class"
          >
            <i v-html="icons[action.icon]"></i>
            <span :class="action.textClass">{{ action.label }}</span>
          </li>
        </ul>
      </transition>
    </header>
    <a
        :href="data.url"
        class="card-link"
        @click="incrementCounting"
    >
      <div class="card-body">
        <span class="card-title">{{ hideCardTitleMobile }}</span>
      </div>
    </a>
  </li>
</template>

<script setup>
import { icons as baseIcons } from "../utils.js";
import {ref, nextTick, computed, watch} from "vue";
import { useBreakpoints } from "../utils.js"
import {useStore} from "vuex";

const props = defineProps({
  name: String,
  isOpen: Boolean,
  theme: String,
  data: {
    type: Object,
    required: true,
  },
});
const store = useStore()
const emit = defineEmits([
  "edit",
  "increment",
  "favorite",
  "delete",
  "toggle-menu",
  "close-menu",
]);

const { width, type } = useBreakpoints()
const copied = ref(false);
const shortcut = ref(false);
const openUp = ref(false);
const isHovered = ref(false)

const icons = {
  star: baseIcons.star,
  copyLink: baseIcons.copyLink,
  edit: baseIcons.edit,
  shortcut: baseIcons.shortcut,
  delete: baseIcons.delete,
};
const showActionBtn = computed(() => {
  if (type.value === 'xs') return true;
  return isHovered.value || props.isOpen;
})
const hideCardTitleMobile = computed(() => {
  const maxLength = type.value === 'xs' ? 50 : 50
  const name = props.data.name
  return name?.length > maxLength ? name.slice(0, maxLength) + '...' : name
})

const actions = computed(() => [
  {
    icon: "star",
    label: "Favorite",
    handler: handleFav,
    class: { "is-fav": props.data.fav },
  },
  {
    icon: "copyLink",
    label: copied.value ? "Copied!" : "Copy Link",
    handler: handleCopy,
    textClass: { flash: copied.value },
  },
  {
    icon: "edit",
    label: "Edit",
    handler: handleEdit,
  },
  {
    icon: "shortcut",
    label: shortcut.value ? "Coming soon!" : "Add Shortcut",
    handler: handleShortcut,
    textClass: { flash: shortcut.value },
  },
  {
    icon: "delete",
    label: "Delete",
    handler: handleDelete,
  },
]);

function handleShowCardAction () {
  isHovered.value = true
}

function handleHideCardAction () {
  isHovered.value = false
}

function toggleMenu (event) {
  emit("toggle-menu", props.data.id);

  if (!props.isOpen) {
    nextTick(() => {
      const button = event.currentTarget;
      const dropdownRect = button.getBoundingClientRect();
      const spaceBelow = window.innerHeight - dropdownRect.bottom;
      const spaceAbove = dropdownRect.top;
      const possibleMenu = button.parentElement.querySelector('.actions-menu');
      const menuHeight = possibleMenu?.offsetHeight || 100;
      openUp.value = spaceBelow < menuHeight && spaceAbove > menuHeight / 2;

    });
  }
}

function handleCopy (ev) {
  ev.stopPropagation();
  navigator.clipboard.writeText(props.data.url).then(() => {
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  });
}

function handleShortcut (ev) {
  ev.stopPropagation();
  shortcut.value = true;
  setTimeout(() => (shortcut.value = false), 1500);
}

function handleClickOutside () {
  props.isOpen &&  emit("close-menu");
}

function handleFav (ev) {
  ev.stopPropagation();
  emit("close-menu");
  emit("favorite", props.data);
}

function incrementCounting () {
  emit('increment')
}

function handleEdit (ev) {
  ev.stopPropagation();
  emit("edit", props.data);
  emit("close-menu");
}

function handleDelete (ev) {
  ev.stopPropagation();
  emit("delete", props.data);
}
</script>

<style lang="scss">
.bookmark-card {
  @media only screen and (min-width: 0) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;
    max-width: 278px;
    width: 100%;
    height: 171px;
    background: var(--bg-card);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid var(--border-card);
    border-radius: 16px;
    transition: background-color 0.1s ease-in-out;

    &.is-open {
      position: relative;
      z-index: 10;
    }

    &:hover {
      background-color: var(--hover-bg-card);
    }

    .card-link,
    .card-link-disabled {
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      text-decoration: none;
    }

    .card-body {
      font-size: 2.1rem;
      text-align: center;
      padding: 22px;
      color: var(--text-primary);
      text-transform: capitalize;
      width: 100%;
      overflow: hidden;
      overflow-wrap: break-word;

      &:first-letter {
        font-size: 4rem;
        color: var(--accent-primary);
      }
    }

    .card-header {
      position: absolute;
      top: 0;
      right: 0;
      padding: 8px 2px;
      .close-icon {
        &.isLightTheme {
          svg path {
            stroke: black;
            fill: black;
          }
        }
      }

      .dots-container {
        display: inline-flex;
        gap: 2px;
        cursor: pointer;

        .dot {
          opacity: 0;
          transform: translateY(-10px);
          animation: none;
          &.isLightTheme {
            svg path {
              stroke: black;
            }
          }
        }

        &.show-dots .dot {
          animation: dotAppear 0.2s ease-out forwards;
        }
      }
    }

    .card-menu {
      background: none;
      border: none;
      cursor: pointer;
      width: 40px;
      color: var(--text-primary);
    }
    .dropdown-fade-enter-active,
    .dropdown-fade-leave-active {
      transition: opacity 0.15s ease, transform 0.15s ease;
    }

    .dropdown-fade-enter-from,
    .dropdown-fade-leave-to {
      opacity: 0;
      transform: translateY(var(--dropdown-dir));
    }

    .dropdown-fade-enter-to,
    .dropdown-fade-leave-from {
      opacity: 1;
      transform: translateY(0);
    }

    .actions-menu {
      position: absolute;
      top: 3.5rem;
      right: 1rem;
      width: 178px;
      box-shadow: var(--dropdown-shadow);
      border-radius: 18px;
      background: var(--dropdown-background);
      border: 1px solid var(--dropdown-main-border);
      --dropdown-dir: 4px;
      &.open-up {
        top: auto;
        bottom: 2.5rem;
        animation: fadeInUp 0.15s ease-out;
        --dropdown-dir: -4px;
      }

      .flash {
        animation: flashText 0.3s ease-in-out;
      }

      li {
        cursor: pointer;
        font-size: 1.6rem;
        padding: 13px 20px;
        border: 1px solid var(--dropdown-border);
        color: var(--dropdown-color);
        display: flex;
        align-items: center;
        gap: 10px;

        &.is-fav i svg path {
          fill: #f7b500;
        }

        &:hover {
          background-color: var(--dropdown-hover);

          &:not(.is-fav) i svg path {
            fill: var(--dropdown-svg-hover);
          }
        }

        &:last-child:hover {
          background-color: rgba(255, 0, 0, 0.2);
          i svg path {
            fill: white;
          }
        }

        &:first-child {
          border-radius: 18px 18px 0 0 ;
        }
        &:last-child {
          border-radius: 0 0 18px 18px;
        }
        i, svg, path{
          fill: var(--dropdown-svg);
          height: 19px;
          width: 17px;
        }
      }
    }
  }

  @media only screen and (max-width: 588px) {
    max-width: 90%;
    height: auto;
  }

  @keyframes flashText {
    0% {
      color: #61a5fb;
    }
    100% {
      color: var(--text-primary);
    }
  }
}

@keyframes dotAppear {
  0% {
    opacity: 0;
    transform: translateX(10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
