<template>
  <main class="home">
    <button @click="closeAboutBookmarkPanel" class="access-about-card">
      ?
    </button>
    <AboutBookmark
        v-if="showAboutBookmark"
        @click="closeAboutBookmarkPanel" />
    <section
        :class="{ disable: isAddBookmarkForm,'is-scrolled': isScrolled }"
        class="search-section">
      <div
          class="search-container"
      >
        <SearchBar
            :theme="currentTheme"
            :scrollProgres="scrollProgress"
            @open-settings="handleOpenSettings"
            @click="handleShowForm"/>
        <button @click="handleShowForm" class="addbookmark-btn">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" fill="white"/>
          </svg>
          <span>Add Bookmark</span>
        </button>
      </div>
      <AlphabetSorting/>
      <div class="scroll-loader" :style="{ width: scrollProgress + '%' }"></div>
    </section>
    <section class="cards-section">
      <article
          v-if="!loadingBookmarks && !bookmarks.length && searchQuery"
          class="empty-search-result"
      >
        <h3>No bookmark found with the name "{{ searchQuery }}"</h3>
        <p>Try searching with a different name or clear your search.</p>
      </article>

      <article
          class="empty-bookmarks-section"
          v-else-if="!bookmarks.length && !searchQuery"
      >
        <h3 class="text-center empty-state-title">
          {{ favorite ? "You don't have any bookmarks in your favorites." : "You don't have any bookmarks yet" }}
        </h3>

        <template v-if="!favorite">
          <p>Start adding your favorite bookmarks!</p>
          <button @click="handleShowForm">Add your first bookmark</button>
        </template>
      </article>

      <ul v-if="loadingBookmarks" class="card__image">
        <li v-for="n in 3" :key="n" class="skeleton-item">
          <Skeletor />
        </li>
      </ul>

      <ul v-else-if="bookmarks.length" class="card-container" :class="{ 'few-items': bookmarks.length <= 2 }">
        <BookmarkCard
            v-for="(bookmark, index) in bookmarks"
            :key="bookmark.id || index"
            :theme="currentTheme"
            :data="bookmark"
            :isOpen="openMenuId === bookmark.id"
            @toggle-menu="toggleMenu"
            @close-menu="closeAllMenus"
            @delete="handleDeleteBookmark(bookmark.id)"
            @increment="handleIncrementCounting(bookmark.id)"
            @favorite="handleFavorite"
            @edit="handleBookmarkEdit"
        />
      </ul>
    </section>

    <ThemeSwitcher/>
    <AddBookmarkForm
        @submit="handeSubmitForm"
        @close="handleCancelForm"
        cy="bookmark-form"/>
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

const { getters, dispatch, commit } = useStore();
const { width, type } = useBreakpoints()

const openMenuId = ref(null);
const cardsListRef = ref(null);
const isScrolled = ref(false);
const scrollProgress = ref(0);

const bookmarks = computed(() => {
  return getters.bookmarks;
});


const favorite = computed(() => store.state.showOnlyFavorites)
const showAboutBookmark = computed(() => store.state.showAbout)
const showSettings = computed(() => getters.showSettings);
const isAddBookmarkForm = computed(() => getters.isAddBookmarkForm);
const currentTheme = computed(() => getters.currentTheme);
const themes = computed(() => getters.availableThemes);
const searchQuery = computed(() => getters.search || "");
const loadingBookmarks = computed(() => getters.loadingBookMarks)

function toggleMenu (id) {
  openMenuId.value = openMenuId.value === id ? null : id;
}

function handleOpenSettings () {
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
function handleShowForm () {
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
.home {
  @media only screen and (min-width: 0) {
    background: var(--bg-icons), var(--bg-primary);
    background-repeat: repeat, repeat;
    background-position: center, center;
    background-size: auto, cover;
    background-attachment: fixed, fixed;

    min-height: 100vh;
    width: 100%;

    .background-texture {
      position: fixed;
      z-index: 0;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .access-about-card {
      display: none;
    }
    .search-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 0 20px 0;
      .addbookmark-btn {
        display: none;
      }
    }
    .cards-section {
      padding-bottom: 20px;
      padding-top: 40px;

      .empty-search-result {
        margin-top: 10vh;
        margin-bottom: 20vh;
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
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 15vh;
        padding: 20px;

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
        margin-top: 0px;
        span {
          width: 278px;
          height: 89px;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-card);
          border-radius: 16px;
        }
      }

      .card-container {
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
  @media only screen and (min-width: 1000px) {
    .access-about-card {
      left: 34px;
      top: 34px;
      position: fixed;
      font-size: 1.8rem;
      font-weight: bold;
      color: var(--input-border);
      background: transparent;
      border: 1px solid var(--input-border);
      border-radius: 100%;
      width: 30px;
      height: 30px;
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
      padding-top: 0px;

      .card__image {
        justify-content: start;
        margin-top: 50px;
        span {
          height: 171px;
        }
      }
      .card-container {
        padding: 50px 0px;
        gap: 29px;
        justify-content: center;
        &.few-items {
          justify-content: start;
        }
      }
    }
    .search-section {
      position: sticky;
      top: 0px;
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
  }
}
</style>