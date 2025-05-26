<script>
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
    import Badge from '$lib/components/ui/badge/badge.svelte';
    import { ExternalLink } from 'lucide-svelte';
    import * as Card from '$lib/components/ui/card';
    import Ascendant from '$lib/images/classes/Ascendant.png';
    import Assassin from '$lib/images/classes/Assassin.png';
    import Berserker from '$lib/images/classes/Berserker.png';
    import Champion from '$lib/images/classes/Champion.png';
    import Chieftain from '$lib/images/classes/Chieftain.png';
    import Deadeye from '$lib/images/classes/Deadeye.png';
    import Elementalist from '$lib/images/classes/Elementalist.png';
    import Gladiator from '$lib/images/classes/Gladiator.png';
    import Guardian from '$lib/images/classes/Guardian.png';
    import Hierophant from '$lib/images/classes/Hierophant.png';
    import Inquisitor from '$lib/images/classes/Inquisitor.png';
    import Juggernaut from '$lib/images/classes/Juggernaut.png';
    import Necromancer from '$lib/images/classes/Necromancer.png';
    import Occultist from '$lib/images/classes/Occultist.png';
    import Pathfinder from '$lib/images/classes/Pathfinder.png';
    import Saboteur from '$lib/images/classes/Saboteur.png';
    import Slayer from '$lib/images/classes/Slayer.png';
    import Trickster from '$lib/images/classes/Trickster.png';
    import Warden from '$lib/images/classes/Warden.png';

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
        Warden: Warden
    }
</script>

<div class='flex flex-row w-full h-full mb-5'>
<div class='flex-col w-[55%]'>
<div class='flex-row flex-auto w-full flex items-center justify-start'>
<img class='border-2 border-black rounded-sm border-solid mt-3 h-24' alt={data.ascendancy_name} src={imgMap[data.ascendancy_name]} />
<div class='flex flex-col ml-4'>
    <div class='flex flex-row items-end'>
        <a target="_blank" rel="noopener noreferrer" class='multiLang' style='font-size: 36px;' 
        href={`https://www.pathofexile.com/account/view-profile/${data.account_name.replace('#', '-')}/characters?characterName=${encodeURIComponent(data.character_name)}`}
        >{data.character_name}</a>
        <ExternalLink class='w-5 h-5 ml-1 mb-3'/>
    </div>
    <div class='flex flex-row'>
        <p style='font-family:Fontin-Italic; margin-top: -3px;'>{data.account_name}</p>
        {#if data.vip}
        <Badge class='ml-3' style='margin-top: -3px;'>{data.vip}</Badge>
        {/if}
    </div>
<Separator class='mt-1' />
<div class='flex flex-row justify-between gap-5'>
<p class='fontin'>Level {data.character_level} {data.ascendancy_name}</p><p class='fontin'>{data.league_name} League Rank #{data.ladder_rank}</p>
</div>
</div>
</div>
<div class='flex-row'>
<p>Last Scan: </p>
<p>First Equipped: </p>
<p>Equipped in socket: </p>
<p>General: </p>
</div>
</div>
<Separator orientation='vertical'></Separator>
<div class='flex flex-col px-6 w-[45%]'>
        <p class='cardTitle pl-2 mb-3'>
            Stats Granted by {data.jewel_type}
        </p>
        <div class='pl-6 w-full'>
            <ScrollArea class='p-4 border rounded-sm h-[200px] w-full'>
            {#each data.drawing.jewel_stats as stat}
                <p style='font-family: Roboto;'>{stat}</p>
            {/each}
            </ScrollArea>
        </div>
</div>
</div>


<!-- <div class='flex-row flex-auto w-full flex items-center justify-center'>
<img class='border-2 border-black rounded-sm border-solid' alt={data.ascendancy_name} src={imgMap[data.ascendancy_name]} />
<div class='flex flex-col ml-4'>
<p class='multiLang' style='font-size: 40px;'>{data.character_name}</p>
<Separator />
<p>Level {data.character_level} {data.ascendancy_name}</p>
</div>
</div>
<div class='flex-row flex-auto w-full flex items-center justify-center'>
<img class='border-2 border-black rounded-sm border-solid' alt={data.ascendancy_name} src={imgMap[data.ascendancy_name]} />
<div class='flex flex-col ml-4'>
<p class='multiLang' style='font-size: 40px;'>{data.character_name}</p>
<Separator />
<p>Level {data.character_level} {data.ascendancy_name}</p>
</div>
</div>
<div class='flex-row flex-auto w-full flex items-center justify-center'>
<img class='border-2 border-black rounded-sm border-solid' alt={data.ascendancy_name} src={imgMap[data.ascendancy_name]} />
<div class='flex flex-col ml-4'>
<p class='multiLang' style='font-size: 40px;'>{data.character_name}</p>
<Separator />
<p>Level {data.character_level} {data.ascendancy_name}</p>
</div>
</div> -->

