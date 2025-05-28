<script>
    import MarakethSymbol from '$lib/images/MarakethSymbol.svg'
    import { data_summary } from '../store'
    import Button from '$lib/components/ui/button/button.svelte'
    import Separator from '$lib/components/ui/separator/separator.svelte'
    import * as Card from '$lib/components/ui/card'
    import { afterNavigate } from '$app/navigation';

    const d = $data_summary.response[0].results
    console.log(d);

    let tagLine = $state('');

    afterNavigate(() => {
        // select a random tagline
        const tagLines = ['An Archive of Jewels Worth Using', 'Friend to Legion Farmers', 'PC Pls']
        const r = Math.floor(Math.random() * tagLines.length);
        tagLine = tagLines[r];
    })

    let backgroundStyle = `background-size: 140% 140%; background-position: bottom 50% right 50%; background-image: url(${MarakethSymbol});`
</script>

<div class='flex flex-col mb-2 px-6 pt-3 h-full gap-20 min-w-[1200px]' style={backgroundStyle}>
    <div class='flex flex-row justify-center mt-30'>
        <div class='flex flex-col items-center'>
            <Card.Root class='transparentBackground'>
                <Card.Content class='flex flex-col items-center mx-4 mt-2'>
                    <p style='font-family: Trajan; font-size: 60px;'>Timeless Historian</p>
                    <Separator class='h-1' style='margin-top: -10px; background-color: black;' />
                    <p style='font-family: Fontin-Italic; font-size: 24px; margin-top: 8px;'>{tagLine}</p>
                </Card.Content>
            </Card.Root>
        </div>
    </div>
    <div class='flex flex-row justify-center'>
    <Card.Root class='transparentBackground max-w-[800px]'>
        <Card.Content class='m-4'>
            <div class='flex flex-col items-center gap-2'>
                <p class='dataHeader'>Currently Indexing:</p>
                <div class='flex flex-row'>
                    <p class='dataVal'>{d.total_jewels}</p>
                    <p class='dataLabel'> Total Timeless Jewels</p>
                </div>
                <div class='flex flex-row'>
                    <p class='dataVal'>{d.total_characters}</p>
                    <p class='dataLabel'> Total Characters</p>
                </div>
                <div class='flex flex-row'>
                    <p class='dataVal'>{d.unique_seeds}</p>
                    <p class='dataLabel'> Unique Jewel Seeds</p>
                </div>
                <div class='flex flex-row'>
                    <p class='dataVal'>{d.unique_jewels}</p>
                    <p class='dataLabel'> Unique Timeless Jewels</p>
                </div>
            </div>
        <div class='flex flex-row justify-center mt-12'>
            <Button class='w-[500px] h-[80px]' href='/search'>
                <p class='homeSearchButton'>Search the DB</p>
            </Button>
        </Card.Content>
    </Card.Root>
        </div>
</div>

<style>
    .dataHeader {
        font-family: Fontin-SmallCaps;
        font-weight: 800;
        font-size: 32px;
    }

    .dataVal {
        font-family: Fontin-Bold;
        margin-right: 8px;
        font-size: 24px;
    }

    .dataLabel {
        font-family: Fontin;
        font-size: 24px;
    }

    .homeSearchButton {
        font-family: Fontin;
        font-size: 30px;
    }
</style>