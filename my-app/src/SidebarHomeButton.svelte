<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import THLightLogo from '$lib/images/TH-Logo-White-Fatso.svg'
    import THPurpleLogo from '$lib/images/TH-Logo-Purple-Fatso.svg'
    import THBlackLogo from '$lib/images/TH-Logo-Black.svg'
    import { page } from '$app/stores';
    import { writable } from "svelte/store";
    import { cn } from "$lib/utils";
    let props = $props();

</script>


<Button 
    class='h-11 sidebarButton'
    variant='link'
    href='/'>
    <img class="mr-4 thLogo" src={THBlackLogo} alt='go away'/>
    <span class='sidebarHomeButtonText'>Timeless Historian</span>
</Button>
