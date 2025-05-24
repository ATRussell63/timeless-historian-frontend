<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Card from '$lib/components/ui/card';
    import { Input } from "$lib/components/ui/input";
    import * as p from '$lib/parse';
    import { Textarea } from "$lib/components/ui/textarea";
    import { derived } from "svelte/store";
    import { search_result } from "../../store";
    import { redirect } from "@sveltejs/kit";
    import { goto } from "$app/navigation";


    let text_input = $state('');
    let jewel_type = $derived(p.parse_jewel_type(text_input));
    let general = $derived(p.parse_jewel_general(text_input));
    let seed = $derived(p.parse_jewel_seed(text_input));
    let mf_mods = $derived(p.parse_jewel_mf_mods(text_input));


    // let result = $state(null);
    let loading = $state(false);
    let error = $state(null);

    

    // 2. Function to make the POST request
    async function search() {
        loading = true;
        error = null;

        try {
            const request_body = {
                    "jewel_type": jewel_type,
                    "seed": seed,
                    "general": general,
                    "mf_mods": mf_mods
                }
            // console.log(request_body)
            const response = await fetch('http://localhost:5000/test', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                // body: JSON.stringify({ query: $query })
                body: JSON.stringify(request_body)
            });

            // if (!response.ok) {
            //     throw new Error(`Server error: ${response.status}`);
            // }

            const data = { body: request_body, response: await response.json() };
            // console.log(data);
            search_result.set(data);
            goto('/search/results');
            } catch (err) {
            error = err.message;
            } finally {
            loading = false;
        }
    }
</script>

<Card.Root>
    <Card.Header>
        <Card.Title>Title</Card.Title>
    </Card.Header>
    <Card.Content>
        <Textarea placeholder='placeholder' bind:value={text_input}>Item Class: Jewels
Rarity: Unique
Militant Faith
Timeless Jewel
--------
Limited to: 1 Historic
Radius: Large
--------
Item Level: 84
--------
Carved to glorify 12345 new faithful converted by High Templar Dominus
Passives in radius are Conquered by the Templars
+2% to all Elemental Resistances per 10 Devotion
1% reduced Mana Cost of Skills per 10 Devotion
Historic
--------
They believed themselves the utmost faithful, but that conviction became oppression.
--------
Place into an allocated Jewel Socket on the Passive Skill Tree. Right click to remove from the Socket.     
        </Textarea>
    </Card.Content>
</Card.Root>

<Card.Root>
    <Card.Header>
        <Card.Title>Search Params</Card.Title>
    </Card.Header>
    <Card.Content>
        <p>Jewel Type: </p>
        <p>{jewel_type}</p>
        <p>General: </p>
        <p>{general}</p>
        <p>Seed: </p>
        <p>{seed}</p>
        {#if jewel_type === 'Militant Faith'}
        <p>MF Mods:</p>
        <p>{mf_mods.join(', ')}</p>
        {/if}
    </Card.Content>
</Card.Root>

<Button>
    Clear
</Button>
<Button 
    class='SearchButton'
    on:click={search}>
    {#if loading}Searching...{:else}Search{/if}
</Button>

<!--  -->