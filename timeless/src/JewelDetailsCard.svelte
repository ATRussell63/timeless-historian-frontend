<script>
    import Separator from "$lib/components/ui/separator/separator.svelte";
    import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
    import Badge from "$lib/components/ui/badge/badge.svelte";
    import { ExternalLink, Check, X } from "lucide-svelte";
    import * as Card from "$lib/components/ui/card";
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

    // MAJOR TODO - unascended shadows fucking your shit up

    let { data } = $props();

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
    <div class="flex flex-col grow-7 basis-[700px]">
        <div class="flex-row w-full flex items-center overflow-hidden">
            <img
                class="border-2 border-black rounded-sm border-solid h-24"
                alt={data.ascendancy_name}
                src={imgMap[data.ascendancy_name]}
            />
            <div class="flex flex-col ml-4 mb-2">
                <div class="flex flex-row items-end overflow-hidden">
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        class="multiLang"
                        style="font-size: 36px;"
                        href={`https://www.pathofexile.com/account/view-profile/${data.account_name.replace("#", "-")}/characters?characterName=${encodeURIComponent(data.character_name)}`}
                        >{data.character_name}</a
                    >
                    <ExternalLink class="w-5 h-5 ml-1 mb-3" />
                </div>
                <div class="flex flex-row">
                    <p style="font-family:Fontin-Italic; margin-top: -3px;">
                        {data.account_name}
                    </p>
                    {#if data.vip}
                        <Badge class="ml-3" style="margin-top: -3px;"
                            >{data.vip}</Badge
                        >
                    {/if}
                </div>
                <Separator class="mt-1" />
                <div class="flex flex-row justify-between gap-5">
                    <p class="fontin">
                        Level {data.character_level}
                        {data.ascendancy_name}
                    </p>
                    <p class="fontin">
                        {data.league_name} League Rank #{data.ladder_rank}
                    </p>
                </div>
            </div>
        </div>
        <div class='flex flex-row my-auto'>
            <div class="flex flex-col ml-2">
                <div class="flex flex-row items-center">
                    <p class='fontinBold mr-2'>General:</p>
                    <p  class='fontin'
                        style={data.general_matches
                            ? "color: green;"
                            : "color: red;"}
                    >
                        {data.general}
                    </p>
                    {#if data.general_matches}
                        <Check style="color: green;" />
                    {:else}
                        <X style="color: red;" />
                    {/if}
                </div>

                {#if data.mf_mods}
                    <div class="flex flex-row">
                        <p class='fontinBold mr-2'># Matching Devotion Modifiers:</p>
                        <p  class='fontin'
                            style={data.mf_mods_match_count == 2
                                ? "color: green;"
                                : "color: red;"}
                        >
                            ({data.mf_mods_match_count}/2)
                        </p>
                    </div>
                {/if}
                <div class='flex flex-row'>
                <p class='fontinBold mr-2'>
                    Socket:</p><p class='fontin'> {data.socket.name}
                    {data.socket.description
                        ? "(" + data.socket.description + ")"
                        : ""}
                </p>
                </div>
                <div class='flex flex-row'>
                <p class='fontinBold mr-2'>Last Scan: </p><p class='fontin'>{data.scan_date}</p>
                </div>
                <div class='flex flex-row'>
                <p class='fontinBold mr-2'>First Equipped:</p><p class='fontin'>{data.initial_scan_date}</p>
                </div>
            </div>
        </div>
    </div>
    <Separator orientation="vertical"></Separator>
    <div class="flex flex-col px-6 grow-3 overflow-hidden">
        <p class="cardTitle pl-2 mb-3">
            Stats Granted by {data.jewel_type}
        </p>
        <div class="w-full">
            <ScrollArea class="p-4 border rounded-md h-[200px] w-full">
                {#each data.drawing.jewel_stats as stat}
                    <p style="font-family: Roboto;">{stat}</p>
                {/each}
            </ScrollArea>
        </div>
    </div>
</div>
