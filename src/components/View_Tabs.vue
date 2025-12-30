<template>
  <div class="view-tabs flex align-center">
    <i class="bookmark-icon"
       :class="{'opa-4': active_view !== 'bookmarks'}"
       @click="Toggle_View('bookmarks')"
       v-html="icons.bookmark" />
    <i class="feed-icon"
       :class="{'opa-4': active_view !== 'feed'}"
       @click="Toggle_View('feed')"
       v-html="icons.feed" />
  </div>
</template>

<script setup>
  import {useStore} from "vuex";
  import {computed} from "vue";
  import {icons} from "../utils.js";

  const { state, dispatch, commit } = useStore();
  const active_view = computed(() => state.active_view);

  function Toggle_View (value) {
    commit('SET_STATE', { key: 'active_view', value });
  }
</script>

<style lang="scss">
  .view-tabs {
    @media only screen and (min-width: 0) {
      background-color: #dddddd;
      border-top-right-radius: 24px;
      border-bottom-right-radius: 24px;
      i {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .bookmark-icon {
        padding: 8px 9px 8px 16px;
      }
      .feed-icon {
        padding: 8px 18px 8px 9px;
      }
    }

    @media only screen and (min-width: 1024px) {
      border-radius: 24px;
      background-color: rgba(#ffffff, 0.9);
      i {
        &.opa-4 {
          cursor: pointer;
          &:hover {
            svg {
              transform: scale(1.1);
            }
          }
        }
      }
    }
  }
</style>