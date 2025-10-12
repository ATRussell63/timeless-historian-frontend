<script>
    import TemplarSymbol from "$lib/images/TemplarSymbol.svg";
    import NotLoggedInPrompt from "../../NotLoggedInPrompt.svelte";
    import { account_name, mobile_layout } from "../../store";
    import BulkTabSelector from "../../BulkTabSelector.svelte";

    let backgroundStyle = $derived.by(() => {
        const bg_size = $mobile_layout ? '700px 700px' : '140% 140%';
        const bg_position = $mobile_layout ? 'top 20% right 50%' : 'bottom 50% right 50%';
        return `background-repeat: no-repeat; background-size: ${bg_size}; background-position: ${bg_position}; background-image: url(${TemplarSymbol});`
    });

</script>

<svelte:head>
    <title>Timeless Historian - Bulk Search</title>
</svelte:head>

<div
    class="flex flex-col h-full lg:min-w-[1618px] px-4 py-10"
    style={backgroundStyle}
>
    <span class="pageTitle mb-4 pl-5">Bulk Search</span>
    {#if $account_name !== null}
        <BulkTabSelector />
    {:else}
        <NotLoggedInPrompt />
    {/if}
</div>
