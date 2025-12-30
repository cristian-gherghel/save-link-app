<template>
  <ul class="feed-list flex flex-wrap">
    <li class=""
        v-for="(item, index) in feed"
        :key="index">
      <a :href="item.url" target="_blank">
        <h2 class="text-center">
          {{ item.title }}
        </h2>

        <h3 class="text-center">
          {{ item.subtitle }}
        </h3>

        <p v-html="item.description" />
      </a>
    </li>
  </ul>
</template>

<script setup>
  import {useStore} from "vuex";
  import {computed} from "vue";

  const { state, dispatch, commit, getters } = useStore();
  const feed = computed(() => getters.feed);
</script>

<style lang="scss">
  .feed-list {
    @media only screen and (min-width: 0) {
      padding: 0 16px;
      gap: 24px;
      li {
        width: 100%;
        max-width: 373px;
        padding: 16px 16px 8px;
        background: var(--bg-card);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        border: 1px solid var(--border-card);
        border-radius: 8px;
        a {
          color: var(--text-primary);
          h2, h3 {
            margin: 0;
            font-weight: 400;
            line-height: 3.3rem;
            color: var(--text-primary);
          }
          h2 {
            color: var(--text-primary);
            font-size: 2.8rem;
            text-transform: capitalize;
            overflow: hidden;
            overflow-wrap: break-word;
            font-weight: 500;
          }
          h3 {
            font-size: 2.3rem;
          }
          p {
            margin-top: 8px;
            font-size: 1.5rem;
            font-weight: 300;
          }
        }
      }
    }

    @media only screen and (min-width: 1024px) {
      li {
        padding: 24px 24px 24px;
      }
    }
  }
</style>