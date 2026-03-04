<script lang="ts">
  import { onMount } from 'svelte';
  export let labels: string[] = [];
  let active = 0;
  let panelsEl: HTMLElement | null = null;

  function select(i: number) {
    active = i;
    updatePanels();
  }

  function onKeydown(e: KeyboardEvent) {
    const max = labels.length - 1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      select(Math.min(active + 1, max));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      select(Math.max(active - 1, 0));
    }
  }

  function updatePanels() {
    if (!panelsEl) return;
    const children = Array.from(panelsEl.children) as HTMLElement[];
    children.forEach((c, i) => {
      c.hidden = i !== active;
      c.setAttribute('aria-hidden', String(i !== active));
    });
  }

  onMount(() => {
    updatePanels();
  });
</script>

<div class="tabs">
  <div class="tab-list" role="tablist" on:keydown={onKeydown}>
    {#each labels as label, i}
      <button
        role="tab"
        aria-selected={i === active}
        tabindex={i === active ? 0 : -1}
        class:active-tab={i === active}
        on:click={() => select(i)}
      >
        {label}
      </button>
    {/each}
  </div>

  <div class="tab-panels" bind:this={panelsEl}>
    <slot />
  </div>
</div>

<style>
  .tabs { --accent: #ff8a00; }

  .tab-list {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    width: 100%;
  }
  .tab-list button {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.08);
    color: #ccc;
    padding: 0.55rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    flex: 1 1 0;
    text-align: center;
    min-width: 0;
    transition: background 180ms ease, color 180ms ease, border-color 180ms ease, transform 140ms ease;
  }
  .tab-list button:hover { transform: translateY(-1px); }

  .tab-list button.active-tab,
  .tab-list button[aria-selected="true"] {
    background: var(--accent);
    color: #0b0b0b;
    border-color: var(--accent);
    box-shadow: 0 10px 30px rgba(255,138,0,0.25);
    font-weight: 700;
  }
  .tab-panels > * {
    display: block;
    color: white;
  }
  .tab-panels > *[hidden] {
    display: none !important;
  }
</style>
