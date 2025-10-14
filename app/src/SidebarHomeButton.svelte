<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import THLightLogo from "$lib/images/TH-Logo-White.svg";
    import THBlackLogo from "$lib/images/TH-Logo-Black.svg";
    import { mode } from "mode-watcher";
</script>

<Button variant="link" href="/">
    <div class='lg:min-w-[30px]'>
        {#if mode.current !== 'dark'}
        <img
            class="mr-2 sm:h-[18px] md:h-[20px] lg:h-[20px] xl:h-[24px]"
            src={THBlackLogo}
            alt="TH Logo"
        />
        {:else}
        <img
            class="mr-2 sm:h-[18px] md:h-[20px] lg:h-[20px] xl:h-[24px]"
            src={THLightLogo}
            alt="TH Logo"
        />
        {/if}
    </div>
    <span class="trajan sm:text-[18px] md:text-[20px] lg:text-[20px] xl:text-[26px]">Home</span>
</Button>
