import { createStore } from 'vuex';
import axios from "axios";
import {arrangeFavorites, createId} from "../utils.js";
import {deleteData, getAllData, getData, saveData, updateData} from "./indexDB.js";
import router from "../router/index.js";

export default createStore ({
  state: {
    login_email_sent: false,
    bookmarks: [],
    feed: [],
    active_view: 'bookmarks',
    showAbout: false,
    bookmark: {},
    showOnlyFavorites: JSON.parse(localStorage.getItem('SHOW_ONLY_FAVORITES')) || false,
    search: '',
    sort: '',
    user: {},
    isAuthenticated: false,
    error: null,
    loading: false,
    isMigrating: false,
    dataSource: JSON.parse(localStorage.getItem('DATA_SOURCE')) || 'remote',
    showSettings: false,
    isAddBookmarkForm: false,
    isInactiveAddBookmarkCard: true,
    theme: localStorage.getItem('theme') || 'dark',
    themes: [
      {
        value: "dark",
        title: "Dark",
        icon: "🌙",
        description: "Dark theme for night use",
      },
      {
        value: "light",
        title: "Light",
        icon: "☀️",
        description: "Light theme for daytime",
      },
      {
        value: "midnight",
        title: "Midnight",
        icon: "🌊",
        description: "Deep midnight theme",
      },
    ],
  },
  mutations: {
    SET_STATE (state, {key, value}) {
      state[key] = value;
    },
    SHOW_ABOUT_BOOKMARK ( state ) {
      state.showAbout = !state.showAbout
    },
    SET_BOOKMARK (state, bookmark) {
      state.bookmark = bookmark;
    },
    SET_BOOKMARK_FIELD (state, {name, value}) {
      state.bookmark[name] = value;
    },
    SET_MARKS (state, data) {
      state.bookmarks = data;
    },
    ADD_MARK (state, data) {
      state.bookmarks.push(data);
    },
    UPDATE_MARK (state, data) {
      const index = state.bookmarks.findIndex((o) => o.id === data.id);
      state.bookmarks[index] = { ...data };
    },
    DELETE_MARK (state, id) {
      state.bookmarks = state.bookmarks.filter(bookmark => bookmark.id !== id);
    },
    SET_LOADING (state, value) {
      state.loading = value;
    },
    SET_USER (state, user) {
      state.user = user;
      state.isAuthenticated = !!user;
    },
    SET_ERROR (state, error) {
      state.error = error;
    },
    CLEAR_ERROR (state) {
      state.error = null;
    },
    TOGGLE_UI_STATE (state, key) {
      state[key] = !state[key];
    },
    SET_UI_STATE (state, { key, value }) {
      state[key] = value;
    },
    SET_THEME (state, theme) {
      state.theme = theme;
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    },
    SET_SEARCH (state, query) {
      state.search = query;
    },
    CLEAR_SEARCH (state) {
      state.search = '';
    },
    SET_SORT (state, value) {
      state.sort = value;
      state.isInactiveAddBookmarkCard = !value;
    },
    TOGGLE_FAVORITE (state, id) {
      const bookmark = state.bookmarks.find(b => b.id === id);
      if (bookmark) bookmark.fav = !bookmark.fav;
    },
    OPEN_ADD_FORM (state, value) {
      state.isAddBookmarkForm = value;
      document.body.style.overflow = 'hidden';
    },
    CLOSE_ADD_FORM (state) {
      state.isAddBookmarkForm = false;
      document.body.style.overflow = '';
    },
    CLEAR_SORT (state) {
      state.sort = '';
    },
    TOGGLE_SHOW_FAVORITES(state) {
      state.showOnlyFavorites = !state.showOnlyFavorites;
      localStorage.setItem('SHOW_ONLY_FAVORITES', JSON.stringify(state.showOnlyFavorites));
    },
  },
  actions: {
    async get_marks ({commit, state}) {
      try {
        commit('SET_LOADING', true)
        let data;
        if (state.dataSource === 'local-couch') {
          data = await getAllData();
        } else {
          const response = await axios.get('/api/bookmarks');
          data = response.data;
        }
        commit('SET_MARKS', data);
      } catch (err) {
        console.log(err)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async get_feed ({commit, state}) {
      try {
        commit('SET_LOADING', true);
        const { data } = await axios.get('/api/feed');
        commit('SET_STATE', { key: 'feed', value: data });
        commit('SET_LOADING', false);
      }
      catch (err) {
        commit('SET_LOADING', false);
      }
    },
    async add_bookmark ({commit, state}, payload) {
      try {
        let data;
        if (state.dataSource === 'local-couch') {
          const id = createId();
          await saveData(id, {...payload, id});
          data = {...payload, id};
        } else {
          const response = await axios.post('/api/bookmark', payload);
          data = response.data;
        }
        commit('ADD_MARK', data);
      } catch (err) {
        console.log(err)
      }
    },
    async update_bookmark ({commit, state}, payload) {
      try {
        if (state.dataSource === 'local-couch') {
          await updateData(payload.id, payload);
        } else {
          await axios.put('/api/bookmark', payload);
        }
        commit('UPDATE_MARK', payload);
      } catch (err) {
        console.log(err)
      }
    },
    async increment_bookmark_count({ commit, state }, id) {
      try {
        await axios.put(`/api/bookmark/${id}`, {});
      } catch (err) {
        console.error("Failed to increment count:", err);
      }
    },
    async delete_bookmark ({commit, state}, id) {
      try {
        if (state.dataSource === 'local-couch') {
          await deleteData(id)
        } else {
          await axios.delete(`/api/bookmark/${id}`);
        }
        commit('DELETE_MARK', id);
      } catch (err) {
        console.log(err);
      }
    },
    // Modified login action - return success/failure instead of navigating
    async login_by_email ({commit}, credentials) {
      try {
        commit('SET_LOADING', true);
        const { data: user } = await axios.post(`/api/login-by-email`, credentials);
        commit('SET_USER', user);
        commit('SET_LOADING', false);
        commit('SET_STATE', { key: 'login_email_sent', value: true });
      }
      catch (error) {
        commit('SET_LOADING', false)
        let errorMessage = 'Login failed. Please try again.';
        if (error.response) {
          if (error.response.status === 401) {
            errorMessage = 'Invalid username or password';
          }
        } else if (error.request) {
          errorMessage = 'Network error. Please check your connection';
        }
        commit('SET_ERROR', errorMessage);
        return { success: false, error: errorMessage }; // Return error instead of navigating
      }
    },
    async login ({commit}, credentials) {
      try {
        commit('SET_LOADING', true);
        const { data: user } = await axios.post(`/api/login`, credentials);
        commit('SET_USER', user);
        commit('SET_LOADING', false);
        commit('SET_STATE', { key: 'login_email_sent', value: true });
        await router.push('/');
      }
      catch (error) {
        commit('SET_LOADING', false)
        let errorMessage = 'Login failed. Please try again.';
        if (error.response) {
          if (error.response.status === 401) {
            errorMessage = 'Invalid username or password';
          }
        } else if (error.request) {
          errorMessage = 'Network error. Please check your connection';
        }
        commit('SET_ERROR', errorMessage);
        return { success: false, error: errorMessage }; // Return error instead of navigating
      }
    },
    // Modified logout action - return success/failure instead of navigating
    async logout ({ commit }) {
      try {
        await axios.delete('/api/logout');
        localStorage.removeItem('SHOW_ONLY_FAVORITES');
        commit('SET_USER', {});
        commit("SET_UI_STATE", { key: "showSettings", value: false });
        return await router.push('/login');
      }
      catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: error.message };
      }
    },
    // Modified get_user action - remove navigation logic
    async get_user ({commit}) {
      try {
        const {data: user} = await axios.get(`/api/login`)
        if (user.name) {
          commit('SET_STATE', {key: "user", value: user})
          return true; // Return success
        }
        return false; // Return failure if no user name
      } catch (err) {
        console.log(err)
        throw err; // Throw error to be caught by router guard
      }
    },
    async export_user_data ({ commit }) {
      try {
        const { data } = await axios.get("/api/export-user-data");

        // 1. Convert response to formatted JSON
        const json = JSON.stringify(data, null, 2);

        // 2. Create a Blob
        const blob = new Blob([json], { type: "application/json" });

        // 3. Create a temporary download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");

        // 4. File name (safe + readable)
        const timestamp = new Date().toISOString().split("T")[0];
        a.href = url;
        a.download = `savelink-data-${timestamp}.json`;

        // 5. Trigger download
        document.body.appendChild(a);
        a.click();

        // 6. Cleanup
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

      } catch (err) {
        console.error("Export failed:", err);
      }
    },
    async delete_user_account ({ commit }) {
      try {
        await axios.delete(`/api/delete-user-account`);
        return { ok: true };
      }
      catch (err) {
        console.log(err)
      }
    }
  },
  getters: {
    showAbout: (state) => state.showAbout,
    loadingBookMarks: state => state.loading,
    isAuthenticated: state => state.isAuthenticated,
    currentUser: state => state.user,
    authError: state => state.error,
    dataSource: state => state.dataSource,
    isMigrating: state => state.isMigrating,
    search: state => state.search,
    bookmarks: state => {
      let results = state.bookmarks.slice();

      if (state.search) {
        results = state.bookmarks.filter(o =>
          o.name?.toLowerCase().includes(state.search?.toLowerCase())
        );
      }

      if (state.sort) {
        results = state.bookmarks.filter(o =>
          o.name?.toLowerCase().startsWith(state.sort?.toLowerCase())
        );
      }

      if (state.showOnlyFavorites) {
        results = results.filter(o => o.fav);
      }

      results = results.sort((a, b) => b.count - a.count);
      return arrangeFavorites(results);
    },
    feed: state => {
      let results = state.feed.slice();

      if (state.search) {
        results = state.feed.filter(o =>
          o.name?.toLowerCase().includes(state.search?.toLowerCase())
        );
      }

      if (state.sort) {
        results = state.feed.filter(o =>
          o.name?.toLowerCase().startsWith(state.sort?.toLowerCase())
        );
      }

      // results = results.sort((a, b) => b.count - a.count);
      return results;
    },
    showOnlyFavorites: (state) => state.showOnlyFavorites,
    sort: (state) => state.sort,
    showSettings: (state) => state.showSettings,
    isAddBookmarkForm: (state) => state.isAddBookmarkForm,
    isInactiveAddBookmarkCard: (state) => state.isInactiveAddBookmarkCard,
    currentTheme: (state) => state.theme,
    availableThemes: (state) => state.themes,
  },
  modules: {}
})

document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'dark');

