<!-- this one goes out to all the garbage frontend devs that put me through this -->

<script>
    import Button from "$lib/components/ui/button/button.svelte";
    let props = $props();
</script>
<Button class="topNavButton topNavDisabledButton bg-white h-[44px] border text-black px-4 rounded-t-sm rounded-b-none z-0" disabled={true}>{props.label}</Button>
