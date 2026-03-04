<script lang="ts">
    import { gsap } from 'gsap';
    import { onMount, onDestroy, tick } from 'svelte';

    export let string: string = "";
    export let fontSize: string = "20rem";
    export let fontWeight: string = "bold";
    export let fontColor: string = "white";
    export let fontFamily: string = "'Neue Montreal', sans-serif";
    export let autoplay: boolean = false;
    export let duration: number = 0.6; // seconds for the fly-in (Y) animation
    export let offset: number = 120; // start Y offset (px) for the fly-up
    export let opacityDuration: number = 0.6; // seconds for the fade-in
    export let opacityEase: string = 'power1.in';

    let container: HTMLDivElement | null = null;
    let timeline: gsap.core.Timeline | null = null;
    let pendingPlay = false;

    onMount(async () => {
        await tick();
        if (!container) return;

        // Set CSS custom properties so external CSS can override them
        container.style.setProperty('--swing-font-size', fontSize);
        container.style.setProperty('--swing-font-weight', fontWeight);
        container.style.setProperty('--swing-color', fontColor);
        container.style.setProperty('--swing-font-family', fontFamily);

        buildTimeline();

        if (autoplay || pendingPlay) {
            pendingPlay = false;
            timeline.play();
        }
    });

    function buildTimeline(overrides?: { duration?: number; offset?: number; opacityDuration?: number; opacityEase?: string }) {
        // kill existing timeline
        if (timeline) {
            timeline.kill();
            timeline = null;
        }

        const dur = overrides?.duration ?? duration;
        const off = overrides?.offset ?? offset;
        const opDur = overrides?.opacityDuration ?? opacityDuration;
        const opEase = overrides?.opacityEase ?? opacityEase;

        timeline = gsap.timeline({ paused: true });
        timeline.fromTo(
            container,
            { y: off },
            { y: 0, duration: dur, ease: 'power3.out' }
        );
        timeline.fromTo(
            container,
            { opacity: 0 },
            { opacity: 1, duration: opDur, ease: opEase },
            0
        );
    }

    /**
     * Replace the visible text. By default the new text is animated using current props.
     * Options: { animate?: boolean, duration?: number, offset?: number, opacityDuration?: number, opacityEase?: string }
     */
    export async function setText(newText: string, opts?: { animate?: boolean; duration?: number; offset?: number; opacityDuration?: number; opacityEase?: string }) {
        // update the string (reactive, will update DOM)
        string = newText;
        await tick();

        if (!container) return;

        // ensure styles reflect props
        // Reapply CSS variables when text changes
        container.style.setProperty('--swing-font-size', fontSize);
        container.style.setProperty('--swing-font-weight', fontWeight);
        container.style.setProperty('--swing-color', fontColor);
        container.style.setProperty('--swing-font-family', fontFamily);

        const animate = opts?.animate ?? true;
        if (!animate) {
            // immediately show
            if (timeline) { timeline.kill(); timeline = null; }
            gsap.set(container, { y: 0, opacity: 1 });
            return;
        }

        // rebuild timeline with optional overrides and play
        buildTimeline({ duration: opts?.duration, offset: opts?.offset, opacityDuration: opts?.opacityDuration, opacityEase: opts?.opacityEase });
        timeline?.play();
    }

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

<div class="swing-up-header" bind:this={container} {...$$restProps}>{string}</div>

<style>
    /* Google fonts imported in src/app.css */

    .swing-up-header {
        display: inline-block;
        transform-origin: center;
        /* default visible before animation; timeline will set opacity when played */
        opacity: 1;
        will-change: transform, opacity;
        font-family: var(--swing-font-family, 'Neue Montreal', sans-serif);
        font-size: var(--swing-font-size, 20rem);
        font-weight: var(--swing-font-weight, bold);
        font-style: var(--swing-font-style, normal);
        color: var(--swing-color, white);
        white-space: pre;
        position: relative;
        margin-left: 0;
        padding-left: 0;
        user-select: none;
    }
</style>
