<script>
    import { headerIsOpen } from '$lib//store'
    import Brand from './Brand.svelte'
    import Menu from './Menu.svelte'
    import MenuIcon from './MenuIcon.svelte'

    export let sticky = false
    export let constrained = false
    export let collapsible = false
    export let horizontal = false
  </script>

  <!-- MARKUP -->
  <header class:sticky>
    <section class:constrained>
      <Brand />

      <div class="menu" class:open={$headerIsOpen}>
        {#if collapsible}
          <MenuIcon bind:open={$headerIsOpen} />
        {/if}

        <Menu horizontal={horizontal}>
          <slot />
        </Menu>
      </div>
    </section>
  </header>

  <!-- STYLES -->
  <style lang="scss">
    header {
      padding: 0.5em 1em 0.7em;
      background-color: var(--header-color);
      z-index: 1;
      display: flex;
      justify-content: center;
      backdrop-filter: blur(0.2em);
    }

    section {
      flex: 1;
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      align-items: center;
      column-gap: 2em;

      &.constrained {
        max-width: var(--max-page-width);
      }
    }

    div.menu {
      flex: 1;
      padding: 0.8em 0;

      &.open {
        @media (max-width: 400px) {
          flex: 1 100%;
          padding-top: 0;
        }
      }
    }

    .sticky {
      border-bottom: 1px solid var(--primary-color);
      box-shadow: 0 0 1em rgba(0,0,0,0.2);
      top: 0;
      position: sticky;
    }
  </style>
