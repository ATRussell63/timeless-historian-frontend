<script>
    import TemplarSymbol from "$lib/images/TemplarSymbol.svg";
    import NotLoggedInPrompt from "../../NotLoggedInPrompt.svelte";
    import { account_name, size_breakpoint } from "../../store";
    import { isMobile } from "$lib/breakpoints";
    import BulkTabSelector from "../../BulkTabSelector.svelte";
    import ResultsBrowser from "../../ResultsBrowser.svelte";
    import { search_result } from "../../store";
    import { forceHidden } from "../../resultsBrowserStore";

    let backgroundStyle = $derived.by(() => {
        const bg_size = isMobile($size_breakpoint) ? '700px 700px' : '140% 140%';
        const bg_position = isMobile($size_breakpoint) ? 'top 20% right 50%' : 'bottom 50% right 50%';
        return `background-repeat: no-repeat; background-size: ${bg_size}; background-position: ${bg_position}; background-image: url(${TemplarSymbol});`
    });

</script>

<svelte:head>
    <title>Timeless Historian - Bulk Search</title>
</svelte:head>

<div
    class="flex flex-col h-full lg:min-w-[830px] xl:min-w-[900px] 2xl:min-w-[1293px] px-10 py-10"
    style={backgroundStyle}
>
    {#if !isMobile($size_breakpoint)}
    <span class="pageTitle mb-8 xl:mb-4">Bulk Search</span>
    {/if}
    {#if $account_name !== null}
        <BulkTabSelector />
        {#if $search_result && !$forceHidden}
        <div class="flex flex-row">
            <span class="fontinSmallCaps mt-4 mb-2 text-[24px] lg:text-[32px] xl:text-[40px] 2xl:text-[48px]">Search Results</span>
        </div>
        {/if}
        <ResultsBrowser />
    {:else}
        <NotLoggedInPrompt />
    {/if}
</div>
