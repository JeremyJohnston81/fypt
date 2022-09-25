<script>
    import { range, durationUnitRegex } from "$lib/utils.js";
   // export let color = "#FF3E00";
    export let unit = "px";
    export let duration = "1.2s";
    export let size = 100;
  
    let durationUnit = duration.match(durationUnitRegex)[0];
    let durationNum = duration.replace(durationUnitRegex, "");
</script>
  
<style>
  .wrapper {
    height: var(--size);
    width: var(--size);
    display: inline-block;
    font-size: 10px;
  }
  .rect {
    height: 100%;
    width: 10%;
    display: inline-block;
    margin-right: 4px;
    background-color: var(--main-color);
    animation: stretch var(--duration) ease-in-out infinite;
  }
  @keyframes stretch {
    0%,
    40%,
    100% {
      transform: scaleY(0.4);
    }
    20% {
      transform: scaleY(1);
    }
  }

  .loading {
    position: fixed;
    z-index: 999999;
    overflow: show;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 50px;
    height: 50px;
  }

  .loading:before {
    content: '';
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 1.0);
  }
</style>
<div class="loading">
  <div
    class="wrapper"
    style="--size: {size}{unit}; --duration: {duration}">
    {#each range(5, 1) as version}
      <div
        class="rect"
        style="animation-delay: {(version - 1) * (+durationNum / 12)}{durationUnit}" />
    {/each}
  </div>
</div>  