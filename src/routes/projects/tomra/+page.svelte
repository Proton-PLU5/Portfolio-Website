<script lang="ts">
	import '$lib/styles/projects/tomra.css';
	import { projects, type Project } from '$lib/data/projects';
	const project: Project | undefined = projects.find((p) => p.id === 'tomra');
	if (!project) {
		// this should never happen in development, but guard anyway
		throw new Error('Tomra project data missing');
	}
</script>

<section class="project-page">
	<div class="project-content">
		<h1>Apple Annotation Tools</h1>
		<div class="project-meta">Internship Project, Tomra Food, 2025</div>
		<img
			src="/src/lib/assets/images/segmentation_result.png"
			alt="Apple segmentation model output"
			class="project-hero"
		/>
		<h2>Table of Contents</h2>

		<ul class="toc-list">
			<li><a href="#problem">Introduction</a></li>
			<li><a href="#approach">Approach</a></li>
			<li><a href="#results">Results</a></li>
			<li><a href="#conclusion">Conclusion</a></li>
		</ul>

		<h2>Introduction</h2>
		<h3>Background</h3>
		<!-- container holds text on left and an explanatory image on the right -->
		<div class="background-section">
			<p>
				In 2025, I interned at <span>Tomra Food</span>, a global leader in sensor-based sorting
				and automation for the food industry. My work supported the development of a non-destructive
				machine learning model to detect internal browning and defects in apples, flaws invisible
				externally and to the naked eye. This technology is integrated into the Spectrim platform, one
				of Tomra's main industrial sorting machines.
			</p>
			<img
				src="/src/lib/assets/images/tomra/tomra_logo.png"
				alt="Illustration of the problem or machine"
				class="background-image"
			/>
		</div>

		<h3>Challenge</h3>

        <p>
        Training high‑performance deep learning models requires immense amounts of
        “ground truth” data. To achieve this, our team used a rigorous
        validation process:
        </p>

        <ul class="challenge-list">
            <li>Each apple was passed through the sensors.</li>
            <li>The fruit was then physically cut into horizontal slices.</li>
            <li>Each slice was captured as a high‑resolution image.</li>
            <li>Each image was manually annotated by experts to provide a
                definitive grade of internal browning or rot.</li>
        </ul>

        <p>
            These physical images served as the benchmark for the ML model. However,
            as the volume of data grew, a bottleneck was found in the annotation
            process.
        </p>

        <p>
            After the data was collected, every image had to be manually labeled with the correct defect grade. 
            This manual step was slow and labor-intensive. With the Applications and Sensors team preparing for an extensive data-collection mission in the United States, 
            it became clear that our current process couldn't scale. Without a faster way to annotate, 
            the influx of American data would sit in a backlog, severely delaying the training of Tomra’s 
            next-generation models.
        </p>
	</div>
</section>

<section class="introduction"></section>
