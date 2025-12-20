import { createStore } from 'vuex';
import axios from "axios";
import {arrangeFavorites, createId} from "../utils.js";
import {deleteData, getAllData, getData, saveData, updateData} from "./indexDB.js";
import router from "../router/index.js";

export default createStore ({
  state: {
    login_email_sent: false,
    bookmarks: [],
    showAbout: false,
    bookmark: {},
    showOnlyFavorites: JSON.parse(localStorage.getItem('SHOW_ONLY_FAVORITES')) || false,
    search: '',
    sort: '',
    user: null,
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
    showOnlyFavorites: (state) => state.showOnlyFavorites,
    sort: (state) => state.sort,
    showSettings: (state) => state.showSettings,
    isAddBookmarkForm: (state) => state.isAddBookmarkForm,
    isInactiveAddBookmarkCard: (state) => state.isInactiveAddBookmarkCard,
    currentTheme: (state) => state.theme,
    availableThemes: (state) => state.themes,
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
    async logout ({commit}) {
      try {
        await axios.delete('/api/logout');
        localStorage.removeItem('AuthSession');
        localStorage.removeItem('user');
        localStorage.removeItem('SHOW_ONLY_FAVORITES');

        commit('SET_USER', null);
        await router.push('/login');
        return { success: true };
        commit("SET_UI_STATE", { key: "showSettings", value: false });
        // Return success instead of navigating
      } catch (error) {
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
    async migrate_data ({ commit, dispatch }, { from, to }) {
      try {
        commit('SET_LOADING', true);
        console.log(`Migrating data from ${from} to ${to}`);

        let sourceData = [];

        if (from === 'local-couch') {
          sourceData = await getAllData();
        } else if (from === 'remote') {
          const response = await axios.get('/api/bookmarks');
          sourceData = response.data;
        }

        if (sourceData.length > 0) {
          if (to === 'local-couch') {
            for (const bookmark of sourceData) {
              await saveData(bookmark.id, bookmark);
            }
          } else if (to === 'remote') {
            for (const bookmark of sourceData) {
              await axios.post('/api/bookmark', bookmark);
            }
          }
        }
        commit('SET_STATE', {key: 'dataSource', value: to});
        await dispatch('get_marks');
        commit('SET_LOADING', false);
        return true;
      } catch (error) {
        commit('SET_LOADING', false);
        console.error('Migration error:', error);
        throw error;
      }
    },
    async migrate ({ commit }) {
      try {
        commit('SET_STATE', {key: 'isMigrating', value: true});
        const sourceData = await getAllData();
        console.log({sourceData})

        for (const bookmark of sourceData) {
          await axios.post('/api/bookmark', bookmark);
        }
        commit('SET_STATE', {key: 'isMigrating', value: false});
      } catch (err) {
        console.error("Migration failed:", err);

      }
    }
  },
  modules: {

  }
})

document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'dark');

