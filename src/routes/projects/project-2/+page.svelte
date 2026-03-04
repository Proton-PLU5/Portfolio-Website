<script lang="ts">
  import { projects, type Project } from '$lib/data/projects';
  const project: Project | undefined = projects.find(p => p.id === 'project-2');
  if (!project) {
    throw new Error('project-2 data missing');
  }
</script>

<article class="project-detail">
  <h1>{project.title}</h1>
  {#if project.image}
    <img src={project.image} alt={project.title} />
  {/if}
  {#if project.subtitle}<h2>{project.subtitle}</h2>{/if}
  {#if project.description}<p>{project.description}</p>{/if}
  <ul class="project-meta">
    <li><strong>Year:</strong> {project.year}</li>
    <li><strong>Company:</strong> {project.company}</li>
    {#if project.tech?.length}
      <li><strong>Tech:</strong> {project.tech.join(', ')}</li>
    {/if}
  </ul>
</article>
