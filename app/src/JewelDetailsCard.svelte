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

    let { sampleMode } = $props();

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
</script>

<div class="flex flex-row w-full h-full justify-between px-6">
    {#if $hoverData}
    <div class="flex flex-col grow-7 basis-[700px]">
        <div class="flex-row w-full flex items-center overflow-hidden">
            <img
                class="border-2 border-black rounded-sm border-solid h-24"
                alt={$hoverData.ascendancy_name}
                src={imgMap[$hoverData.ascendancy_name]}
            />
            <div class="flex flex-col ml-4 mb-2">
                <div class="flex flex-row items-end overflow-hidden">
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        class="multiLang"
                        style={cn($hoverData.character_name.length >= 19 ? "font-size: 24px;" : "font-size: 36px;")}
                        href={`https://www.pathofexile.com/account/view-profile/${$hoverData.account_name.replace("#", "-")}/characters?characterName=${encodeURIComponent($hoverData.character_name)}`}
                        >{$hoverData.character_name}</a
                    >
                    <ExternalLink class="w-5 h-5 ml-1 mb-3" />
                </div>
                <div class="flex flex-row gap-3">
                    <p class='mr-3' style="font-family:Fontin-Italic; margin-top: -3px;">
                        {$hoverData.account_name}
                    </p>
                    {#if $hoverData.vip}
                        <Badge style="margin-top: -3px;"
                            >{$hoverData.vip}</Badge
                        >
                    {/if}
                    {#if $hoverData.end_week == 1}
                        <Badge style="margin-top: -3px;" variant='destructive'
                            >Early League</Badge
                        >
                    {/if}
                </div>
                <Separator class="mt-1" />
                <div class="flex flex-row justify-between gap-5">
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
        <div class='flex flex-row my-auto'>
            <div class="flex flex-col ml-2">
                <div class="flex flex-row items-center">
                    <p class='fontinBold mr-2'>General:</p>
                    <p  class='fontin'
                        style={sampleMode || $hoverData.general_matches
                            ? "color: green;"
                            : "color: red;"}
                    >
                        {$hoverData.general}
                    </p>
                    {#if sampleMode || $hoverData.general_matches}
                        <Check style="color: green;" />
                    {:else}
                        <X style="color: red;" />
                    {/if}
                </div>

                {#if $hoverData.mf_mods}
                    <div class="flex flex-row">
                        <p class='fontinBold mr-2'># Matching Devotion Modifiers:</p>
                        <p  class='fontin'
                            style={sampleMode || $hoverData.mf_mods_match_count == 2
                                ? "color: green;"
                                : "color: red;"}
                        >
                            ({sampleMode ? '2' : $hoverData.mf_mods_match_count}/2)
                        </p>
                    </div>
                {/if}
                <div class='flex flex-row'>
                <p class='fontinBold mr-2'>
                    Socket:</p><p class='fontin'> {$hoverData.socket.name}
                    {$hoverData.socket.description
                        ? "(" + $hoverData.socket.description + ")"
                        : ""}
                </p>
                </div>
                <div class='flex flex-row'>
                <p class='fontinBold mr-2'>Last Scan: </p><p class='fontin'>{$hoverData.scan_date}</p>
                </div>
                <div class='flex flex-row'>
                <p class='fontinBold mr-2'>First Equipped:</p><p class='fontin'>{$hoverData.initial_scan_date}</p>
                </div>
            </div>
        </div>
    </div>
    <Separator orientation="vertical"></Separator>
    <div class="flex flex-col px-6 grow-3 overflow-hidden">
        <p class="cardTitle pl-2 mb-3 mt-1">
            Stats Granted by {$hoverData.jewel_type} {$hoverData.seed}
        </p>
        <div class="w-full">
            <ScrollArea class="insetCard p-4 border rounded-md h-[200px] w-full">
                {#each $hoverData.drawing.jewel_stats as stat}
                    <p style="font-family: Roboto;">{stat}</p>
                {/each}
            </ScrollArea>
        </div>
    </div>
    {/if}
</div>
