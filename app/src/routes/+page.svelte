<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import Separator from "$lib/components/ui/separator/separator.svelte";
    import * as Card from "$lib/components/ui/card";
    import MarakethSymbol from "$lib/images/MarakethSymbol.svg";
    import { afterNavigate } from "$app/navigation";
    import { data_summary } from "../store";
    import { size_breakpoint } from "../store";
    import { isMobile } from "$lib/breakpoints";
    import { derived } from "svelte/store";
    const d = $data_summary.data.results;

    let tagLine = $state("");

    afterNavigate(() => {
        // select a random tagline
        const tagLines = [
            "Jewels Worth Using",
            "A Friend to 5-Way Enjoyers",
            "Archiving Since 3.25",
            "Embrace Eternal Conflict",
            "Sanctioned by the Legion of Legends",
            "`May Reason preserve us'",
            "`Kaom's canoe struck this sand with the force of destiny'",
            "Haste is irrelevant in the face of eternity",
            "`Fortune favor you'",
        ];
        let r = Math.random();

        switch (Math.floor(r * 100)) {
            case 1:
                tagLine = "'...they seem to have met a tribe of... monkeys?'";
                break;
            case 32:
                tagLine = "World of Warcraft has begun once again";
                break;
            case 33:
                tagLine = "...thy Burning Crusade...";
                break;
            case 69:
                tagLine = "Rue is a ___";
                break;
            default:
                tagLine = tagLines[Math.floor(r * tagLines.length)];
        }
    });

    let backgroundStyle = $derived.by(() => {
        const bg_size = isMobile($size_breakpoint) ? '750px 750px' : '140% 140%';
        const bg_position = isMobile($size_breakpoint) ? 'top -10% right 50%' : 'bottom 50% right 50%';
        return `background-repeat: no-repeat; background-size: ${bg_size}; background-position: ${bg_position}; background-image: url(${MarakethSymbol});`
    });
</script>

<svelte:head>
    <title>Timeless Historian</title>
</svelte:head>

<div
    class="flex flex-col px-2 lg:px-6 h-full pt-3 gap-20 lg:min-w-[800px]"
    style={backgroundStyle}
>
    <div class="flex flex-row justify-center mt-16 lg:mt-30">
        <div class="flex flex-col items-center">
            <Card.Root class="transparentBackground">
                <Card.Content class="flex flex-col items-center mx-4 mt-2">
                    <p class='underline underline-offset-12 text-[22px] sm:text-[32px] lg:text-[48px] xl:text-[60px]' style="font-family: Trajan;">
                        Timeless Historian
                    </p>
                    <p
                        class='text-[16px] sm:text-[16px] lg:text-[22px] xl:text-[24px] mt-3 text-center'
                        style="font-family: Fontin-Italic;"
                    >
                        {tagLine}
                    </p>
                </Card.Content>
            </Card.Root>
        </div>
    </div>
    <div class="flex flex-row justify-center lg:mb-20">
        <Card.Root class="transparentBackground w-full max-w-[350px] sm:max-w-[400px] md:max-w-[460px] lg:max-w-[800px]">
            <Card.Content class="m-0 lg:m-4">
                <div class="flex flex-col items-center gap-2">
                    <p class="dataHeader text-[26px] lg:text-[32px]">Currently Indexing:</p>
                    <div class="flex flex-row">
                        <p class="dataVal text-[20px] lg:text-[24px]">{d?.total_jewels}</p>
                        <p class="dataLabel text-[20px] lg:text-[24px]">Total Timeless Jewels</p>
                    </div>
                    <div class="flex flex-row">
                        <p class="dataVal text-[20px] lg:text-[24px]">{d?.total_characters}</p>
                        <p class="dataLabel text-[20px] lg:text-[24px]">Total Characters</p>
                    </div>
                    <div class="flex flex-row">
                        <p class="dataVal text-[20px] lg:text-[24px]">{d?.unique_seeds}</p>
                        <p class="dataLabel text-[20px] lg:text-[24px]">Unique Jewel Seeds</p>
                    </div>
                    <div class="flex flex-row">
                        <p class="dataVal text-[20px] lg:text-[24px]">{d?.unique_jewels}</p>
                        <p class="dataLabel text-[20px] lg:text-[24px]">Unique Timeless Jewels</p>
                    </div>
                </div>
                <div class="flex flex-row justify-center mt-8 lg:mt-12">
                    <Button class="sm:w-[350px] md:w-[400px] lg:w-[500px] h-[80px]" href="/search">
                        <p class="homeSearchButton text-[24px] lg:text-[30px]">Search the Database</p>
                    </Button>
                </div>
            </Card.Content>
        </Card.Root>
    </div>
</div>

<style>
    .dataHeader {
        font-family: Fontin-SmallCaps;
        font-weight: 800;
    }

    .dataVal {
        font-family: Fontin-Bold;
        margin-right: 8px;
    }

    .dataLabel {
        font-family: Fontin-Regular;
    }
</style>
