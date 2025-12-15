<template>
  <main class="login">
    <section class="login-container">
      <div class="form-section">
        <div>
          <h1>Welcome to SaveLink App</h1>
          <h2>Your personal bookmark organizer</h2>
        </div>

        <div class="text-center"
           v-if="login_email_sent">
          <h4>Email Sent</h4>
          <h5>Please check your inbox for your sign in link.</h5>

          <p class="spam">
            Sometimes this can land in <b>SPAM</b>!
            While we hope that isn't the case if it doesn't arrive in 
            a minute or three, please check <b>SPAM</b> folder too.
          </p>

          <p>
            <img src="../assets/chrome-extension-icon.png" alt="chrome extension icon">
            Download our
            <a class="underline"
               target="_blank"
               href="https://chromewebstore.google.com/detail/savelink-app-extension/ebacofedninglhlapjlfkkdihpgpbadk">
              Save link chrome extension</a> <br>
            to save bookmarks to your device.
          </p>
        </div>

        <div v-else>
          <h3 class="text-center">
            Sign in or create a free account
          </h3>

          <form @submit.prevent="handleLogin">
            <label for="email">
              Email
              <input
                autocomplete="email"
                v-model="credentials.username"
                type="email"
                id="email"
                placeholder="Enter your email"
                required
              >
            </label>

            <button type="submit"
                    :disabled="loading || !credentials.username">
              Email a login link
            </button>

            <div v-if="error"
                 class="error-message">
              {{ error }}
            </div>
          </form>
        </div>
      </div>
    </section>

    <Footer/>
  </main>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';
  import Footer from "../components/Footer.vue";
  import {icons} from "../utils.js";

  const { state, dispatch, commit } = useStore();

  const credentials = ref({
    username: '',
    password: ''
  });

  const loading = computed(() => state.loading);
  const error = computed(() => state.error);
  const login_email_sent = computed(() => state.login_email_sent);

  function handleLogin () {
    commit('CLEAR_ERROR');
    dispatch('login', credentials.value);
  }
</script>

<style lang="scss">
  .login {
    @media only screen and (min-width: 0) {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      padding: 40px 20px;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%);

      .login-container {
        max-width: 600px;
        width: 100%;
        margin-bottom: 200px;
        h3 {
          margin-bottom: 24px;
          padding: 0;
          font-size: 2.8rem;
          font-weight: 600;
          color: #e2e8f0;
        }

        h4 {
          margin-bottom: 12px;
          font-size: 2.6rem;
        }

        h5 {
          margin: 0;
          font-size: 2rem;
          font-weight: 500;
        }

        .p {
          margin: 0;
          padding: 0;
          font-size: 1.3rem;
          color: #cbd5e1;

          a {
            color: #60a5fa;
            text-decoration: none;
            font-weight: 500;

            &:hover {
              color: #93c5fd;
              text-decoration: underline;
            }
          }
        }

        p {
          font-size: 1.8rem;
          font-weight: 400;
          line-height: 3.7rem;
          img {
            width: 120px;
            margin: 0 auto 24px;
            display: block;
          }
          a {
            text-decoration: underline;
          }
          &.spam {
            font-size: 1.6rem;
            line-height: 2.7rem;
          }
        }
        .form-section {
          > div {
            max-width: 400px;
            margin: 0 auto 32px;
            text-align: center;

            h1 {
              margin: 0;
              padding: 0;
              font-size: 2.6rem;
              font-weight: 500;
              letter-spacing: -0.5px;
              color: #f1f5f9;
            }

            h2 {
              margin: 8px 0 24px 0;
              font-size: 1.8rem;
              font-weight: 400;
              letter-spacing: -0.5px;
              color: #f1f5f9;
            }
          }
          form {
            display: flex;
            flex-direction: column;
            width: 100%;

            /* Error message styling */
            .error-message {
              background-color: rgba(239, 68, 68, 0.1);
              border: 1px solid rgba(239, 68, 68, 0.3);
              color: #fca5a5;
              padding: 12px 16px;
              border-radius: 8px;
              margin-top: 16px;
              font-size: 1.3rem;
              text-align: center;
            }

            label {
              font-size: 1.6rem;
              font-weight: 500;
              margin-bottom: 16px;
              display: block;
              color: #e2e8f0;
              text-align: left;
            }

            input {
              background-color: rgba(51, 65, 85, 0.5);
              border: 1px solid rgba(148, 163, 184, 0.3);
              border-radius: 8px;
              margin-top: 6px;
              font-size: 1.6rem;
              padding: 12px 14px;
              width: 100%;
              color: #f1f5f9;
              transition: all 0.2s ease;

              &::placeholder {
                color: #94a3b8;
              }

              &:focus {
                outline: none;
                background-color: rgba(51, 65, 85, 0.7);
                border-color: #60a5fa;
                box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
              }
            }

            button {
              cursor: pointer;
              border: none;
              font-family: inherit;
              transition: all 0.2s ease;

              &[type="submit"] {
                background-color: #2563eb;
                color: white;
                font-size: 1.4rem;
                border-radius: 8px;
                padding: 12px;
                font-weight: 600;
                width: 100%;
                margin-top: 8px;

                &:hover:not(:disabled) {
                  background-color: #1d4ed8;
                }

                &:active:not(:disabled) {
                  transform: scale(0.98);
                }

                &:disabled {
                  opacity: 0.6;
                  cursor: not-allowed;
                }
              }
            }
          }
        }
      }
    }
  }
</style>