<script lang="ts">
  export let text: string = 'Button';
  export let className: string = '';
  export let ariaLabel: string | undefined = undefined;
  export let type: 'button' | 'submit' | 'reset' = 'button';
</script>

<button
  {type}
  aria-label={ariaLabel ?? text}
  class="rounded-btn {className}"
  {...$$restProps}
>
  <span class="fill" aria-hidden="true"></span>
  <span class="content">
    <slot>{text}</slot>
  </span>
</button>
<style>
  .rounded-btn {
    /* ... existing styles ... */
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.75rem;
    background: transparent;
    color: #fff;
    border: 2px solid rgba(255, 255, 255, 0.8);
    border-radius: 9999px;
    cursor: pointer;
    overflow: hidden; /* This is key to clipping the "bleed" */
    z-index: 1;
  }

  .fill {
    position: absolute;
    /* FIX 1: Negative inset to overlap the border slightly */
    inset: -2px; 
    
    background: #ffffff;
    border-radius: 50%; /* Start as a circle */
    
    /* FIX 2: Add a shadow of the same color to fuzzy the sub-pixel edges */
    box-shadow: 0 0 0 1px #ffffff; 

    /* Center it and start at scale 0 */
    transform: scale(0);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: -1;
    pointer-events: none;
  }

  .rounded-btn:hover .fill {
    /* FIX 3: Scale it up significantly more than the button size */
    transform: scale(2.5); 
  }

  .rounded-btn:hover {
    color: #000;
    /* FIX 4: Ensure border color matches fill on hover to hide the seam */
    border-color: #ffffff; 
  }

  .content {
    position: relative;
    z-index: 2;
  }
</style>