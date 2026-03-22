<script lang="ts">
	import '$lib/styles/projects/tomra.css';
    import NavButton from '$lib/components/NavButton.svelte';
	import { projects, type Project } from '$lib/data/projects';
	const project: Project | undefined = projects.find((p) => p.id === 'tomra');
	if (!project) {
		// this should never happen in development, but guard anyway
		throw new Error('Tomra project data missing');
	}
</script>

<section class="project-page">
    <div class="nav-bar">
        <a href="#landing-section" class="nav-logo">MC</a>
        <div class="nav-content">
            <div class="nav-links">
                <!-- navigate away from project page back to root + anchors -->
                <NavButton href="/">Home</NavButton>
                <NavButton href="/#projects">Projects</NavButton>
                <NavButton href="/#contact-me">Contact</NavButton>
            </div>
        </div>
    </div>

    <div class="top-horizontal-seperator"></div>

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
			<div class="image-container">
                <img
				src="/src/lib/assets/images/tomra/tomra_logo.png"
				alt="Illustration of the problem or machine"
				class="background-image"
			    />
                <p>Fig 1: Tomra Logo</p>
            </div>
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

        <p>
            I was tasked with resolving this bottleneck. While the team was abroad, I developed a suite of automation tools designed to speed up the annotation pipeline. My goal was to create a bridge between the raw field data and the AI department, ensuring that labeled datasets could be handed over for model training faster than previously possible.
        </p>

        <div class="image-container">
            <img
                src="/src/lib/assets/images/tomra/IMG_0622.jpg"
                alt="Illustration of the problem or machine"
                class="image">
            <p>Present annotation process</p>
        </div>

        

        <h2>Approach</h2>
        
        <h3>Research</h3>
        <p>
            My research into solving this problem led me down two different approaches. The first was 
            building a model that could <span>automatically analyse apple slice images</span> and 
            determine the severity of internal browning. Removing the need for the team to manually 
            grade each image. The second was developing a <span>custom annotation tool</span> that 
            could integrate this model directly into the labelling workflow, so that even where human 
            review was still needed, the process would be dramatically faster than the existing 
            spreadsheet-based approach.
        </p>
        <p>
            Before settling on a machine learning approach, I first explored a simpler 
            <span>colour-based segmentation</span> method — using colour range filtering and 
            thresholding to isolate the apple flesh and browning regions directly from the image. 
            While promising in concept, this approach struggled in practice: apple skins vary in 
            colour and texture rather than being a single solid tone, making it difficult to cleanly 
            separate flesh from skin without introducing noise. The method also lacked the ability 
            to generalise across different apple varieties and lighting conditions. These limitations 
            made it clear that a learned model would be necessary.
        </p>
        <p>
            I decided to go with both the modelling and tooling approaches as they complemented each 
            other. An automated model meant more data gets annotated, and a better tool meant easier 
            corrections and faster manual annotations. I also spent time evaluating different model 
            architectures and annotation frameworks, keeping in mind the constraints of working with 
            proprietary data and commercial licensing requirements.
        </p>

        <h3>Segmentation Model</h3>
        <p>
            The core of my work centred on building a segmentation model to automatically identify 
            apple flesh and internal browning in cross-section images. A segmentation model works by 
            creating a pixel-level mask over specific features in an image — one mask for the apple 
            flesh and one for any browning defect. By comparing the size of these two masks, the 
            model can calculate the ratio of defect to flesh, which maps directly to a severity grade.
        </p>
        <p>
            For the backbone architecture, I evaluated several options. I first tried 
            <span>MobileNet</span>, but its lightweight design sacrificed too much detail for this 
            task. I then moved to <span>ResNet</span>, which produced better results but was too 
            large and slow — both training and inference times were impractical, and scaling down 
            to a smaller ResNet variant hurt accuracy significantly given the limited amount of 
            labelled data available. I ultimately settled on <span>EfficientNet-B2</span> as the 
            backbone, which offered the best of both worlds: fast enough for practical use while 
            retaining the representational capacity needed to detect subtle browning patterns.
        </p>
        <p>
            Training data was annotated manually in <span>Label Studio</span>, drawing polygon masks 
            over each apple slice image. One technical challenge was bridging the format mismatch 
            between Label Studio (which stores annotations as polygons) and the model (which outputs 
            pixel masks) — I used <span>OpenCV contour detection</span> to convert between the two. 
            Another issue was that the model initially misclassified seeds and holes as apple flesh, 
            inflating the area calculation. Since Label Studio doesn't support polygons with holes, 
            I worked around this by creating a secondary mask and subtracting it during preprocessing.
        </p>
        <p>
            To scale up the training data without annotating everything by hand, I used 
            <span>pseudo-labelling</span> — running the partially-trained model over unlabelled 
            images to generate initial annotations, then manually reviewing and correcting them 
            before feeding them back into training. This was particularly important as the team 
            was simultaneously collecting hundreds of new apple slices remotely from a site in 
            California. I also used <span>Optuna</span> for hyperparameter tuning to squeeze out 
            the best performance from the available data.
        </p>

        <h3>Classification Model</h3>
        <p>
            Alongside the segmentation model, I also trained an image classification model using 
            <span>EfficientNetV2-S</span> as the backbone. The motivation was twofold: to explore 
            a simpler end-to-end grading approach, and to benchmark a larger EfficientNet variant 
            against the <span>EfficientNet-B2</span> used in the segmentation model — comparing 
            both predictive capability and inference speed across the two scales.
        </p>
        <p>
            Rather than computing a defect ratio from pixel masks, this model directly predicts a 
            severity grade from the image as a whole. Training was straightforward given that roughly 
            1,550 images had already been graded during the annotation process, so no additional 
            labelling was needed. Even without any hyperparameter tuning, it achieved strong accuracy 
            across all severity classes — providing a useful data point in the B2 vs V2-S comparison, 
            and underlining how much the volume of quality annotated data collected throughout the 
            internship had contributed to the overall project.
        </p>

        <h3>Apple Grader Application</h3>
        <p>
            Alongside the model, I built a desktop annotation tool called <span>Apple Grader</span> 
            using <span>PyQt</span> in Python. The previous workflow involved manually viewing images 
            in Windows Photo Viewer and typing grades into an Excel spreadsheet — slow and error-prone 
            at scale. Apple Grader replaced this entirely. It loads a directory of apple slice images, 
            groups slices by fruit, displays all slices for a given fruit side by side, and shows the 
            model's predicted grade underneath each one. The annotator can accept the prediction or 
            override it, then submit and move to the next fruit. All grades are exported to a CSV file 
            for downstream processing.
        </p>
        <p>
            Building the tool in Python meant the model inference pipeline could be integrated 
            directly, with no additional overhead. This was critical given the time pressure — the 
            California team needed daily annotation reports turned around overnight so they could 
            adjust which apple varieties to focus on the following day.
        </p>

        <h2 id="results">Results</h2>
        <h3>Model Performance</h3>
        <p>
            The final segmentation model achieved <span>97.5% IoU accuracy</span> on the apple flesh 
            class and <span>73.8% IoU</span> on the internal browning class. The gap between the two 
            reflects a real challenge in the dataset: the majority of apple slices were defect-free, 
            meaning the model had far fewer examples of browning to learn from. Performance on 
            browning was also impacted by the fact that the initial training data came from an older 
            OIB machine with different camera sensors and lighting, while the California data came 
            from a newer machine — creating a colour-space mismatch the model had to adapt to.
        </p>
        <p>
            To complement the segmentation approach, I also trained a separate image classification 
            model using an <span>EfficientNet</span> backbone on roughly 1,550 graded images. Without 
            any hyperparameter tuning, it achieved strong accuracy across all severity classes — 
            demonstrating how much the volume of annotated data collected during the internship had 
            grown.
        </p>

        <h3>Annotation Pipeline</h3>
        <p>
            The Apple Grader tool proved a substantial improvement over the manual process. During 
            week nine alone, it was used to annotate seven days' worth of apple data — hundreds of 
            fruits — within a single week, with one team member returning early from California to 
            help clear the backlog. The combination of model-assisted pre-labelling and the custom 
            tool meant the turnaround time the California team needed was achievable.
        </p>

        <h2 id="conclusion">Conclusion</h2>
        <p>
            Coming into this internship, I expected to spend most of my time manually labelling 
            images. What actually happened was quite different. By identifying the bottleneck in the 
            annotation pipeline early and building tools to address it, I ended up touching nearly 
            every stage of the ML workflow — data collection, annotation, model training, fine-tuning, 
            and application development.
        </p>
        <p>
            The biggest technical lesson was how much data quality and quantity matter. The model's 
            performance on the browning class was limited not by the architecture, but by class 
            imbalance and distribution shift between training and inference data. Solving those 
            problems required creative workarounds — pseudo-labelling, manual pruning, and 
            hyperparameter search with Optuna — rather than just more compute, Which I learned the hard way.
            However, this struggle taught me more about the realities of deploying ML in a commercial context than any amount of theoretical study could have. In the real world, you don't just need a model that works — you need a model that works with the data you have, within the constraints of your project timeline and resources.
        </p>
        <p>
            Working within a professional R&D team also gave me a clear picture of how ML projects 
            actually run: iterative, collaborative, and often shaped by real-world constraints like 
            time zones, hardware differences between field sites, and the need to deliver usable 
            results daily rather than waiting for a perfect model.
        </p>
	</div>
</section>

<section class="introduction"></section>
