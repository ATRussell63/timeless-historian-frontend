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
    import { onMount } from "svelte";
    import { SvelteToast } from '@zerodevx/svelte-toast';
    import { toast } from '@zerodevx/svelte-toast';
    import TemplarSymbol from '$lib/images/TemplarSymbol.svg'

    let backgroundStyle = `background-size: 150% 150%; background-position: bottom 70% right 60%; background-image: url(${TemplarSymbol});`
    let text_input = $state('');
    let jewel_type = $derived(p.parse_jewel_type(text_input));
    let general = $derived(p.parse_jewel_general(text_input));
    let seed = $derived(p.parse_jewel_seed(text_input));
    let mf_mods = $derived(p.parse_jewel_mf_mods(text_input));

    let loading = $state(false);
    let error = $state(null);

    function allFieldsGood() {
        let fields = [jewel_type, general, seed]
        let good = fields.reduce((accumulator, current) => accumulator && current && current !== '', true)

        if (jewel_type === 'Militant Faith') {
            good = good && mf_mods && mf_mods[0] !== '' && mf_mods[1] !== ''
        }

        return good
    }

    onMount(() => {
        text_input = `Item Class: Jewels
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
Place into an allocated Jewel Socket on the Passive Skill Tree. Right click to remove from the Socket.`
    })

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
                body: JSON.stringify(request_body)
            });

            const data = { body: request_body, response: await response.json() };
            search_result.set(data);
            // console.log(data)
            if (response.ok && Object.keys(data.response[0].results).length > 0) {
                goto('/search/results');
            } else {
                console.log('pushing smoke')
                // display an error somewhere
                toast.pop()
                toast.push(`<p style='font-family: Roboto-Bold;'>No jewels found</p><p style='font-family: Roboto;'>Search returned 0 results</p>`,
                           {duration: 3000,
                            theme: {
                                '--toastColor': 'black',
                                '--toastBackground': 'white',
                                '--toastBarBackground': 'red',
                                }
                           })
            }

            } catch (err) {
            error = err.message;
            } finally {
            loading = false;
        }
    }

    let toastOptions = {
        theme: {
            '--toastColor': 'black',
            '--toastBackground': 'white',
            '--toastBarBackground': 'grey',
        }
    }
</script>

<!-- TODO - put a banner image demonstrating the hover over a jewel? -->
<div class='flex flex-col h-full min-w-[1400px] px-10 py-10' style={backgroundStyle}>
<span class='searchPageTitle mb-4'>Search</span>
<div class='flex flex-row mt-2'>
<div class='mr-10 flex-1'>
<Card.Root class='transparentBackground'>
    <Card.Header>
        <Card.Title class='cardTitle'>Hover your jewel in-game and press Ctrl+C to copy it, then paste into the field below</Card.Title>
    </Card.Header>
    <Card.Content>
        <Textarea class='h-[300px]' placeholder='Ctrl + V to paste here' bind:value={text_input}></Textarea>
    </Card.Content>
</Card.Root>
</div>
<div class='basis-2/5'>
<Card.Root class='transparentBackground'>
    <Card.Header>
        <Card.Title class='cardTitle'>Search Params</Card.Title>
    </Card.Header>
    <Card.Content>
        <div class='flex flex-row justify-between'>
            <span class='searchParamLabel'>Jewel Type: </span>
            <span class='searchParam'>{jewel_type}</span>
        </div>
        <div class='flex flex-row mt-2 justify-between'>
            <span class='searchParamLabel'>General: </span>
            <span class='searchParam'>{general}</span>
        </div>
        <div class='flex flex-row mt-2 justify-between'>
            <span class='searchParamLabel'>Seed: </span>
            <span class='searchParam'>{seed}</span>
        </div>
        {#if jewel_type === 'Militant Faith'}
        <div class='flex flex-row mt-2 justify-between'>
            <div>
                <span class='searchParamLabel'>Devotion Mods: </span>
            </div>
            <div>
                <p class='searchParam text-right'>{mf_mods[0]}</p>
                <p class='searchParam text-right'>{mf_mods[1]}</p>
            </div>
        </div>
        {/if}
    </Card.Content>
</Card.Root>
</div>
</div>

<div class='flex mt-5'>
<Button class='basis-1/3 h-12' variant='secondary'
    on:click={() => {
        text_input = ''
    }}
    >
    <span class='searchButton'>Clear</span>
</Button>
<Button
    disabled={!allFieldsGood()}
    class='flex-1 ml-5 h-12'
    on:click={search}>
    <span class='searchButton'>{#if loading}Searching...{:else}Search{/if}</span>
</Button>
</div>
</div>

<SvelteToast {toastOptions}/>

<style>
    .searchPageTitle {
        font-family: Fontin-SmallCaps;
        font-size: 48px;
        margin-left: 5px;
    }
</style>