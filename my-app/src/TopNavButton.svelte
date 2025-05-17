<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import { cn } from '$lib/utils'
    let props = $props();
    import { page } from '$app/stores';
    import { derived, get } from 'svelte/store';

    // let isActive = derived(page, ($page) =>
    //     $page.url.pathname === props.url
    // );
    let url = props.url;
    // const isActive = derived($page.url.pathname === '/');
    const isActive = () => $page.url.pathname === url;

    // const isActive = derived(page, ($page) => $page.url.pathname === props.url)
</script>

<Button
    class={cn(
        "topNavButton bg-white text-black px-4 rounded-t-sm rounded-b-none",
        isActive() && 'TopNavActive',
        !isActive() && 'TopNavNotActive'
    )}
    href={props.url}
    >
    <!-- {$isActive} -->
    {props.label}
</Button>
