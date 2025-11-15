<template>
  <footer class="powered-by-footer">
    <div class="footer-content">
      <span class="powered-text">powered by</span>
      <img src="../assets/superdevlogo.png" alt="superdev-logo">
    </div>
  </footer>
</template>

<script setup>

</script>

<style lang="scss">
.powered-by-footer {
  @media only screen and (min-width: 0) {
    position: fixed;
    left: 0;
    bottom: 10px;
    right: 0;
    z-index: 1;
    padding: 20px;
    display: flex;
    justify-content: center;

    .footer-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      font-size: 1.1rem;
      letter-spacing: 0.5px;
      img {
        width: 50px;
      }

      .powered-text {
        color: var(--text-tertiary);
        font-weight: 300;
        font-size: 1rem;
      }
    }
  }
}
</style>