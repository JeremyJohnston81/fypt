<script>
    import { slide } from 'svelte/transition'
    import { headerIsOpen } from '$lib/store'
    
    export let horizontal = true
  </script>
  
  
  <section>
    {#if $headerIsOpen}
      <nav transition:slide={{ duration: 200 }} class:horizontal>
        <slot />
      </nav>
    {/if}
  </section>
  
  <!-- STYLES -->
  <style lang="scss">
    section {
      flex: 1 100%;
      display: flex;
      flex-flow: column;
      align-items: flex-end;
    }
  
    nav {
      display: flex;
      font-size: 1.1rem;
      column-gap: 1.2em;
      row-gap: 0.8em;
      align-items: center;
      justify-content: flex-end;
      flex-flow: column;
      align-items: flex-end;
      transition: all 0.2s ease-in-out;
  
      &.horizontal {
        flex-flow: row wrap;
        row-gap: 0.8em;
      }
    }
  
    :global(header nav a) {
      color: var(--primary-color);
      text-decoration: none !important;
      line-height: 0.9em;
  
      &:hover:not(.active) {
        opacity: 0.7;
      }
    }
  
    :global(header nav a.active) {
      color: var(--accent-color);
      border-bottom: 2px solid;
      margin-bottom: calc(-1 * 2px);
      text-decoration: none;
  
      cursor: default;
      pointer-events: none;
    }
  
    div {
      cursor: pointer;
    }
  </style>