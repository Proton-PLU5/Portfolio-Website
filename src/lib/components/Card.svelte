<script lang="ts">
  export let className: string = '';
  export let compact: boolean = false;
</script>

<article class={`card ${compact ? 'card--compact' : ''} ${className}`} role="group">
  <div class="card-inner">
    <slot />
  </div>
</article>

<style>
  .card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 0.75rem;
    padding: 1.25rem;
    box-shadow: 0 6px 18px rgba(0,0,0,0.35);
    color: #eaeaea;
    transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
    width: 100%;
  }

  .card:hover {
    transform: translateY(-6px);
    border-color: rgba(255,255,255,0.12);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }

  .card--compact {
    padding: 0.75rem;
  }

  /* * FIX: Use .card-inner :global(tag) 
   * This compiles to ".card-inner.svelte-xyz h1" which has 
   * higher specificity than generic global styles.
   */
  
  /* Shared styles for all headings in the card */
  .card-inner :global(h1),
  .card-inner :global(h2),
  .card-inner :global(h3) {
    margin: 0 0 0.25rem 0;
    color: #fff;
    line-height: 1.1;
  }

  .card-inner :global(.horizontal-separator) {
    width: 100%;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin: 0.5rem 0 0.75rem 0;
  }

  /* Job title */
  .card-inner :global(h1) {
    font-size: 2rem;
    font-weight: 700;
  }

  /* Company / organisation */
  .card-inner :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    opacity: 0.9;
  }

  /* Date / meta */
  .card-inner :global(h3) {
    font-size: 1rem;
    font-style: italic;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-weight: 500;
    opacity: 0.8;
  }

  /* Description text */
  .card-inner :global(p) {
    margin: 0.5rem 0 0 0;
    color: rgba(255,255,255,0.85);
    line-height: 1.4;
    font-size: 1rem;
  }

  @media (max-width: 640px) {
    .card { padding: 1rem; }
  }
</style>