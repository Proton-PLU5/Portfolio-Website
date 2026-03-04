<script lang="ts">
  export let href = '#';
  export let ariaLabel: string = '';
  export let rel: string | undefined = undefined;
  export let target: string | undefined = undefined;
</script>

<a
  class="nav-button"
  href={href}
  aria-label={ariaLabel || undefined}
  rel={rel}
  target={target}
>
  <span class="btn-content"><slot /></span>
</a>

<style>
:global(.nav-button) {
  --accent: #ff8a00;
  --bg-color: #121212;
  --nav-idle: rgba(255, 255, 255, 0.78);
  font-family: 'Consolas', 'Courier New', monospace;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.55rem 1rem;
  border-radius: 0.4rem;
  border: 2px solid rgba(255, 255, 255, 0.28);
  background: transparent;
  color: var(--nav-idle);
  cursor: pointer;
  overflow: hidden;
  isolation: isolate;
  transition: color 220ms ease, transform 140ms ease, border-color 220ms ease;
  text-decoration: none;
  letter-spacing: 0.08em;
  line-height: 1;
}

:global(.nav-button::before) {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--accent);
  transform-origin: left center;
  transform: scaleX(0);
  transition: transform 420ms cubic-bezier(.2,.9,.2,1);
  z-index: 0;
}

:global(.nav-button .btn-content) {
  position: relative;
  z-index: 1;
  font-weight: 700;
  transition: letter-spacing 180ms ease;
}

:global(.nav-button:hover::before),
:global(.nav-button:focus-visible::before) {
  transform: scaleX(1);
}

:global(.nav-button:hover),
:global(.nav-button:focus-visible) {
  color: var(--bg-color);
  border-color: var(--accent);
}

:global(.nav-button:hover .btn-content),
:global(.nav-button:focus-visible .btn-content) {
  letter-spacing: 0.12em;
}

:global(.nav-button:focus-visible) {
  outline: 3px solid rgba(255,138,0,0.18);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  :global(.nav-button) { transition: none; }
  :global(.nav-button::before) { transition: none; transform: scaleX(1); }
}

@media (max-width: 768px) {
  :global(.nav-button) { padding: 0.5rem 0.85rem; }
}
</style>
