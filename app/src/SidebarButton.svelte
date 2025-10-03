<script>
    import Button from "$lib/components/ui/button/button.svelte";
    let { url, label } = $props();
</script>

<Button class="h-11 sidebarButton" href={url} variant="link">
    <span class="sidebarButtonText">{label}</span>
</Button>
