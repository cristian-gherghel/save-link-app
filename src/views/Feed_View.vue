<template>
  <main class="feed-view">
    <AboutBookmark
      v-if="showAboutBookmark"
      @click="closeAboutBookmarkPanel" />

    <section class="main-header w100 search--section"
             :class="{ disable: isAddBookmarkForm,'is-scrolled': isScrolled }">
      <div class="flex flex-between">
        <div class="left-side-wrapper">
          <button class="access-about-card"
                  @click="closeAboutBookmarkPanel">
            ?
          </button>
        </div>

        <div class="search--bar flex align-center flex-between">
          <label for="search"
                 class="block flex-auto relative">
            <i class="search-icon"
               v-html="icons.search" />
            <input type="text"
                   id="search"
                   :value="search"
                   @input="Handle_Search"
                   placeholder="search bookmarks" />
            <i class="close-icon"
               v-show="search"
               v-html="icons.closeIcon"
               @click="Handle_Clear_Search" />
          </label>
        </div>

        <div class="flex align-center">
          <View_Tabs />

          <i class="settings-icon block"
             :class="{ 'rotate-icon': showSettings }"
             v-html="icons.settingsIcon"
             @click="Handle_Open_Settings" />
        </div>
      </div>

      <AlphabetSorting/>

      <div class="scroll-loader" :style="{ width: scrollProgress + '%' }" />
    </section>

    <section class="cards-section"
             :class="{'flex flex-center': !feed.length,
              'has-cards': feed.length}">
      <article
          v-if="!loadingBookmarks && !feed.length && searchQuery"
          class="empty-search-result"
      >
        <h3>No bookmark found with the name "{{ searchQuery }}"</h3>
        <p>Try searching with a different name or clear your search.</p>
      </article>

      <article
          class="empty-bookmarks-section"
          v-else-if="!feed.length && !searchQuery"
      >
        <h3 class="text-center empty-state-title">
          {{ favorite ? "You don't have any bookmarks in your favorites." : "You don't have any bookmarks yet" }}
        </h3>

        <template v-if="!favorite">
          <p>Start adding your favorite bookmarks!</p>
          <button @click="Handle_Show_New_Bookmark_Form">
            Add your first bookmark
          </button>
        </template>
      </article>

      <Feed_List v-show="feed.length" />
    </section>

    <footer class="main-footer fixed bottom0 w100 flex flex-between">
      <View_Tabs />
    </footer>

    <ThemeSwitcher />

    <img
        v-if="currentTheme !== 'light'"
        class="background-texture"
        :src="currentTheme === 'dark' ? backgroundDark : backgroundLight"
        alt="blur-orb">
  </main>
</template>

<script setup>
  import {SearchBar, AlphabetSorting, BookmarkCard, ThemeSwitcher, AboutBookmark} from "../components/index.js";
  import {icons, useBreakpoints} from "../utils.js";
  import backgroundDark from '../assets/backgroundblur.png'
  import backgroundLight from '../assets/backgroundblumarin.png'
  import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
  import "vue-skeletor/dist/vue-skeletor.css";
  import { Skeletor } from "vue-skeletor";
  import { useStore } from 'vuex';
  import store from "../store/index.js";
  import AddBookmarkForm from "../components/AddBookmarkForm.vue";
  import Feed_List from "../components/Feed_List.vue";
  import View_Tabs from "../components/View_Tabs.vue";

  const { state, getters, dispatch, commit } = useStore();
  const feed = computed(() => getters.feed);
  // feed.value.length === 0 && dispatch('get_feed');
  const { width } = useBreakpoints();

  const openMenuId = ref(null);
  const isScrolled = ref(false);
  const scrollProgress = ref(0);

  const showSettings = computed(() => state.showSettings);
  const active_view = computed(() => state.active_view);
  const search = computed(() => state.search);

  const favorite = computed(() => store.state.showOnlyFavorites)
  const showAboutBookmark = computed(() => store.state.showAbout)
  const isAddBookmarkForm = computed(() => getters.isAddBookmarkForm);
  const currentTheme = computed(() => getters.currentTheme);
  const searchQuery = computed(() => getters.search || "");
  const loadingBookmarks = computed(() => getters.loadingBookMarks);

  function Handle_Search (ev) {
    commit('SET_SEARCH', ev.target.value);
  }

  function Handle_Clear_Search (ev) {
    commit('SET_SEARCH', '');
    const input_tag = ev.currentTarget.parentElement.parentElement.querySelector('input');
    setTimeout(() => {
      input_tag.blur();
    }, 0);
  }

  function toggleMenu (id) {
    openMenuId.value = openMenuId.value === id ? null : id;
  }

  function Handle_Open_Settings () {
    commit('TOGGLE_UI_STATE', 'showSettings');
  }

  function handeSubmitForm (item) {
    const index = bookmarks.value.findIndex((o) => o.id === item.id);
    const action = index > -1 ? 'update_bookmark' : 'add_bookmark';
    dispatch(action, {...item, count: 0});
    commit('SET_BOOKMARK', {});
    handleCancelForm()
  }

  function handleCancelForm () {
    commit('OPEN_ADD_FORM', false)
    commit('CLOSE_ADD_FORM')
  }

  function closeAboutBookmarkPanel () {
    commit('SHOW_ABOUT_BOOKMARK')
  }
  function closeAllMenus () {
    openMenuId.value = null;
  }
  function handleIncrementCounting (bookmarkId) {
    dispatch("increment_bookmark_count", bookmarkId)
  }
  function handleDeleteBookmark (id) {
    dispatch("delete_bookmark", id);
  }

  function handleFavorite (item) {
    commit("TOGGLE_FAVORITE", item.id);
    dispatch("update_bookmark", item);
  }

  function handleBookmarkEdit (item) {
    commit("SET_BOOKMARK", { ...item });
    commit("OPEN_ADD_FORM", true);
    commit("SET_UI_STATE", { key: "showSettings", value: false });
  }
  function handleScroll () {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

    isScrolled.value = scrollTop > 50;
    scrollProgress.value = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  }
  
  function Handle_Show_New_Bookmark_Form () {
    commit("OPEN_ADD_FORM",true);
    commit("SET_UI_STATE", { key: "showSettings", value: false });
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  watch(searchQuery, async (newValue, oldValue) => {
    if (width.value < 1000 && newValue && newValue.trim().length > 0) {
      await nextTick();

      window.scrollTo({
        top: 0,
        behavior: 'auto'
      });
    }
  });
</script>

<style lang="scss">
  .feed-view {
    @media only screen and (min-width: 0) {
      width: 100%;

      background: var(--bg-icons), var(--bg-primary);
      background-repeat: repeat, repeat;
      background-position: center, center;
      background-size: auto, cover;
      background-attachment: fixed, fixed;

      .search-section {
        background: var(--bg-primary);
      }

      .main-header {
        top: 0;
        left: 0;
        position: fixed;
        z-index: 999;
        padding: 12px 16px;
        background: var(--bg-primary);

        .search--bar {
          width: 100%;
          max-width: 575px;
          label {
            margin-right: 24px;
            i {
              display: block;
              padding: 4px;
              position: absolute;
            }
          }
          .search-icon {
            left: 0;
            top: 4px;
            opacity: 0.7;
            path {
              fill: var(--text-primary);
            }
          }
          .close-icon {
            right: 0;
            top: 11px;
          }
          input {
            width: 100%;
            padding: 7px 0 9px 36px;
            background: transparent;
            color: white;
            border: none;
            font-size: 1.8rem;
            border-bottom: 1px solid #acacac;
            border-radius: 0;
            &:focus {
              outline: none;
            }
          }
        }

        .settings-icon {
          transform: translateY(1px);
          svg {
            transition: transform 0.4s ease;
            transform-origin: center;
            path {
              fill: var(--text-primary);
            }
          }
          &.rotate-icon svg {
            transform: rotate(90deg);
          }
        }

        .alphabet-sorting {
          margin-top: 16px;
        }

        .view-tabs {
          display: none;
        }
      }

      .main-footer {
        z-index: 999;
        padding: 8px 12px 8px 0;
        .add-bookmark-btn {
          transform: scale(0.9);
          transform-origin: right;
          padding: 8px;
          background-color: #dddddd;
          border-radius: 50%;
        }
      }

      .background-texture {
        position: fixed;
        z-index: 0;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
      }

      .access-about-card {
        display: none;
      }

      .search-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px 0 16px 0;
        .addbookmark-btn {
          display: none;
        }
      }

      .cards-section {
        min-height: 100%;
        &.has-cards {
          padding-top: 80px;
          padding-bottom: 220px;
        }

        .empty-search-result {
          overflow-y: hidden;
          padding: 20px;
          text-align: center;
          width: 100%;
          overflow-wrap: break-word;
          color: var(--text-primary);

          h3 {
            font-size: 2rem;
            margin-bottom: 10px;
            padding: 0 15px;
            line-height: 1.4;
          }
          p {
            font-size: 1.4rem;
            color: var(--text-tertiary);
          }
        }

        .empty-bookmarks-section {
          padding-top: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          h3 {
            color: var(--text-primary);
            font-size: 2.8rem;
            font-weight: 600;
            margin-bottom: 16px;
            padding: 0 20px;
            text-align: center;
            line-height: 1.4;
          }
          p {
            font-size: 1.6rem;
            color: var(--text-tertiary);
            margin-bottom: 32px;
            max-width: 400px;
            line-height: 1.6;
            text-align: center;
            padding: 0 20px;
          }
          button {
            background: var(--btn-primary-bg);
            color: white;
            border: none;
            padding: 12px 32px;
            border-radius: 25px;
            font-size: 1.6rem;
            font-weight: 500;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
            transition:transform 0.15s ease;
            z-index: 10;
            &:hover {
              transform: translateY(-2px);
            }
            &:active {
              transform: translateY(0);
            }
          }
        }

        .card__image {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 0;
          span {
            width: 278px;
            height: 89px;
            background-color: var(--bg-primary);
            border: 1px solid var(--border-card);
            border-radius: 16px;
          }
        }

        .card-container {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
          align-items: center;
          position: relative;
          z-index: 10;
        }
      }
    }

    @media only screen and (min-width: 1024px) {
      .main-header {
        .settings-icon {
          transform: translateY(2px);
          margin-left: 16px;
          cursor: pointer;
        }
        .view-tabs {
          display: flex;
        }
      }

      .main-footer {
        padding: 24px;
        .view-tabs {
          display: none;
        }
        .add-bookmark-btn {
          cursor: pointer;
          padding: 12px;
          &:hover {
            svg {
              transform: scale(1.2);
              transform-origin: center;
            }
          }
        }
      }

      .search-section {
        position: sticky;
        top: 0;
        padding: 5px 0 20px 0;
        z-index: 50;
        &::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--bg-primary);
          z-index: -1;
        }

        .scroll-loader {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--accent-primary), #818cf8);
          transition: width 0.1s ease;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
        }
        .search-container {
          .addbookmark-btn {
            color: white;
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 0 0 0 30px ;
            padding: 14px 21px;
            border-radius: 4px;
            font-size: 1.6rem;
            border: 1px solid #64748B;
            background-color: var(--button-addbookmark);
          }
        }
      }

      .left-side-wrapper {
        width: 132px; // same width as the right side div
      }
      .access-about-card {
        width: 30px;
        height: 30px;
        left: 34px;
        top: 34px;
        font-size: 1.8rem;
        font-weight: bold;
        color: var(--input-border);
        background: transparent;
        border: 1px solid var(--input-border);
        border-radius: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        z-index: 9999999;
        transition: scale 0.1s ease-in;
        &:hover {
          scale: 1.1;
        }
      }

      .cards-section {
        max-width: 1200px;
        margin: 0 auto;
        padding-top: 0;
        &.has-cards {
          padding-top: 140px;
        }

        .card__image {
          justify-content: start;
          margin-top: 50px;
          span {
            height: 171px;
          }
        }
        .card-container {
          //padding: 50px 0;
          gap: 29px;
          justify-content: center;
          &.few-items {
            justify-content: start;
          }
        }
      }
    }
  }
</style>