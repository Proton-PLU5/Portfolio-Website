<script lang="ts">
  import { marked } from 'marked';
  export let source: string = '';
  let html: string = '';

  // update html whenever source changes
  $: html = marked(source);
</script>

<div class="markdown-body" {@html html}></div>

<style>
/* basic styles for markdown content */
.markdown-body {
  font-family: 'Neue Montreal', sans-serif;
  color: #ddd;
  line-height: 1.6;
}
.markdown-body h1,
.markdown-body h2,
.markdown-body h3 {
  color: #fff;
  margin-top: 2rem;
}
.markdown-body p {
  margin: 1rem 0;
}
.markdown-body a {
  color: #ff8a00;
  text-decoration: underline;
}
</style>