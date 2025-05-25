<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import { cn } from '$lib/utils'
    let props = $props();
    import { page } from '$app/stores';
    import { derived, get } from 'svelte/store';

    let url = props.url;
    const isActive = () => $page.url.pathname.startsWith(url);

</script>

<Button
    class={cn(
        "topNavButton bg-white text-black px-4 rounded-t-sm rounded-b-none",
        isActive() && 'TopNavActive',
        !isActive() && 'TopNavNotActive'
    )}
    href={props.url}
    >
    {props.label}
</Button>
