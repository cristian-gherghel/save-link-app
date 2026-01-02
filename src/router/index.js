import { createRouter, createWebHistory } from 'vue-router'
import store from "../store/index.js";
import HomeView from "../views/HomeView.vue";
import FeedView from "../views/Feed_View.vue";
import LoginView from '../views/LoginView.vue'
import Login_Password_View from '../views/Login_Password.vue';
import About from "../views/About.vue";

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/login-password',
    name: 'login_password',
    component: Login_Password_View
  },
  {
    path: '/',
    redirect: '/public-feed',
  },
  {
    path: '/private-bookmarks',
    name: 'Private_Bookmarks',
    meta: { auth: true },
    component: HomeView
  },
  {
    path: '/public-feed',
    name: 'Public_Feed',
    component: FeedView,
    // beforeEnter: async (to, from, next) => {
    //   await store.dispatch('get_feed');
    //   next();
    // }
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not_found',
    redirect: '/about'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async function (to, from, next) {
  if (to.name === 'login') {
    return next();
  }

  if (to.meta?.auth && !store.state.user?.name) {
    try {
      const is_user = await store.dispatch('get_user');
      if (is_user) {
        next();
      } else {
        next('/login');
      }
    } catch (error) {
      next('/login');
    }
  } else {
    next();
  }
});



export default router