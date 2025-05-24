<script>
    import Button from "$lib/components/ui/button/button.svelte";

    let props = $props();
</script>


<Button class='h-11 sidebarButton' href={props.url} variant='link'>
    <span class='sidebarButtonText'>{props.label}</span>
</Button>