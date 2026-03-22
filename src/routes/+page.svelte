<script lang="ts">
    import SwingLeftHeader from '$lib/components/SwingLeftHeader.svelte';
	import SwingUpHeader from '$lib/components/SwingUpHeader.svelte';
    import previewImage1 from '$lib/assets/images/IMG_0632.jpg';
    import previewImage2 from '$lib/assets/images/tomra/IMG_0622.jpg';
    import { fadeIn } from '$lib/scripts/animations';    import { base } from '$app/paths';    import { onMount, onDestroy } from 'svelte';
    import RoundedButton from '$lib/components/RoundedButton.svelte';
    import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import '$lib/styles/site.css';
	import { Root } from '$lib/components/ui/separator';
    import Tabs from '$lib/components/Tabs.svelte';
	import Card from '$lib/components/Card.svelte';
    import Carousel from '$lib/components/Carousel.svelte';
	import ProjectButton from '$lib/components/ProjectButton.svelte';
    import NavButton from '$lib/components/NavButton.svelte';
    import ThreeScene from '$lib/components/ThreeScene.svelte';
    type SwingLeftHeaderInstance = InstanceType<typeof SwingLeftHeader>;
    let titleHeader: SwingLeftHeaderInstance | null = null;
    let nameHeader: SwingLeftHeaderInstance | null = null;
    let subtitleHeader1: InstanceType<typeof SwingUpHeader> | null = null;
    let subtitleHeader2: InstanceType<typeof SwingUpHeader> | null = null;
    let selectedWork: 'tomra' | 'other' = 'tomra';

    let ScrollNav: any = null;
    let socialCleanups: Array<() => void> = [];
    let showSubtitle = false;
    // images for the experience preview carousel (with captions)
    const previewImages: Array<{ src: string; caption: string }> = [
        { src: previewImage1, caption: 'Collecting optical data of internal defects in apples.' },
        { src: previewImage2, caption: 'Annotating severity of internal defects in apples.' }
    ];

    let previewIndex = 0;

    // Projects data and switching
    import type { Project } from '$lib/data/projects';
    import { projects } from '$lib/data/projects';


    console.log('rendering home page');
    let currentProject: number = 0;
    let imageLoaded = false;
    let activeProject: Project = projects[0];

    const setProject = (index: number) => {
        if (!projects.length) return;
        const nextIndex = (index + projects.length) % projects.length;
        if (nextIndex === currentProject) return;

        imageLoaded = false;
        currentProject = nextIndex;
    };

    const nextProject = () => setProject(currentProject + 1);
    const prevProject = () => setProject(currentProject - 1);
    const selectProject = (i: number) => setProject(i);

    $: activeProject = projects[currentProject] ?? projects[0];
    const getTechIcon = (tech: string) => {
        const lower = tech.toLowerCase();
        if (lower.includes('python')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg';
        if (lower.includes('pytorch')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg';
        if (lower.includes('opencv')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/opencv/opencv-original.svg';
        return '';
    };

    onMount(() => {
        // Start the initial animations
        if (titleHeader) titleHeader?.play();
        if (nameHeader) nameHeader?.play();
        setTimeout(() =>  {
            showSubtitle = true;
            if (subtitleHeader1) subtitleHeader1?.play();
        }, 1000);
        setTimeout(() =>  {
            // Animate the opacity of scroll indicator after subtitle
            const scrollIndicator = document.querySelector('.scroll-indicator') as HTMLElement;
            if (scrollIndicator) {
                fadeIn(scrollIndicator, 0.5);
            }
        }, 1500);

        // load scroll nav on client only
        (async () => {
            const mod = await import('$lib/components/ScrollNav.svelte');
            ScrollNav = mod.default;
        })();

        // interactive social hover
        const containers = Array.from(document.querySelectorAll<HTMLElement>('.social-icons'));
        containers.forEach((container) => {
            const teardown = setupSocialMotion(container);
            if (teardown) socialCleanups.push(teardown);
        });
    });

    onDestroy(() => {
        socialCleanups.forEach((fn) => fn());
        socialCleanups = [];
    });

    const setupSocialMotion = (container: HTMLElement) => {
        const icons = Array.from(container.querySelectorAll<HTMLElement>('.social-icon'));
        if (!icons.length) return;

        const strength = 12; // pixels of influence toward the cursor

        const handleMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            icons.forEach((icon) => {
                const bounds = icon.getBoundingClientRect();
                const centerX = bounds.left + bounds.width / 2;
                const centerY = bounds.top + bounds.height / 2;
                const isHover = icon === e.target || icon.contains(e.target as Node);
                if (isHover) {
                    const dx = (mouseX - centerX) / rect.width;
                    const dy = (mouseY - centerY) / rect.height;
                    const offsetX = dx * strength;
                    const offsetY = dy * strength;
                    icon.style.transform = `translateX(${offsetX}px) translateY(${offsetY - 2}px) scale(1.08)`;
                    icon.style.opacity = '1';
                } else {
                    icon.style.transform = '';
                    icon.style.opacity = '0.82';
                }
            });
        };

        const handleLeave = () => {
            icons.forEach((icon) => {
                icon.style.transform = '';
                icon.style.opacity = '';
            });
        };

        container.addEventListener('mousemove', handleMove);
        container.addEventListener('mouseleave', handleLeave);

        return () => {
            container.removeEventListener('mousemove', handleMove);
            container.removeEventListener('mouseleave', handleLeave);
            handleLeave();
        };
    };
</script>

<div class="nav-bar">
    <a href="#landing-section" class="nav-logo">MC</a>
    <div class="nav-content">
        <div class="nav-links">
            <NavButton href="#about-me">About Me</NavButton>
            <NavButton href="#experience">Experience</NavButton>
            <NavButton href="#projects">Projects</NavButton>
            <NavButton href="#contact-me">Contact</NavButton>
        </div>
    </div>
</div>

<div class="top-horizontal-seperator"></div>

<div class="section" id="landing-section">

    <div class="landing" data-scroll="landing">
        <div class="titles-wrapper">
            <!-- Title Section -->
            <div class="title opacity-100">
                <SwingLeftHeader bind:this={titleHeader} string="Hi, I'm" fontSize="8rem" fontWeight="normal" fontColor="white" />
                <SwingLeftHeader bind:this={nameHeader} string="Mathew Cibi" fontSize="15rem" fontWeight="bold" fontColor="white" />
            </div>
            <div class="subtitle opacity-100" style="opacity: {showSubtitle ? 1 : 0}; transition: opacity 0.2s;">
                <SwingUpHeader bind:this={subtitleHeader1} string="I'm a software engineering student" fontSize="3rem" fontWeight="normal" fontColor="white" />
            </div>
        </div>
    </div>

    <div class="location">
        <p class="text-xl">Based in</p>
        <p class="text-xl">Auckland</p>
        <p class="text-xl">New Zealand</p>
        <div class="globe">
            
        </div>
    </div>

    <div
        class="scroll-indicator"
        role="button"
        tabindex="0"
        aria-label="Scroll to About Me"
        style="cursor: pointer;"
        on:click={() => {
            const about = document.querySelector('[data-scroll="about-me"]') as HTMLElement | null;
            about?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        on:keydown={(e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const about = document.querySelector('[data-scroll="about-me"]') as HTMLElement | null;
                about?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }}
    >
        
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M297.4 566.6C309.9 579.1 330.2 579.1 342.7 566.6L502.7 406.6C515.2 394.1 515.2 373.8 502.7 361.3C490.2 348.8 469.9 348.8 457.4 361.3L352 466.7L352 96C352 78.3 337.7 64 320 64C302.3 64 288 78.3 288 96L288 466.7L182.6 361.3C170.1 348.8 149.8 348.8 137.3 361.3C124.8 373.8 124.8 394.1 137.3 406.6L297.3 566.6z"/></svg>
    </div>

    <div class="horizontal-seperator"></div>

    <div class="social-footer landing-social-footer" aria-label="Social links">
        <div class="social-icons">
            <a class="social-icon" href="https://github.com/Proton-PLU5" target="_blank" rel="noreferrer" aria-label="GitHub">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.72 1.27 3.38.97.11-.75.41-1.27.74-1.57-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.45.11-3.03 0 0 .97-.31 3.17 1.18.92-.26 1.9-.39 2.88-.39s1.96.13 2.88.39c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.74.11 3.03.74.8 1.19 1.82 1.19 3.08 0 4.42-2.69 5.39-5.25 5.67.42.36.79 1.08.79 2.18 0 1.57-.01 2.83-.01 3.21 0 .31.21.67.8.56C20.21 21.4 23.5 17.09 23.5 12 23.5 5.73 18.27.5 12 .5Z"/></svg>
            </a>
            <a class="social-icon" href="https://www.linkedin.com/in/mathew-cibi-813a652a9/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.55v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85v5.5H9.47V9h3.41v1.56h.05c.47-.9 1.6-1.85 3.29-1.85 3.52 0 4.17 2.32 4.17 5.34v6.4ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.56 20.45h3.55V9H3.56v11.45Z"/></svg>
            </a>
            <a class="social-icon" href="mailto:cijinmathew33@gmail.com?subject=Hi%20Mathew, Let's work on a project!" aria-label="Email">
                <svg viewBox="0 0 50 50" aria-hidden="true">
                    <path fill="currentColor" d="M12 23.403V23.39 10.389L11.88 10.3h-.01L9.14 8.28C7.47 7.04 5.09 7.1 3.61 8.56 2.62 9.54 2 10.9 2 12.41v3.602L12 23.403zM38 23.39v.013l10-7.391V12.41c0-1.49-.6-2.85-1.58-3.83-1.46-1.457-3.765-1.628-5.424-.403L38.12 10.3 38 10.389V23.39zM14 24.868l10.406 7.692c.353.261.836.261 1.189 0L36 24.868V11.867L25 20l-11-8.133V24.868zM38 25.889V41c0 .552.448 1 1 1h6.5c1.381 0 2.5-1.119 2.5-2.5V18.497L38 25.889zM12 25.889L2 18.497V39.5C2 40.881 3.119 42 4.5 42H11c.552 0 1-.448 1-1V25.889z"></path>
                </svg>
            </a>
        </div>
    </div>
</div>

<div class="section">
    <div class="about-me" id="about-me" data-scroll="about-me">
        <div class="about-grid">
            <div class="text-panel">
                <h1>About Me</h1>
                <p>
                    I'm Mathew Cibi, a penultimate software engineering student at the University of Auckland.
                    My interests lie in the ML/AI and the robotics space, particularly in applications that can have a positive real-world impact.
                    I believe in the innate potential of applying ML/AI technologies and robotics to create real-world products that aim to improve lives and solve meaningful problems.
                </p>

                <p>
                    My skills include Python, Java, C#, and experience with ML frameworks like PyTorch and some computer vision using OpenCV. I'm really interested in learning more technologies to expand my skillset.
                </p>
            </div>

            <div class="about-visual">
 
            </div>
        </div>
    </div>
</div>

<div class="section">
    <div class="experience" id="experience" data-scroll="experience">
        <div class="tabs-panel">
            <h1>Experience</h1>
            
            <Tabs labels={["Work","Education"]}>
                <div class="content-grid">
                    <div class="cards-list">
                        <div 
                            class="card-wrapper" 
                            role="button"
                            tabindex="0"
                            on:mouseenter={() => selectedWork = 'tomra'}
                            on:click={() => selectedWork = 'tomra'}
                            on:keydown={(e) => e.key === 'Enter' && (selectedWork = 'tomra')}
                        >
                            <Card className={selectedWork === 'tomra' ? 'card--active' : ''}>
                                <h1>AI Applications Annotation Intern</h1>
                                <div class="horizontal-separator"></div>
                                <h2>Tomra Food</h2>
                                <h3>Nov 2025 - Feb 2026</h3>
                                <p>
                                    - Annotated large datasets of images for Tomra's Inspectra machines.<br>
                                    - Collaborated with engineering teams on data collection.<br>
                                    - Created segmentation models to speed up annotation.
                                </p>
                            </Card>
                        </div>

                        <div 
                            class="card-wrapper" 
                            role="button"
                            tabindex="0"
                            on:mouseenter={() => selectedWork = 'other'}
                            on:click={() => selectedWork = 'other'}
                            on:keydown={(e) => e.key === 'Enter' && (selectedWork = 'other')}
                        >
                            <Card className={selectedWork === 'other' ? 'card--active' : ''}>
                                <h1>AI Applications Annotation Intern</h1>
                                <div class="horizontal-separator"></div>
                                <h2>Tomra Food</h2>
                                <h3>Nov 2025 - Feb 2026</h3>
                                <p>
                                    - Annotated large datasets of images for Tomra's Inspectra machines.<br>
                                    - Collaborated with engineering teams on data collection.<br>
                                    - Created segmentation models to speed up annotation.
                                </p>
                            </Card>
                        </div>
                    </div>

                    <div class="preview-panel">
                        <div class="panel-content">
                            {#if selectedWork === 'tomra'}
                                <div class="placeholder-image">
                                    <Carousel images={previewImages} autoplay={true} interval={4500} on:change={(e) => (previewIndex = e.detail.index)} />
                                </div>
                                <p class="caption">{previewImages[previewIndex]?.caption ?? 'Image Segmentation Model'}</p>
                            {:else if selectedWork === 'other'}
                                <div class="placeholder-image">
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>

                <div>
                    <Card>
                        <h1>Bachelor of Software Engineering (Honours)</h1>
                        <div class="horizontal-separator"></div>
                        <h2>University of Auckland</h2>
                        <h3>2024 - Present</h3>
                        <p>
                            Currently pursuing a Bachelor of Software Engineering degree at UoA...
                        </p>
                    </Card>
                </div>
            </Tabs>
        </div>
    </div>
</div>

<div class="section">
    <div class="projects" id="projects" data-scroll="projects" tabindex="0" on:keydown={(e) => { if (e.key === 'ArrowLeft') prevProject(); if (e.key === 'ArrowRight') nextProject(); }}>
        <h1>Projects</h1>

        <div class="project-container">
            {#key activeProject.id}
                <div class="project">
                    <img class="project-image" src={activeProject.image} alt={activeProject.title} on:load={() => (imageLoaded = true)} class:loaded={imageLoaded} />
                    <div class="project-details">
                        <h2 class="project-subtitle">{activeProject.subtitle}</h2>
                        <h1>{activeProject.title}</h1>
                        {#if activeProject.description}
                            <p class="project-desc">{activeProject.description}</p>
                        {/if}
                        <!-- wrap the styled button in a normal link so navigation is handled by the browser -->
                        <a href={activeProject.url ?? `${base}/projects/${activeProject.id}`} aria-label="View project details">
                            <ProjectButton>
                                VISIT
                            </ProjectButton>
                        </a>

                        <div class="project-widgets">
                            <div class="widget">
                                <h3>YEAR</h3>
                                <p>{activeProject.year}</p>
                            </div>
                            <div class="widget">
                                <h3>COMPANY</h3>
                                <p>{activeProject.company}</p>
                            </div>
                            <div class="widget">
                                <h3>TECH</h3>
                                <div class="tech-badges" aria-label="Technologies used">
                                    {#each activeProject.tech as t}
                                        <span class="tech-badge" title={t}>
                                            <span class="tech-logo"><img src={getTechIcon(t)} alt="{t} logo"/></span>
                                            <span class="tech-name">{t}</span>
                                        </span>
                                    {/each}
                                </div>
                            </div>
                        </div>

                        <div class="project-footer" role="navigation" aria-label="Project navigation">
                            <button class="nav-label prev" on:click={prevProject} aria-label="Previous project">PREV</button>

                            <div class="project-bar" role="tablist" aria-label="Project selector">
                                {#each projects as _, idx}
                                    <button class="project-segment {idx === currentProject ? 'active' : ''}" aria-label={`Go to project ${idx + 1}`} on:click={() => selectProject(idx)}></button>
                                {/each}
                            </div>

                            <button class="nav-label next" on:click={nextProject} aria-label="Next project">NEXT</button>
                        </div>
                    </div>
                </div>
            {/key}
        </div>
    </div>
</div>

<div class="section">
    <div class="contact-me" id="contact-me" data-scroll="contact-me">
        <div class="contact-card">
            <div class="contact-header">
                <p class="eyebrow">Let's build together</p>
                <h1>Say hi, I'm always keen to talk shop.</h1>
                <p class="lede">
                    Whether it's ML, frontend polish, or a quirky side project, I'd love to hear from you.
                    Drop a note and let's make something memorable.
                </p>
            </div>

            <div class="contact-actions">
                <a class="pill primary" href="mailto:cijinmathew33@gmail.com?subject=Hi%20Mathew, Let's work on a project!">Email Me</a>
                <a class="pill ghost" href="https://www.linkedin.com/in/mathew-cibi-813a652a9/" target="_blank" rel="noreferrer">LinkedIn</a>
                <a class="pill ghost" href="https://github.com/Proton-PLU5" target="_blank" rel="noreferrer">GitHub</a>
            </div>

            <div class="contact-details">
                <div>
                    <h3>Based in</h3>
                    <p>Auckland, New Zealand</p>
                </div>
                <div>
                    <h3>Currently</h3>
                    <p>Software Engineering student exploring ML</p>
                </div>
                <div>
                    <h3>Availability</h3>
                    <p>Open for internships & collaborations</p>
                </div>
            </div>
        </div>
    </div>
</div>

{#if ScrollNav}
    <svelte:component this={ScrollNav} />
{/if}

<div class="social-footer" aria-label="Social links">
    <div class="social-icons">
        <a class="social-icon" href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.72 1.27 3.38.97.11-.75.41-1.27.74-1.57-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.45.11-3.03 0 0 .97-.31 3.17 1.18.92-.26 1.9-.39 2.88-.39s1.96.13 2.88.39c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.74.11 3.03.74.8 1.19 1.82 1.19 3.08 0 4.42-2.69 5.39-5.25 5.67.42.36.79 1.08.79 2.18 0 1.57-.01 2.83-.01 3.21 0 .31.21.67.8.56C20.21 21.4 23.5 17.09 23.5 12 23.5 5.73 18.27.5 12 .5Z"/></svg>
        </a>
        <a class="social-icon" href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.55v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85v5.5H9.47V9h3.41v1.56h.05c.47-.9 1.6-1.85 3.29-1.85 3.52 0 4.17 2.32 4.17 5.34v6.4ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.56 20.45h3.55V9H3.56v11.45Z"/></svg>
        </a>
            <a class="social-icon" href="mailto:mathew.cibi@example.com?subject=Hi%20Mathew" aria-label="Email">
                <svg viewBox="0 0 50 50" aria-hidden="true">
                    <path fill="currentColor" d="M12 23.403V23.39 10.389L11.88 10.3h-.01L9.14 8.28C7.47 7.04 5.09 7.1 3.61 8.56 2.62 9.54 2 10.9 2 12.41v3.602L12 23.403zM38 23.39v.013l10-7.391V12.41c0-1.49-.6-2.85-1.58-3.83-1.46-1.457-3.765-1.628-5.424-.403L38.12 10.3 38 10.389V23.39zM14 24.868l10.406 7.692c.353.261.836.261 1.189 0L36 24.868V11.867L25 20l-11-8.133V24.868zM38 25.889V41c0 .552.448 1 1 1h6.5c1.381 0 2.5-1.119 2.5-2.5V18.497L38 25.889zM12 25.889L2 18.497V39.5C2 40.881 3.119 42 4.5 42H11c.552 0 1-.448 1-1V25.889z"></path>
                </svg>
        </a>
    </div>
</div>
