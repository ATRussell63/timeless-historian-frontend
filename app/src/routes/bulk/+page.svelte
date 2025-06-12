<script>
    import * as Card from '$lib/components/ui/card'
    import Button from '$lib/components/ui/button/button.svelte';
    import TemplarSymbol from '$lib/images/TemplarSymbol.svg'
    import NotLoggedInPrompt from '../../NotLoggedInPrompt.svelte';

    let backgroundStyle = `background-size: 150% 150%; background-position: bottom 70% right 60%; background-image: url(${TemplarSymbol});`
</script>

<svelte:head>
    <title>
        Timeless Historian - Bulk Search
    </title>
</svelte:head>

<div class='flex flex-col h-full min-w-[1400px] px-10 py-10' style={backgroundStyle}>
<span class='pageTitle mb-4'>Bulk Search</span>
<NotLoggedInPrompt />
</div>

<style>
    .pageTitle {
        font-family: Fontin-SmallCaps;
        font-size: 48px;
        margin-left: 5px;
    }
</style>