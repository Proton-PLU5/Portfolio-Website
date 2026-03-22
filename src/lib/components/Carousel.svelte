<script lang="ts">
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';
    export let images: Array<string | { src: string; caption?: string; label?: string }> = [];
    export let autoplay: boolean = true;
    export let interval: number = 5000;
    const dispatch = createEventDispatcher();

    let current = 0;
    let timer: number | null = null;
    $: isPlaying = timer !== null;

    // normalize images into slide objects { src, caption }
    $: slides = images.map((it) =>
        typeof it === 'string' ? { src: it, caption: '' } : { src: it.src, caption: it.caption ?? it.label ?? '' }
    );

    function prev() {
        current = (current - 1 + slides.length) % slides.length;
        dispatch('change', { index: current });
    }

    function next() {
        current = (current + 1) % slides.length;
        dispatch('change', { index: current });
    }

    function go(i: number) {
        current = i % slides.length;
        dispatch('change', { index: current });
    }

    function startAutoplay() {
        stopAutoplay();
        if (autoplay && images.length > 1) {
            timer = window.setInterval(() => next(), interval);
        }
    }

    function stopAutoplay() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    onMount(() => {
        startAutoplay();
        return () => stopAutoplay();
    });

    onDestroy(() => stopAutoplay());
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
    class="carousel"
    role="region"
    aria-roledescription="carousel"
    tabindex="0"
    on:keydown={(e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') { prev(); startAutoplay(); }
        if (e.key === 'ArrowRight') { next(); startAutoplay(); }
        if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); autoplay = !autoplay; startAutoplay(); }
    }}
    on:mouseenter={stopAutoplay}
    on:mouseleave={startAutoplay}
>
    {#if images.length === 0}
        <div class="empty">No images</div>
    {:else}
        {#each slides as slide, i}
            <img
                src={slide.src}
                alt={slide.caption || `Slide ${i + 1}`}
                class:selected={i === current}
                class="slide"
                aria-hidden={i === current ? 'false' : 'true'}
            />
        {/each}

        <button class="nav prev" on:click={() => { prev(); startAutoplay(); }} aria-label="Previous slide">‹</button>
        <button class="nav next" on:click={() => { next(); startAutoplay(); }} aria-label="Next slide">›</button>

        <div class="indicators">
            {#each slides as _, i}
                <button
                    class:active={i === current}
                    class="dot"
                    aria-label={`Show slide ${i + 1}`}
                    aria-pressed={i === current}
                    on:click={() => { go(i); startAutoplay(); }}
                ></button</button>
            {/each}
        </div>

        <!-- subtle darken gradient at bottom to improve control visibility -->
        <div class="bottom-fade" aria-hidden="true"></div>

        <!-- Progress bar that fills across the interval for the active slide -->
        <div class="progress-wrap" aria-hidden="true">
            {#key current}
                <div
                    class="progress"
                    style="animation-duration: {interval}ms; animation-play-state: {autoplay && isPlaying ? 'running' : 'paused'}"
                ></div>
            {/key}
        </div>
    {/if}
</div>

<style>
    .carousel {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background: var(--carousel-bg, #111);
    }

    .slide {
        display: none;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: opacity 300ms ease-in-out, transform 300ms ease-in-out;
        position: absolute;
        inset: 0;
    }

    .slide.selected {
        display: block;
        position: absolute;
        opacity: 1;
    }

    .nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0,0,0,0.45);
        color: #fff;
        border: none;
        padding: 10px 14px;
        font-size: 1.6rem;
        border-radius: 6px;
        cursor: pointer;
        z-index: 20;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
    }

    .nav.prev { left: 12px; }
    .nav.next { right: 12px; }

    .indicators {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 8px;
        z-index: 20;
    }

    .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(255,255,255,0.45);
        border: none;
        cursor: pointer;
        padding: 0;
        box-shadow: 0 1px 2px rgba(0,0,0,0.4);
    }

    .dot.active {
        background: #fff;
        transform: scale(1.12);
        box-shadow: 0 2px 6px rgba(0,0,0,0.45);
    }

    .empty { color: #ddd; }

    /* progress bar styles */
    .progress-wrap {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 4px;
        background: rgba(255,255,255,0.07);
        z-index: 25;
    }

    .progress {
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, rgba(255,255,255,0.95), rgb(255, 255, 255));
        animation-name: fill;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
    }

    @keyframes fill {
        from { width: 0%; }
        to { width: 100%; }
    }

    .bottom-fade {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 120px;
        background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.7) 100%);
        pointer-events: none;
        z-index: 15;
    }
</style>
