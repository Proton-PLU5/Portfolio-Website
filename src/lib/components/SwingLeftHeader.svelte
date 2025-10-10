<script lang="ts">
    import { gsap } from 'gsap';
    import { onMount, onDestroy, tick } from 'svelte';
    // Accept a value from the parent and assign it to this variable
    // Usage: <SwingLeftHeader string="Hello" />
    export let string: string = "";
    export let fontSize: string = "20rem";
    export let fontWeight: string = "bold";
    // Control when the animation should start
    export let autoplay: boolean = false;

    // Make `letters` reactive so it updates when `string` changes
    $: letters = string.split("");
    let letterNodes: HTMLSpanElement[] = [];
    let timeline: gsap.core.Timeline | null = null;
    let pendingPlay = false;
    

    // Run animations only on the client after DOM is mounted
    onMount(async () => {
        // wait for the DOM to bind `letterNodes`
        await tick();
        const nodes = letterNodes.filter(Boolean);
        if (!nodes.length) return;

        letterNodes.forEach(node => {
            node.style.fontSize = fontSize;
            node.style.fontWeight = fontWeight;
        });

        // Build a paused timeline so we can start it on demand
        timeline = gsap.timeline({ paused: true });
        timeline.fromTo(
            nodes,
            { opacity: 0, x: 100 },
            { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: 'power1.out' }
        );

        if (autoplay || pendingPlay) {
            pendingPlay = false;
            timeline.play();
        }
    });

    // Expose imperative controls to the parent via bind:this
    export function play() {
        if (timeline) timeline.play();
        else pendingPlay = true;
    }
    export function pause() { timeline?.pause(); }
    export function restart() { timeline?.restart(); }

    onDestroy(() => {
        if (timeline) {
            timeline.kill();
            timeline = null;
        }
    });
</script>

<div class="swing-left-header">
    {#each letters as letter, i} 
                <span 
                    class="inline-block font-bold text-6xl whitespace-pre"
                    bind:this={letterNodes[i]} 
                >
                    {letter}
                </span>
    {/each}
</div>

<style>
    @font-face {
        font-family: 'Neue Montreal';
        src: url('../assets/fonts/NeueMontreal-Regular.otf') format('opentype');
        font-weight: normal;
    }

    @keyframes fly-in-from-left {
        0% {
            transform: translateX(-100%);
            opacity: 0;
        }
        100% {
            transform: translateX(0);
            opacity: 1;
        }
    }

    span {
        display: inline-block;
        transform-origin: top left;
        opacity: 0;
        will-change: transform, opacity;
        font-family: 'Neue Montreal', sans-serif;
    }

    .swing-left-header {
        position: relative;
        margin-left: 0;
        padding-left: 0;
        color: black;
        user-select: none;
        white-space: pre;
    }
</style>