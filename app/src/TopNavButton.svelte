<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import { cn } from "$lib/utils";
    import { page } from "$app/stores";
   
    let props = $props();
    let url = props.url;
    let isParent = props.parent === 'true'
 
    function getCategory() {
        return '/' + url.split('/')[1]
    }

    function isActive() {
        if (isParent) {
            return $page.url.pathname.startsWith(getCategory())
        } else {
            return $page.url.pathname.startsWith(url)
        }
    }
</script>

<Button
    class={cn(
        "topNav sm:text-[20px] md:text-[18px] lg:text-[24px] xl:text-[32px] px-4 border rounded-t-sm rounded-b-none",
        isActive() && 'active h-[46px] translate-y-[2px]',
        isParent ? 'parent' : 'child',
    )}
    href={props.url}
>
    <span class={cn(isActive() && "translate-y-[-1px] ", !isActive() && "")}
        >{props.label}</span
    >
</Button>
