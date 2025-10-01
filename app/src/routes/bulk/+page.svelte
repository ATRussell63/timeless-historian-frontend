<script>
    import * as Card from '$lib/components/ui/card'
    import Button from '$lib/components/ui/button/button.svelte';
    import TemplarSymbol from '$lib/images/TemplarSymbol.svg'
    import NotLoggedInPrompt from '../../NotLoggedInPrompt.svelte';
    import { account_name, account_leagues } from "../../store";
    import BulkTabSelector from '../../BulkTabSelector.svelte';

    
    let backgroundStyle = `background-size: 1800px 1800px; background-repeat: no-repeat; background-position: top -100px right -60px; background-image: url(${TemplarSymbol});`
</script>

<svelte:head>
    <title>
        Timeless Historian - Bulk Search
    </title>
</svelte:head>

<div class='flex flex-col h-full min-w-[1618px] px-10 py-10' style={backgroundStyle}>
<span class='pageTitle mb-4'>Bulk Search</span>
{#if $account_name !== null}
<BulkTabSelector />
{:else}
<NotLoggedInPrompt />
{/if}
</div>

<style>
    
</style>