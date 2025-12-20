import { createRouter, createWebHistory } from 'vue-router'
import store from "../store/index.js";
import HomeView from "../views/HomeView.vue";
import LoginView from '../views/LoginView.vue'
import Login_Password_View from '../views/Login_Password.vue'

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
    name: 'home',
    meta: {auth: true},
    component: HomeView,
    beforeEnter: async (to, from, next) => {
      await store.dispatch('get_marks');
      next();
    }
  },
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
      const ok = await store.dispatch('get_user');
      if (ok) {
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