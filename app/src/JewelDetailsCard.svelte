<script>
    import Separator from "$lib/components/ui/separator/separator.svelte";
    import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
    import Badge from "$lib/components/ui/badge/badge.svelte";
    import { ExternalLink, Check, X } from "lucide-svelte";
    import * as Card from "$lib/components/ui/card";
    import { cn } from "$lib/utils";

    import Ascendant from "$lib/images/classes/Ascendant.png";
    import Assassin from "$lib/images/classes/Assassin.png";
    import Berserker from "$lib/images/classes/Berserker.png";
    import Champion from "$lib/images/classes/Champion.png";
    import Chieftain from "$lib/images/classes/Chieftain.png";
    import Deadeye from "$lib/images/classes/Deadeye.png";
    import Elementalist from "$lib/images/classes/Elementalist.png";
    import Gladiator from "$lib/images/classes/Gladiator.png";
    import Guardian from "$lib/images/classes/Guardian.png";
    import Hierophant from "$lib/images/classes/Hierophant.png";
    import Inquisitor from "$lib/images/classes/Inquisitor.png";
    import Juggernaut from "$lib/images/classes/Juggernaut.png";
    import Necromancer from "$lib/images/classes/Necromancer.png";
    import Occultist from "$lib/images/classes/Occultist.png";
    import Pathfinder from "$lib/images/classes/Pathfinder.png";
    import Saboteur from "$lib/images/classes/Saboteur.png";
    import Slayer from "$lib/images/classes/Slayer.png";
    import Trickster from "$lib/images/classes/Trickster.png";
    import Warden from "$lib/images/classes/Warden.png";

    import { hoverData } from "./resultsBrowserStore";
    import { size_breakpoint } from "./store";
    import { isMobile } from "$lib/breakpoints";

    let { sampleMode, latestMode } = $props();

    const imgMap = {
        Ascendant: Ascendant,
        Assassin: Assassin,
        Berserker: Berserker,
        Champion: Champion,
        Chieftain: Chieftain,
        Deadeye: Deadeye,
        Elementalist: Elementalist,
        Gladiator: Gladiator,
        Guardian: Guardian,
        Hierophant: Hierophant,
        Inquisitor: Inquisitor,
        Juggernaut: Juggernaut,
        Necromancer: Necromancer,
        Occultist: Occultist,
        Pathfinder: Pathfinder,
        Saboteur: Saboteur,
        Slayer: Slayer,
        Trickster: Trickster,
        Warden: Warden,
    };

    function abbrevDate(datetimeStr) {
        // Create a Date object from the string
        const date = new Date(datetimeStr);

        // Use toUTCString to get the standard format, then split it
        const parts = date.toUTCString().split(' ');
        // ['Wed,', '09', 'Jul', '2025', '17:19:33', 'GMT']

        // Join only the first four parts (day, date, month, year)
        return parts.slice(0, 4).join(' ');
    }

    function displayGeneralMatch() {
        // do we care about displaying whether the general matches the search value?
        return !sampleMode && 'general_match' in $hoverData 
    }

    function generalMatchColor() {
        if (displayGeneralMatch()) {
            return $hoverData.general_match ? 'color: green;' : 'color: red;'
        } else {
            return ''
        }
    }

    function displayMFMatch() {
        return !sampleMode && 'mf_mods' in $hoverData
    }

</script>

{#if !isMobile($size_breakpoint) && $size_breakpoint !== 'lg'}
<div class="flex flex-row w-full justify-between px-6">
    {#if $hoverData}
        <div class="flex flex-col grow-7">
            <div class="flex-row w-full flex overflow-hidden mt-4">
                <div class='flex flex-col justify-center'>
                <img
                    class="border-2 border-black rounded-sm border-solid xl:h-24 2xl:h-28 max-w-none"
                    alt={$hoverData.ascendancy_name}
                    src={imgMap[$hoverData.ascendancy_name]}
                />
                </div>
                <div class="flex flex-col ml-4 mb-2">
                    <div class="flex flex-row items-end overflow-hidden">
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            class={cn("multiLang fontin " + ($hoverData.character_name.length >= 19 ? 'xl:text-[14px] 2xl:text-[20px]' : 'xl:text-[20px] 2xl:text-[28px]'))}
                            href={`https://www.pathofexile.com/account/view-profile/${$hoverData.account_name.replace("#", "-")}/characters?characterName=${encodeURIComponent($hoverData.character_name)}`}
                            >{$hoverData.character_name}</a
                        >
                        <ExternalLink class="w-5 h-5 ml-1 mb-2 2xl:mb-3" />
                    </div>
                    <div class="flex flex-row gap-3">
                        <p
                            class="mr-3"
                            style="font-family:Fontin-Italic; margin-top: -3px;"
                        >
                            {$hoverData.account_name}
                        </p>
                        {#if $hoverData.vip}
                            <Badge style="margin-top: -3px;"
                                >{$hoverData.vip}</Badge
                            >
                        {/if}
                        {#if $hoverData.end_week == 1}
                            <Badge
                                style="margin-top: -3px;"
                                variant="destructive">Early League</Badge
                            >
                        {/if}
                    </div>
                    <Separator class="mt-1" />
                    {#if $size_breakpoint === 'xl' || $size_breakpoint === '2xl'}
                    <div class="flex flex-col justify-between">
                        <p class="fontin text-[14px]">
                            Level {$hoverData.character_level}
                            {$hoverData.ascendancy_name}
                        </p>
                        <p class="fontin text-[14px]">
                            {$hoverData.league_name} League Rank #{$hoverData.ladder_rank}
                        </p>
                    </div>
                    {:else}
                    <div class="flex flex-row justify-between gap-5">
                        <p class="fontin">
                            Level {$hoverData.character_level}
                            {$hoverData.ascendancy_name}
                        </p>
                        <p class="fontin">
                            {$hoverData.league_name} League Rank #{$hoverData.ladder_rank}
                        </p>
                    </div>
                    {/if}
                </div>
            </div>
            <div class="flex flex-row my-auto xl:text-[16px] 2xl:text-[16px]">
                <div class="flex flex-col ml-2">
                    <div class="flex flex-row items-center">
                        <p class="fontinBold mr-2">General:</p>
                        <p
                            class="fontin"
                            style={generalMatchColor()}
                        >
                            {$hoverData.general}
                        </p>
                        {#if displayGeneralMatch()}
                            {#if $hoverData.general_match}
                                <Check style="color: green;" />
                            {:else}
                                <X style="color: red;" />
                            {/if}
                        {/if}
                    </div>

                    {#if displayMFMatch() && $hoverData.jewel_type == 'Militant Faith'}
                        <div class="flex flex-row">
                            <p class="fontinBold mr-2">
                                # Matching Devotion Modifiers:
                            </p>
                            <p
                                class="fontin"
                                style={$hoverData.mf_mods_match_count == 2
                                    ? "color: green;"
                                    : "color: red;"}
                            >
                                ({$hoverData.mf_mods_match_count}/2)
                            </p>
                        </div>
                    {/if}
                    <div class="flex flex-row">
                        <p class="fontinBold mr-2">Socket:</p>
                        <p class="fontin">
                            {$hoverData.socket.name}
                            {$hoverData.socket.description
                                ? "(" + $hoverData.socket.description + ")"
                                : ""}
                        </p>
                    </div>
                    <div class="flex flex-row">
                        <p class="fontinBold mr-2">Last Scan:</p>
                        <p class="fontin">{$hoverData.scan_date}</p>
                    </div>
                    <div class="flex flex-row">
                        <p class="fontinBold mr-2">First Equipped:</p>
                        <p class="fontin">{$hoverData.initial_scan_date}</p>
                    </div>
                </div>
            </div>
        </div>
        <Separator orientation="vertical" />
        <div class="flex flex-col ml-2 grow-3 xl:basis-[250px] 2xl:basis-[300px] overflow-hidden my-4">
            <p class="cardTitle pl-2 mb-3 mt-1 xl:text-[16px] 2xl:text-[16px]">
                Stats Granted by {$hoverData.jewel_type}
                {$hoverData.seed}
            </p>
            <div class="w-full">
                <ScrollArea
                    class="insetCard p-4 border rounded-md h-[200px] w-full"
                >
                    {#each $hoverData.drawing.jewel_stats as stat}
                        <p class='roboto my-2 xl:text-[16px] 2xl:text-[16px]'>&#8226 {stat}</p>
                    {/each}
                </ScrollArea>
            </div>
        </div>
    {/if}
</div>
{:else if $size_breakpoint == 'lg'}
<div class="flex flex-row w-full h-full justify-between">
    {#if $hoverData}
        <div class="flex flex-col grow-7 basis-[700px] my-4 ml-4">
            <div class="flex-row w-full flex overflow-hidden">
                <div class='flex flex-col justify-center'>
                <img
                    class="border-2 border-black rounded-sm border-solid h-24 max-w-none"
                    alt={$hoverData.ascendancy_name}
                    src={imgMap[$hoverData.ascendancy_name]}
                />
                </div>
                <div class="flex flex-col ml-4 mb-2">
                    <div class="flex flex-row items-end overflow-hidden">
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            class="multiLang"
                            style={cn(
                                $hoverData.character_name.length >= 19
                                    ? "font-size: 18px;"
                                    : "font-size: 24px;",
                            )}
                            href={`https://www.pathofexile.com/account/view-profile/${$hoverData.account_name.replace("#", "-")}/characters?characterName=${encodeURIComponent($hoverData.character_name)}`}
                            >{$hoverData.character_name}</a
                        >
                        <ExternalLink class="w-5 h-5 ml-1 mb-3" />
                    </div>
                    <div class="flex flex-row gap-3">
                        <p
                            class="mr-3"
                            style="font-family:Fontin-Italic; margin-top: -3px;"
                        >
                            {$hoverData.account_name}
                        </p>
                        {#if $hoverData.vip}
                            <Badge style="margin-top: -3px;"
                                >{$hoverData.vip}</Badge
                            >
                        {/if}
                        {#if $hoverData.end_week == 1}
                            <Badge
                                style="margin-top: -3px;"
                                variant="destructive">Early League</Badge
                            >
                        {/if}
                    </div>
                    <Separator class="mt-1" />
                    <div class="flex flex-col justify-between">
                        <p class="fontin text-[16px]">
                            Level {$hoverData.character_level}
                            {$hoverData.ascendancy_name}
                        </p>
                        <p class="fontin text-[16px]">
                            {$hoverData.league_name} League Rank #{$hoverData.ladder_rank}
                        </p>
                    </div>
                </div>
            </div>
            <div class="flex flex-row my-auto">
                <div class="flex flex-col ml-1">
                    <div class="flex flex-row items-center">
                        <p class="fontinBold mr-2">General:</p>
                        <p
                            class="fontin"
                            style={generalMatchColor()}
                        >
                            {$hoverData.general}
                        </p>
                        {#if displayGeneralMatch()}
                            {#if $hoverData.general_match}
                                <Check style="color: green;" />
                            {:else}
                                <X style="color: red;" />
                            {/if}
                        {/if}
                    </div>

                    {#if displayMFMatch()}
                        <div class="flex flex-row">
                            <p class="fontinBold mr-2">
                                # Matching Devotion Modifiers:
                            </p>
                            <p
                                class="fontin"
                                style={$hoverData.mf_mods_match_count == 2
                                    ? "color: green;"
                                    : "color: red;"}
                            >
                                ({$hoverData.mf_mods_match_count}/2)
                            </p>
                        </div>
                    {/if}
                    <div class="flex flex-row">
                        <p class="fontinBold mr-2">Socket:</p>
                        <p class="fontin">
                            {$hoverData.socket.name}
                            {$hoverData.socket.description
                                ? "(" + $hoverData.socket.description + ")"
                                : ""}
                        </p>
                    </div>
                    <div class="flex flex-row">
                        <p class="fontinBold mr-2">Last Scan:</p>
                        <p class="fontin">{$hoverData.scan_date}</p>
                    </div>
                    <div class="flex flex-row">
                        <p class="fontinBold mr-2">First Equipped:</p>
                        <p class="fontin">{$hoverData.initial_scan_date}</p>
                    </div>
                </div>
            </div>
        </div>
        <Separator orientation="vertical"></Separator>
        <div class="flex flex-col px-6 grow-3 overflow-hidden my-4">
            <p class="cardTitle pl-2 mb-3 mt-1">
                Stats Granted by {$hoverData.jewel_type}
                {$hoverData.seed}
            </p>
            <div class="w-full">
                <ScrollArea
                    class="insetCard p-4 border rounded-md h-[200px] w-full"
                >
                    {#each $hoverData.drawing.jewel_stats as stat}
                        <p style="font-family: Roboto;">&#8226 {stat}</p>
                    {/each}
                </ScrollArea>
            </div>
        </div>
    {/if}
</div>
{:else}
<div class="flex flex-row w-full h-full justify-between mb-4">
    {#if $hoverData}
        <div class="flex flex-col grow-7 basis-[700px]">
            <div class="flex-row w-full flex overflow-hidden mb-2">
                <div class='flex flex-col justify-center'>
                <img
                    class="border-2 border-black rounded-sm border-solid h-24 max-w-none"
                    alt={$hoverData.ascendancy_name}
                    src={imgMap[$hoverData.ascendancy_name]}
                />
                </div>
                <div class="flex flex-col ml-4 w-full">
                    <div class="flex flex-row items-center overflow-hidden">
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            class="multiLang"
                            style={cn(
                                $hoverData.character_name.length >= 19
                                    ? "font-size: 14px;"
                                    : "font-size: 16px;",
                            )}
                            href={`https://www.pathofexile.com/account/view-profile/${$hoverData.account_name.replace("#", "-")}/characters?characterName=${encodeURIComponent($hoverData.character_name)}`}
                            >{$hoverData.character_name}</a
                        >
                        <ExternalLink class="w-4 h-4 ml-1 mb-1" />
                    </div>
                    <div class="flex flex-row gap-3">
                        <p
                            class="mr-3"
                            style="font-family:Fontin-Italic; margin-top: -3px;"
                        >
                            {$hoverData.account_name}
                        </p>
                        {#if $size_breakpoint !== 'xs'}
                            {#if $hoverData.vip}
                            <Badge style="margin-top: -3px;"
                                >{$hoverData.vip}</Badge
                            >
                            {/if}
                            {#if $hoverData.end_week == 1}
                                <Badge
                                    style="margin-top: -3px;"
                                    variant="destructive">Early League</Badge
                                >
                            {/if}
                        {/if}
                    </div>
                    {#if $size_breakpoint === 'xs'}
                    <div class="flex flex-row w-fit">
                        {#if $hoverData.vip}
                            <Badge style="margin-top: -3px;"
                                >{$hoverData.vip}</Badge
                            >
                        {/if}
                        {#if $hoverData.end_week == 1}
                            <Badge
                                style="margin-top: -3px;"
                                variant="destructive">Early League</Badge
                            >
                        {/if}
                    </div>
                    {/if}
                    <Separator class="my-1" />
                    <div class="flex flex-col text-[14px]">
                        <p class="fontin">
                            Level {$hoverData.character_level}
                            {$hoverData.ascendancy_name}
                        </p>
                        <p class="fontin">
                            {$hoverData.league_name} League Rank #{$hoverData.ladder_rank}
                        </p>
                    </div>
                </div>
            </div>
            {#if !latestMode}
            <div class="flex flex-row ml-1">
                <div class="flex flex-col text-[14px]">
                    <div class="flex flex-row items-center">
                        <p class="fontinBold mr-2">General:</p>
                        <p
                            class="fontin"
                            style={generalMatchColor}
                        >
                            {$hoverData.general}
                        </p>
                        {#if displayGeneralMatch()}
                            {#if $hoverData.general_match}
                                <Check style="color: green;" />
                            {:else}
                                <X style="color: red;" />
                            {/if}
                        {/if}
                    </div>

                    {#if displayMFMatch()}
                        <div class="flex flex-row">
                            <p class="fontinBold mr-2">
                                # Matching Devotion Modifiers:
                            </p>
                            <p
                                class="fontin"
                                style={$hoverData.mf_mods_match_count == 2
                                    ? "color: green;"
                                    : "color: red;"}
                            >
                                ({$hoverData.mf_mods_match_count}/2)
                            </p>
                        </div>
                    {/if}
                    <div class="flex flex-row">
                        <p class="fontinBold mr-2">Socket:</p>
                        <p class="fontin">
                            {$hoverData.socket.name}
                        </p>
                    </div>
                    <div class="flex flex-row">
                        <p class="fontinBold mr-2">Last Scan:</p>
                        <p class="fontin">{abbrevDate($hoverData.scan_date)}</p>
                    </div>
                    <div class="flex flex-row">
                        <p class="fontinBold mr-2">First Equipped:</p>
                        <p class="fontin">{abbrevDate($hoverData.initial_scan_date)}</p>
                    </div>
                </div>
            </div>
            {:else}
            <div class='flex flex-row justify-between text-[14px] sm:mx-8 md:text-[16px]'>
                <div class='flex flex-row gap-2 fontin'>
                <b>Type: </b><p>{$hoverData.jewel_type}</p>
                </div>
                <div class='flex flex-row gap-2 fontin'>
                <b>General: </b><p>{$hoverData.general}</p>
                </div>
                <div class='flex flex-row gap-2 fontin'>
                <b>Seed: </b><p>{$hoverData.seed}</p>
                </div>
            </div>
            {/if}
            <Separator class='my-2'/>
            <div class="flex flex-col grow-3 overflow-hidden">
                <p class="cardTitle pl-2 mt-1 mb-2 text-[14px]">
                    Stats Granted by {$hoverData.jewel_type}
                    {$hoverData.seed}
                </p>
                <div class="w-full">
                    <ScrollArea
                        class="insetCard p-4 border rounded-md h-[120px] md:h-[150px] w-full"
                    >
                        {#each $hoverData.drawing.jewel_stats as stat}
                            <p style="font-family: Roboto;" class='text-[14px]'>&#8226 {stat}</p>
                        {/each}
                    </ScrollArea>
                </div>
            </div>
        </div>
        
    {/if}
</div>
{/if}
