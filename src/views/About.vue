<template>
  <main class="about-view">
    <header class="hero">
      <h1>Save the web you care about.</h1>
      <h2>A calm, minimal home for your favorite links — always one new tab away.</h2>

      <div class="hero-actions">
        <RouterLink class="link" to="/login">Login</RouterLink>
        <RouterLink class="btn" to="/">Open bookmarks</RouterLink>
      </div>
    </header>

    <section class="block">
      <p class="lead">
        I built Savelink because I wanted a noise-free space for the internet — a place that feels fast, clean, and
        pleasant to use. After years of trying spreadsheets, browser folders, “read later” apps, and heavy bookmark
        managers, I still couldn’t find something that matched how I actually browse.
      </p>

      <ul class="bullets">
        <li><strong>No noise.</strong> A focused space with zero clutter.</li>
        <li><strong>Less is more.</strong> Extreme minimalism on purpose — because attention is precious.</li>
        <li><strong>Built by a senior dev.</strong> I cared about the small details: speed, typography, and flow.</li>
        <li><strong>Nothing similar.</strong> I wanted bookmarks to feel like a curated shelf, not an attic.</li>
        <li><strong>New tab, instantly.</strong> Open a tab and your saved cards are already there.</li>
        <li><strong>Simple extension.</strong> Save the current page in one click — no labels, tags, or extra steps.</li>
        <li><strong>Everywhere.</strong> Use it on any device, any screen size, whenever you need it.</li>
      </ul>
    </section>

    <section class="block">
      <h3>How it works</h3>
      <p>
        Install the Chrome extension first — it enables the new-tab experience and lets you save links instantly from
        the page you’re on. Then log in with your email. That’s it: open a new tab to browse your cards, or hit search
        to find anything in seconds.
      </p>

      <div class="actions">
        <a
          class="btn"
          href="https://chromewebstore.google.com/detail/savelink-app-extension/ebacofedninglhlapjlfkkdihpgpbadk?authuser=1&pageId=none"
          target="_blank"
          rel="noreferrer"
        >
          Get the Chrome extension
        </a>
        <RouterLink class="link" to="/login">Continue to login</RouterLink>
      </div>
    </section>

    <section class="block">
      <h3>Creating an account</h3>
      <p>
        There’s no sign-up form. Just enter your email on the login page and you’ll receive a magic link.
        Click it and you’re in — no passwords to create, remember, or reset.
      </p>
    </section>

    <section class="block">
      <h3>Open project</h3>
      <p>
        Savelink is an open project. The source code is public and available for anyone
        who’s curious about how it’s built, wants to learn from it, or simply values
        transparency.
      </p>

      <p>
        I believe good tools should be understandable, inspectable, and built in the open —
        especially tools that deal with your personal space on the web.
      </p>

      <div class="actions">
        <a
          class="link"
          href="https://github.com/cristian-gherghel/save-link-app"
          target="_blank"
          rel="noreferrer"
        >
          View the project on GitHub →
        </a>
      </div>
    </section>

    <section class="block">
      <h3>About me</h3>

      <p>
        I’m Cristian — a senior web developer who’s been building and using the web since the late ’90s.
        Savelink is a personal project born out of years of navigating the internet every day and caring
        deeply about tools that respect attention, speed, and simplicity.
      </p>

      <p>
        If you want to share feedback, ideas, or just say hello, you can reach me here:
      </p>

      <div class="actions">
        <a
          class="link"
          href="mailto:electronrecord@gmail.com"
        >
          electronrecord@gmail.com
        </a>

        <a
          class="link"
          href="https://www.linkedin.com/in/cristian-gherghel-it-specialist/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>

        <a
          class="link"
          href="https://resume.superdev.ro/cristian-gherghel"
          target="_blank"
          rel="noreferrer"
        >
          Résumé →
        </a>
      </div>
    </section>

    <section class="block">
      <h3>Privacy</h3>
      <p>
        Your bookmarks are yours. Savelink is built to respect privacy and attention: no data selling, no hidden
        tracking games. I built this because I’m the same kind of user — I don’t want my data used against me either.
      </p>
    </section>

    <section class="block danger"
             v-if="user.name">
      <h3>Export or delete your account</h3>
      <p>
        If you ever want to leave, you can. I recommend exporting your data first so you keep a copy of your bookmarks.
        Then you can delete your account.
      </p>

      <div class="actions">
        <button class="btn" type="button"
                @click="Export_User_Date">Export data</button>
        <button class="btn btn-ghost" type="button"
                @click="Delete_User_Account">Delete account</button>
      </div>
    </section>

    <div v-if="deleted"
         class="delete-success">
      <h2>Account deleted</h2>
      <p>Your data has been permanently removed.</p>
      <p class="muted">Redirecting…</p>
    </div>
  </main>
</template>

<script setup>
  import { useStore } from "vuex";
  import {computed, ref} from "vue";
  import router from "../router/index.js";

  const { state, dispatch } = useStore();
  dispatch('get_user');
  const user = computed(() => state.user);
  const deleting = ref(false);
  const deleted = ref(false);

  function Export_User_Date () {
    dispatch("export_user_data");
  }

  async function Delete_User_Account () {
    const result = await dispatch("delete_user_account");
    if (result?.ok) {
      deleted.value = true;

      setTimeout(() => {
        console.log(`push log`)
        router.push("/login");
      }, 2500);
    }

    deleting.value = false;
  }
</script>

<style lang="scss">
  .about-view {
    max-width: 860px;            // slightly wider so bigger type still fits nicely
    margin: 0 auto;
    padding: 56px 20px 80px;

    color: var(--text-primary);
    background: transparent;

    // Stronger base typography
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, "Apple Color Emoji",
    "Segoe UI Emoji";
    font-size: clamp(16.5px, 1.15vw, 18.5px); // ⬅️ key change
    line-height: 1.75;                        // ⬅️ key change
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;

    @media (max-width: 520px) {
      padding: 40px 18px 64px;
    }

    // Headings: clearer hierarchy
    h1 {
      margin: 0;
      font-size: clamp(34px, 4.6vw, 56px);  // ⬅️ bigger
      line-height: 1.08;
      letter-spacing: -0.03em;
      font-weight: 800;
    }

    h2 {
      margin: 14px 0 0;
      font-size: clamp(18px, 2.0vw, 22px);  // ⬅️ bigger
      line-height: 1.45;
      font-weight: 500;
      color: var(--text-tertiary);
      max-width: 60ch;
    }

    h3 {
      margin: 0 0 12px;
      font-size: clamp(18px, 1.4vw, 20px);  // ⬅️ bigger
      line-height: 1.25;
      letter-spacing: -0.015em;
      font-weight: 700;
    }

    p {
      margin: 0;
      color: var(--text-secondary);
      max-width: 72ch;  // ⬅️ keeps lines readable with larger font
      font-size: 20px;
    }
  }

  .hero {
    margin-bottom: 34px;

    .hero-actions {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-top: 18px;
      flex-wrap: wrap;
    }
  }

  .block {
    margin-top: 34px;
    padding-top: 26px;
    border-top: 1px solid var(--border-card);

    .lead {
      font-size: clamp(21px, 1.1vw, 19px);  // ⬅️ bigger intro paragraph
      line-height: 1.8;
      color: var(--text-secondary);
      max-width: 72ch;
    }
  }

  .bullets {
    margin: 18px 0 0;
    padding-left: 20px;
    max-width: 72ch;

    li {
      margin: 12px 0;
      color: var(--text-secondary);
      font-size: clamp(19.5px, 1.0vw, 17.5px); // ⬅️ bigger bullet text
      line-height: 1.75;

      strong {
        color: var(--text-primary);
        font-weight: 700;
      }
    }
  }

  .actions {
    display: flex;
    gap: 16px;
    margin-top: 16px;
    align-items: center;
    flex-wrap: wrap;
  }

  // Buttons/links: slightly larger so they don’t look “tiny”
  .btn {
    appearance: none;
    border: 1px solid var(--btn-secondary-border);
    background: var(--btn-secondary-bg);
    color: var(--text-primary);
    border-radius: 14px;
    padding: 12px 14px;                   // ⬅️ larger hit area
    font-size: clamp(16px, 0.9vw, 15px);  // ⬅️ bigger label
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    user-select: none;
    transition: opacity 120ms ease, transform 120ms ease, background 120ms ease;

    &:hover {
      background: var(--bg-input-hover);
      color: var(--text-primary);
    }

    &:active {
      transform: translateY(1px);
    }
  }

  .btn-ghost {
    background: transparent;
    border: 1px solid var(--btn-secondary-border);
    opacity: 0.92;

    &:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.05);
    }
  }

  .link {
    color: var(--text-primary);
    font-size: clamp(16.5px, 0.95vw, 15.5px); // ⬅️ bigger
    text-decoration: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.24);
    padding-bottom: 2px;

    &:hover {
      border-bottom-color: var(--accent-primary);
      color: var(--text-primary);
    }
  }

  .danger {
    .note {
      margin-top: 14px;
      font-size: clamp(13.5px, 0.95vw, 14.5px); // ⬅️ not too tiny
      color: var(--text-tertiary);
    }
  }
</style>

