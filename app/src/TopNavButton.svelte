<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import { cn } from "$lib/utils";
    import { page } from "$app/stores";

    let props = $props();
    let url = props.url;
    const isActive = () => $page.url.pathname.startsWith(url);
</script>

<Button
    class={cn(
        "topNavButton sm:text-[20px] md:text-[18px] lg:text-[24px] xl:text-[32px] bg-white text-black px-4 border rounded-t-sm rounded-b-none",
        isActive() && "TopNavActive h-[46px] translate-y-[2px]",
        !isActive() && "TopNavNotActive h-[44px]",
    )}
    href={props.url}
>
    <span class={cn(isActive() && "translate-y-[-1px] ", !isActive() && "")}
        >{props.label}</span
    >
</Button>
