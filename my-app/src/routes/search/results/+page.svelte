<script>
    import { search_result } from "../../../store";
    import * as Card from '$lib/components/ui/card';
    import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
    import * as Accordion from '$lib/components/ui/accordion';
    import JewelDrawing from "../../../jewelDrawing.svelte";
    import { Button } from '$lib/components/ui/button/index.js';
    import Separator from "$lib/components/ui/separator/separator.svelte";
    import Switch from "$lib/components/ui/switch/switch.svelte";
    import * as Select from '$lib/components/ui/select'
    import ChevronLeft from "lucide-svelte/icons/chevron-left";

    let hoverData = $state(null);
    let selectedJewel = $state(null);
    let minMatchingMFMods = $state(0);
    let matchGeneral = $state(false);

    let { body, response } = $search_result;
    response = response[0].results;
    let displayedResponse = $state($state.snapshot(response));

    function totalResults(results) {
        let count = 0;
        Object.keys(results).forEach(league => {
            results[league].forEach(entry => {
                count++;
            })
        })
        return count;
    }

    function topAttr(results, attr) {
        let values = {};
        let top = { name: '', count: 0 }
        Object.keys(results).forEach(league => {
            results[league].forEach(entry => {
                if (!Object.keys(values).includes(entry[attr])) {
                    values[entry[attr]] = 1;
                } else {
                    values[entry[attr]]++;
                }

                if (values[entry[attr]] > top.count) {
                    top = { name: entry[attr], count: values[entry[attr]] }
                }
            })
        })

        return top
    }

    function topLeague(results) {
        let all = {}
        let top = { name: '', count: 0}
        Object.keys(results).forEach(league => {
            all[league] = results[league].length
            if (all[league] > top.count) {
                top = { name: league, count: all[league] }
            }
        })
        return top
    }

    function topSocket(results) {
        let all = {}
        let top = { value: {}, count: 0 }
        Object.keys(results).forEach(league => {
            results[league].forEach(entry => {
                if (!Object.keys(all).includes(entry.socket.name)) {
                    all[entry.socket.name] = 1;
                } else {
                    all[entry.socket.name]++;
                }

                if (all[entry.socket.name] > top.count) {
                    top = { value: entry.socket, count: all[entry.socket.name]}
                }
            })
        })

        console.log(all)
        return top
    }

    function applyFilters(general, minMatches) {
        console.log(`gen ${general}, mf ${minMatches}`)

        let results = $state.snapshot(response);
        Object.keys(results).forEach(league => {
            results[league] = results[league].filter((jewel) => {
                let mf = jewel.mf_mods_match_count >= minMatches
                let gen = true
                if (general) {
                    gen = jewel.general_match
                }
                return mf && gen
            })
        })
        displayedResponse = results
    }

    // console.log(data);
</script>

<!-- Title row -->
<div class='mb-2 flex flex-row items-center justify-between'>
    <div class='flex items-center'>
        <span class='contentTitle'>Search Results - </span>
            <div class='queryDetail'>
                <span class='queryHeaderLabel'>Type: </span><span class='queryHeader'>{body.jewel_type}</span>
            </div>
            <div class='queryDetail'>
                <span class='queryHeaderLabel'>General: </span><span class='queryHeader'>{body.general}</span>
            </div>
            <div class='queryDetail'>
                <span class='queryHeaderLabel'>Seed: </span><span class='queryHeader'>{body.seed}</span>
            </div>
            {#if body.jewel_type === 'Militant Faith'}
            <div class='queryDetail'>
                <span class='queryHeaderLabel'>Devotion Mods: </span><span class='queryHeader'>{body.mf_mods[0]}, {body.mf_mods[1]}</span>
            </div>
            {/if}
    </div>
    <Button class='pl-1 ml-5' variant='ghost' href='/search'><ChevronLeft class='h-5'/><span style='text-decoration: underline; font-family: Roboto;'>Back to Search</span></Button>
</div>

<!-- Results Summary -->
<Card.Root>
    <!-- <Card.Header>
        <Card.Title></Card.Title>
    </Card.Header> -->
    <Card.Content class='flex flex-row justify-between'>
        <div>
            <h1>Stats</h1>
            <p>Total Matches:</p><p>{totalResults(response)}</p>
            <p>
                Top General: <span style={topAttr(response, 'general').name === body.general ? 'color: green;' : 'color: red;'}>{topAttr(response, 'general').name} ({topAttr(response, 'general').count})</span>
            </p>
            <p>Top Ascendancy: <span>{topAttr(response, 'ascendancy_name').name} ({topAttr(response, 'ascendancy_name').count})</span></p>
            <p>Top Socket: <span>{topSocket(response).value.name} ({topSocket(response).count})</span></p>
            <p>Top League: <span>{topLeague(response).name} ({topLeague(response).count})</span></p>
        </div>
    </Card.Content>
</Card.Root>

<Card.Root class='mt-5'>
    <Card.Title>
        Only Show Results with:
    </Card.Title>
    <Card.Content>
        <div>
            <span>Matching General</span>
            <Switch 
                bind:checked={matchGeneral}
                onCheckedChange={(v) => {
                    applyFilters(v, minMatchingMFMods);
                    matchGeneral = v;
                }}
            />
        </div>
        {#if body.jewel_type === 'Militant Faith'}
        <div>
            <span>Minimum Matching Devotion Modifiers</span>
            <Select.Root 
                selected={minMatchingMFMods}
                onSelectedChange={(v) => {
                    v && (minMatchingMFMods = v.value) && (applyFilters(matchGeneral, v.value))
                }}>
                <Select.Trigger>
                    {minMatchingMFMods}
                </Select.Trigger>
                <Select.Content>
                    <Select.Item value=0>0</Select.Item>
                    <Select.Item value=1>1</Select.Item>
                    <Select.Item value=2>2</Select.Item>
                </Select.Content>
            </Select.Root>
        </div>
        {/if}
    </Card.Content>
</Card.Root>

<div class='flex flex-row mt-5'>
<ScrollArea class='h-[800px] w-[300px] rounded-md border'>
    <p>RESULTS</p>
    <Accordion.Root class="">
        {#each Object.entries(displayedResponse) as [key, value]}
        <Accordion.Item value={`item-${key}`}>
            <Accordion.Trigger class='leagueAccordionTrigger my-4' >
                <span>{key} - {value.length}</span>
            </Accordion.Trigger>
            <Accordion.Content class='flex flex-col items-center'>
                {#each value as jewel}
                <div class="">
                    <Button onmouseenter={() => {
                        hoverData = jewel;
                    }}

                    onmouseleave={() => {
                        if (selectedJewel) {
                            hoverData = selectedJewel;

                        } else {
                            hoverData = null;
                        }
                    }}

                    onclick={() => {
                        selectedJewel = jewel;
                    }}
                    class="jewelResultRowButton rounded-none flex justify-between py-10">
                    <div><span>{jewel.character_name}</span></div>
                    <div class='flex flex-col items-end'><p>Level {jewel.character_level}</p><p> {jewel.ascendancy_name}</p></div>    
                        
                    </Button>
                </div>
                {/each}
                
            </Accordion.Content>
        </Accordion.Item>
        {/each}
    </Accordion.Root>
</ScrollArea>



<div>
<Card.Root>
    <Card.Content>
        {#if hoverData}
        <p>{hoverData.character_name}</p>
        <Separator></Separator>
        <JewelDrawing drawData={hoverData?.drawing} w={800} h={800}/>
        {/if}
    </Card.Content>
</Card.Root>

</div>

</div>
