<script lang="ts">
    export let buttonText: string = '';
</script>

<button class="navigation-button" aria-label={buttonText}></button>

<style>
    .navigation-button {
        background-color: transparent;
        border: none;
        cursor: pointer;
    }
</style>