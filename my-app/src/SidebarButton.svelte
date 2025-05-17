<script>
    import Button from "$lib/components/ui/button/button.svelte";
    // import THLogo from '$lib/images/TH-Logo-White-Fatso.svg'

    let props = $props();
</script>


<Button class='h-12 sidebarButton' href={props.url} variant='link'>
    <!-- <img class="mr-4 h-8 w-8" src={THLogo}> -->
    <span class='sidebarButtonText'>{props.label}</span>
</Button>