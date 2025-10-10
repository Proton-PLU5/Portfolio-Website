<script lang="ts">
    import SwingLeftHeader from '$lib/components/SwingLeftHeader.svelte';
    import { fadeOut, fadeIn } from '$lib/scripts/animations';
    import { onMount } from 'svelte';

    // Correctly type Svelte component instance refs
    type SwingLeftHeaderInstance = InstanceType<typeof SwingLeftHeader>;
    let titleHeader: SwingLeftHeaderInstance | null = null;
    let nameHeader: SwingLeftHeaderInstance | null = null;
    let secondaryTitleHeader: SwingLeftHeaderInstance | null = null;
    let jobTitleHeader: SwingLeftHeaderInstance | null = null;

    onMount(() => {
        // Start the initial animations
        if (titleHeader) titleHeader?.play();
        if (nameHeader) nameHeader?.play();

        // After 3 seconds, fade out the primary title, then fade in the secondary title
        setTimeout(() => {
            const title = document.querySelector('.landing .title') as HTMLElement | null;
            const secondaryTitle = document.querySelector('.landing .secondary-title') as HTMLElement | null;
            if (title && secondaryTitle) {
                fadeOut(title, { duration: 0.5 }, () => {
                    secondaryTitleHeader?.play();
                    jobTitleHeader?.play();
                    fadeIn(secondaryTitle, { duration: 0.5 });
                });
            }
        }, 3000);
    });
</script>

<div class="section">
    <div class="landing">
        <!-- Title Section -->
        <div class="title flex flex-col opacity-100">
            <SwingLeftHeader bind:this={titleHeader} string="Hi, I'm" fontSize="10rem" fontWeight="normal" />
            <SwingLeftHeader bind:this={nameHeader} string="Mathew Cibi" fontSize="20rem" fontWeight="bold" />
        </div>

        <div class="secondary-title flex flex-col opacity-0">
            <SwingLeftHeader bind:this={secondaryTitleHeader} string="I am a" fontSize="10rem" fontWeight="normal" />
            <SwingLeftHeader bind:this={jobTitleHeader} string="Software Engineer" fontSize="15rem" fontWeight="bold" />
        </div>
    </div>

    <div class="location">
        <p class="text-xl">Based in</p>
        <p class="text-xl">Auckland</p>
        <p class="text-xl">New Zealand</p>
        <div class="globe">
            
        </div>
    </div>
</div>
