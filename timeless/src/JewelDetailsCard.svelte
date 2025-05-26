<script>
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
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

<div class='flex flex-row w-full h-[370px]'>
<div class='flex-col w-[55%]'>
<div class='flex-row flex-auto w-full flex items-center justify-start'>
<img class='border-2 border-black rounded-sm border-solid' alt={data.ascendancy_name} src={imgMap[data.ascendancy_name]} />
<div class='flex flex-col ml-4'>
    <div class='flex flex-row items-end'>
        <a target="_blank" rel="noopener noreferrer" class='multiLang' style='font-size: 36px;' 
        href={`https://www.pathofexile.com/account/view-profile/${data.account_name.replace('#', '-')}/characters?characterName=${encodeURIComponent(data.character_name)}`}
        >{data.character_name}</a>
        <ExternalLink class='w-5 h-5 ml-1 mb-3'/>
    </div>
    <p style='font-family:Fontin-Italic; margin-top: -9px;'>{data.account_name}</p>
<Separator class='' />
<div class='flex flex-row justify-between gap-5'>
<p class='fontin'>Level {data.character_level} {data.ascendancy_name}</p><p class='fontin'>{data.league_name} League Rank #{data.ladder_rank}</p>
</div>
</div>
</div>
<div class='flex-row'>
<p>Pee pees sucked</p>
</div>
</div>
<Separator orientation='vertical'></Separator>
<div class='flex flex-col'>
    <Card.Root>
        <Card.Header>
            <Card.Title class='cardTitle'>
                Stats Granted by {data.jewel_type}
            </Card.Title>
        </Card.Header>
        <Card.Content class='px-8'>
            <ScrollArea class='border p-4 h-[120px]'>
            {#each data.drawing.jewel_stats as stat}
                <p style='font-family: Roboto;'>{stat}</p>
            {/each}
            </ScrollArea>
        </Card.Content>
    </Card.Root>
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

