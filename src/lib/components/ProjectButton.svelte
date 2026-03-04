<script lang="ts">
  export let ariaLabel: string = 'Visit project';
  export let type: 'button' | 'submit' | 'reset' = 'button';
</script>

<button class="project-button" aria-label={ariaLabel} type={type}>
  <span class="btn-content"><slot /></span>
  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M13.7786 8.62136L6.30886 8.64017L6.31458 6.37172L17.6569 6.34314L17.6283 17.6854L15.3598 17.6911L15.3786 10.2214L7.14315 18.4569L5.54315 16.8569L13.7786 8.62136Z" fill="currentColor" />
  </svg>
</button>

<style>
:global(.project-button) {
  --accent: #ff8a00; /* orange */
  font-family: 'Consolas', 'Courier New', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1rem;
  border-radius: 0.3rem;
  border: 2px solid var(--accent);
  background: transparent;
  color: var(--accent);
  cursor: pointer;
  overflow: hidden;
  isolation: isolate;
  transition: color 220ms ease;
  line-height: 1;
}

:global(.project-button::before) {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--accent);
  transform-origin: left center;
  transform: scaleX(0);
  transition: transform 420ms cubic-bezier(.2,.9,.2,1);
  z-index: 0;
}

:global(.project-button .btn-content) {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.08em; /* added spacing */
  transition: letter-spacing 180ms ease;
}

:global(.project-button .icon) {
  width: 1.05rem;
  height: 1.05rem;
  position: relative;
  z-index: 1;
  fill: currentColor;
  transition: fill 220ms ease, transform 220ms ease;
  transform: none; /* keep original icon orientation */
}

:global(.project-button:hover::before), :global(.project-button:focus-visible::before) {
  transform: scaleX(1);
}

:global(.project-button:hover), :global(.project-button:focus-visible) {
  /* Set text to match the page background color on hover for the "switch color scheme" effect */
  color: var(--bg-color, #121212);
  transition: color 220ms ease;
}

/* Make the arrow match the page background color as well */
:global(.project-button:hover .icon), :global(.project-button:focus-visible .icon) {
  fill: var(--bg-color, #121212);
}

/* Slightly increase letter-spacing on hover for a subtle effect */
:global(.project-button:hover .btn-content), :global(.project-button:focus-visible .btn-content) {
  letter-spacing: 0.12em;
}

/* Focus styles */
:global(.project-button:focus-visible) {
  outline: 3px solid rgba(255,138,0,0.18);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  :global(.project-button::before) {
    transition: none;
    transform: scaleX(1);
  }
  :global(.project-button) { transition: none; }
}

@media (max-width: 768px) {
  :global(.project-button) {
    padding: 0.5rem 0.9rem;
  }
}
</style>
