<template>
  <div class="view-tabs flex align-center">
    <i class="bookmark-icon"
       :class="{'opa-4': route.name !== 'Private_Bookmarks'}"
       @click="Toggle_View('/private-bookmarks')"
       v-html="icons.bookmark" />
    <i class="feed-icon"
       :class="{'opa-4': route.name !== 'Public_Feed'}"
       @click="Toggle_View('/public-feed')"
       v-html="icons.feed" />
  </div>
</template>

<script setup>
  import {useStore} from "vuex";
  import {computed} from "vue";
  import {icons} from "../utils.js";
  import {useRoute} from "vue-router";
  import router from "../router/index.js";

  const { state, commit } = useStore();
  const route = useRoute();
  // const active_view = computed(() => state.active_view);

  function Toggle_View (route) {
    router.push(route);
    // commit('SET_STATE', { key: 'active_view', value });
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