<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';

  const active = writable(0);
  let sections: Element[] = [];
  let items: { el: Element; active: boolean }[] = [];
  let observer: IntersectionObserver | null = null;
  let mutObserver: MutationObserver | null = null;
  let navEl: HTMLElement | null = null;

  onMount(() => {
    // Find elements that should be tracked and build items list
    const build = () => {
      // restrict tracked elements to the same top-level `.section` that contains this nav
      const root = (navEl ? (navEl.closest('.section') ?? document.body) : document.body) as Element;
      sections = Array.from(root.querySelectorAll('[data-scroll]'));
      items = sections.map((el) => ({ el, active: false }));

      if (observer) {
        observer.disconnect();
        observer = null;
      }

      if (!sections.length) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const idx = sections.indexOf(entry.target as Element);
              if (idx >= 0) {
                items = items.map((it, i) => ({ ...it, active: i === idx }));
                active.set(idx);
              }
            }
          });
        },
        // Adjusted rootMargin to center the "active" detection better
        { root: null, rootMargin: '-45% 0px -45% 0px', threshold: 0 }
      );

      sections.forEach((el) => observer?.observe(el));
    };

    build();

    mutObserver = new MutationObserver(() => build());
    const observeRoot = (navEl ? (navEl.closest('.section') ?? document.body) : document.body) as Node;
    mutObserver.observe(observeRoot, { childList: true, subtree: true });
  });

  onDestroy(() => {
    observer?.disconnect();
    mutObserver?.disconnect();
  });

  function scrollToIndex(i: number) {
    const item = items[i];
    if (!item || !item.el) return;
    item.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
</script>

<nav bind:this={navEl} class="scroll-nav" aria-hidden="false">
  {#if items.length}
    {#each items as item, i}
      <div class="nav-item">
        
        <button 
          class="diamond-wrapper" 
          on:click={() => scrollToIndex(i)} 
          aria-label="Scroll to section {i + 1}"
        >
          <div 
            class="diamond" 
            class:active={item.active} 
            aria-current={item.active ? 'true' : 'false'}
          ></div>
        </button>

        {#if i < items.length - 1}
          <div class="connector" aria-hidden="true"></div>
        {/if}
        
      </div>
    {/each}
  {/if}
</nav>

<style>
  .scroll-nav {
    position: fixed;
    right: 2rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    /* REMOVED: gap: 0.6rem; -> We want flush items for the line to look continuous */
    z-index: 60;
    pointer-events: auto;
  }

  .nav-item {
    display: flex;
    align-items: center;
    flex-direction: column;
    /* REMOVED: padding. This ensures items stack perfectly */
  }

  .diamond-wrapper {
    /* This wraps the diamond to create a larger click target and manage spacing */
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    
    /* CRITICAL: The diamond is 14px. Rotated 45deg, it becomes approx 20px tall.
       We set this height to 30px to provide a "Safe Zone" so the line 
       doesn't overlap the diamond tips.
    */
    height: 48px; 
    width: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .diamond {
    width: 14px;
    height: 14px;
    background: rgba(255, 255, 255, 0.25);
    transform: rotate(45deg);
    transition: all 200ms ease;
    border-radius: 2px;
    /* REMOVED margins here, handled by wrapper */
  }

  .diamond.active {
    background: #fff;
    width: 16px;
    height: 16px;
    /* Scale is okay here because the wrapper has extra space */
    transform: rotate(45deg); 
    box-shadow: 0 0 10px rgba(255,255,255,0.5);
  }

  /* The connector now purely bridges the gap between wrappers */
  .connector {
    width: 2px;
    height: 30px; /* Adjust this to change the distance between diamonds */
    background: rgba(255, 255, 255, 0.12);
    border-radius: 1px;
    /* REMOVED: margins. The wrapper height handles the spacing. */
  }

  .diamond-wrapper:hover .diamond {
    background: rgba(255, 255, 255, 0.8);
  }

  @media (max-width: 768px) {
    .scroll-nav {
      right: 1rem;
    }
  }
</style>