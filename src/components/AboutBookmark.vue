<template>
  <div class="about-overlay" @click.self="handleCloseAboutBookmark">
    <article class="about-panel">
      <button @click="handleCloseAboutBookmark">
        <i v-html="icons.closeIcon"></i>
      </button>
      <div class="about-content">
        <i v-html="icons.aboutBookMark"></i>
        <h5>Bookmark Manager</h5>
        <span>Version 1.0.0</span>
        <p>
          A modern and elegant bookmark management
          application to organize your favorite links.
        </p>
      </div>
      <div class="about-product">
        <h3>SUPER DEV TEAM</h3>
        <ul class="creators-section">
          <li>
            <i v-html="icons.ideaIcon"></i>
            <div>
              <a href="/" target="_blank">Cristian Gherghel</a>
              <span>Product Designer & Visionary</span>
            </div>
          </li>
          <li>
            <i v-html="icons.codeIcon"></i>
            <div>
              <a href="/" target="_blank">Dan Reutchi</a>
              <span>Front end developer</span>
            </div>
          </li>
        </ul>
        <ul class="social-section">
          <li>
            <a href="/">
              <i v-html="icons.linkedinIcon"></i>
              <span>LinkedIn</span>
            </a>
          </li>
          <li>
            <a href="/">
              <i v-html="icons.facebookIcon"></i>
              <span>Facebook</span>
            </a>
          </li>
        </ul>
      </div>
    </article>
  </div>
</template>

<script setup>
import { icons } from "../utils.js";
import {onMounted, onUnmounted} from "vue";

const emit = defineEmits(["click"]);

function handleCloseAboutBookmark() {
  emit("click");
}


onMounted(() => {
  document.body.style.overflow = "hidden";
});

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>

<style lang="scss">
.about-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999999;
}

.about-panel {
  @media only screen and (min-width: 0) {
    position: relative;
    backdrop-filter: blur(50px);
    background: rgba(15, 23, 42, 0.9);
    border: 1px solid rgba(#475569, 0.8);
    border-radius: 16px;
    width: 350px;
    z-index: 99999;
    color: #f8fafc;
    margin-bottom: 100px;

    button {
      background: transparent;
      display: flex;
      justify-content: end;
      padding: 15px 15px 0 0 ;
      width: 100%;
      border: none;
      cursor: pointer;

      i {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fe5f57;
        padding: 4px;
        border-radius: 100%;
        transition: background 0.3s ease;

        &:hover svg {
          opacity: 1;
        }
        svg {
          width: 8px;
          height: 8px;
          opacity: 0;
          transition: opacity 0.1s ease;
          path {
            fill: black;
          }
        }
      }
    }

    .about-content {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      h5 {
        font-size: 2rem;
        font-weight: 600;
        padding-top: 16px;
        margin: 0;
      }
      span {
        padding: 7px 0 14px 0;
        font-size: 1.3rem;
        color: #5ca762;
      }
      i {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 64px;
        height: 64px;
        background: rgba(#6366f1, 0.15);
        border-radius: 16px;
        border: 1px solid rgba(#6366f1, 0.2);
      }
      p {
        margin: 0;
        text-align: center;
        padding: 0 40px 10px 40px;
        color: #cbd5e1;
        font-size: 1.4rem;
        position: relative;
      }

      p::after {
        content: "";
        display: block;
        width: 100%;
        height: 1px;
        background-color: #262d3e;
        margin: 10px 0 0 0 ;
      }
    }

    .about-product {
      padding: 0 21px;
      > h3 {
        font-size: 1.4rem;
        font-weight: 600;
        color: #f8fafc;
      }
      .creators-section {
        li {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
          i {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 48px;
            height: 48px;
            border-radius: 100%;
            background: rgba(#6366f1, 0.15);
            border: 1px solid rgba(#6366f1, 0.2);
          }
          > div {
            a {
              display: block;
              color: #f8fafc;
              font-size: 1.5rem;
              margin: 0;
            }
            span {
              color: #94a3b8;
              font-size: 1.3rem;
            }
          }
        }
      }
      .social-section {
        margin: 24px 0 24px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        li {
          flex: 1;
          border: 1px solid rgba(#475569, 0.8);
          margin-bottom: 8px;
          border-radius: 12px;
          transition: background 0.2s ease;
          &:hover {
            background: rgba(white, 0.1);
          }
        }
        li > a {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          padding: 14px;
          text-decoration: none;
          span {
            font-size: 1.5rem;
            color: #f8fafc;
          }
        }
      }
    }
  }
  @media only screen and (min-width: 600px) {
    margin-bottom: 0px;
    button {
      padding: 15px;
    }
    .about-product {
      padding-bottom: 20px;
      .social-section {
        display: initial;
        padding-bottom: 10px;
        li > a {
          justify-content: start;
        }
      }
    }
  }
}
</style>
