<script>
    import { search_result } from "../../../store";
    import * as Card from '$lib/components/ui/card';
    import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
    import * as Accordion from '$lib/components/ui/accordion';
    import JewelDrawing from "../../../jewelDrawing.svelte";
    import { Button } from '$lib/components/ui/button/index.js';
    import Separator from "$lib/components/ui/separator/separator.svelte";

    let hoverData = $state(null);
    let selectedJewel = $state(null);

    let { body, response } = $search_result;
    response = response[0].results;
    // console.log(body);

    function totalResults(results) {
        // console.log(results)
        let count = 0;
        Object.keys(results).forEach(league => {
            // console.log(league)
            // console.log(results[league])
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

    // console.log(data);
</script>
<h1 class='my-5 ml-2' style='font-size: 28px;'>Results Summary</h1>
<Card.Root>
    <!-- <Card.Header>
        <Card.Title></Card.Title>
    </Card.Header> -->
    <Card.Content class='flex flex-row justify-between'>
        <div style='width: 50%;' class=''>
            <h1>Query for:</h1>
            <p>Type: {body.jewel_type}</p>
            <p>General: {body.general}</p>
            <p>Seed: {body.seed}</p>
            {#if body.jewel_type === 'Militant Faith'}
            <p>Additional Mods: {body.mf_mods[0]}</p>
            <p>{body.mf_mods[1]}</p>
            {/if}
        </div>
        <Separator orientation='vertical' class=''/>
        <div style='width: 50%;' class='pl-5'>
            <h1>Stats</h1>
            <p>Total Matches:</p><p>{totalResults(response)}</p>
            <p>
                Top General: <span style={topAttr(response, 'general').name === body.general ? 'color: green;' : 'color: red;'}>{topAttr(response, 'general').name} ({topAttr(response, 'general').count})</span>
            </p>
            <p>Top Ascendancy: <span>{topAttr(response, 'class_name').name} ({topAttr(response, 'class_name').count})</span></p>
        </div>
    </Card.Content>
</Card.Root>

<Card.Root class='mt-5'>
    <Card.Title>
        Filters
    </Card.Title>
    <Card.Content>

    </Card.Content>
</Card.Root>

<div class='flex flex-row mt-5'>
<ScrollArea class='h-[800px] w-[300px] rounded-md border'>
    <p>RESULTS</p>
    <Accordion.Root class="">
        {#each Object.entries(response) as [key, value]}
        <Accordion.Item value={`item-${key}`}>
            <Accordion.Trigger class='leagueAccordionTrigger my-4' >
                <span>{key} - {value.length}</span>
            </Accordion.Trigger>
            <Accordion.Content class='flex flex-col items-center'>
                {#each value as jewel}
                <div class="">
                    <Button onmouseenter={() => {
                        hoverData = jewel;

                        // console.log(hoverData?.character_name)
                    }}

                    onmouseleave={() => {
                        if (selectedJewel) {
                            hoverData = selectedJewel;

                        } else {
                            hoverData = null;
                        }
                        // console.log(hoverData?.character_name)
                    }}

                    onclick={() => {
                        selectedJewel = jewel;
                        // console.log(hoverData?.character_name)
                    }}
                    class="jewelResultRowButton rounded-none flex justify-between py-10">
                    <div><span>{jewel.character_name}</span></div>
                    <div class='flex flex-col items-end'><p>Level {jewel.character_level}</p><p> {jewel.class_name}</p></div>    
                        
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

<!-- 

More for results summary



- most common jewel slot
- 

-->