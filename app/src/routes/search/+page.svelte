<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Card from "$lib/components/ui/card";
    import * as Select from "$lib/components/ui/select";
    import { Input } from "$lib/components/ui/input";
    import Label from "$lib/components/ui/label/label.svelte";
    import { Textarea } from "$lib/components/ui/textarea";
    import { derived } from "svelte/store";
    import { redirect } from "@sveltejs/kit";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { mode } from "mode-watcher";
    import { size_breakpoint } from "../../store";
    import { isMobile } from "$lib/breakpoints";
    import TemplarSymbol from "$lib/images/TemplarSymbol.svg";

    import { MF_MOD_ABBREVIATIONS } from "../../drawingConstants";
    import { searchDBForJewel } from "$lib/api";
    import * as p from "$lib/parse";
    import { search_result, waiting_on_api } from "../../store";

    // clear prior search results
    search_result.set(null);

    let backgroundStyle = $derived.by(() => {
        const bg_size = isMobile($size_breakpoint) ? '700px 700px' : '140% 140%';
        const bg_position = isMobile($size_breakpoint) ? 'top 20% right 50%' : 'bottom 50% right 50%';
        return `background-repeat: no-repeat; background-size: ${bg_size}; background-position: ${bg_position}; background-image: url(${TemplarSymbol});`
    });

    // let backgroundStyle = `background-size: 150% 150%; background-position: bottom 70% right 60%; background-image: url(${TemplarSymbol});`;
    let text_input = $state("");
    let jewel_type = $derived(p.parse_jewel_type(text_input));
    let general = $derived(p.parse_jewel_general(text_input));
    let seed = $derived(p.parse_jewel_seed(text_input));
    let mf_mods = $derived(p.parse_jewel_mf_mods(text_input));

    let error = $state(null);

    function allFieldsGood() {
        let fields = [jewel_type, general, seed];
        let good = fields.reduce(
            (accumulator, current) => accumulator && current && current !== "",
            true,
        );

        if (jewel_type === "Militant Faith") {
            good = good && mf_mods && mf_mods[0] !== "" && mf_mods[1] !== "";
        }

        return good;
    }

    async function search() {
        const jewel = {
            jewel_type: jewel_type,
            seed: seed,
            general: general,
            mf_mods: mf_mods,
        };
        searchDBForJewel(jewel).then((okToRedirect) => {
            if (okToRedirect) {
                goto("/search/results");
            }
        });
    }

    async function sample() {
        searchDBForJewel({}, true).then((okToRedirect) => {
            if (okToRedirect) {
                goto("/search/results");
            }
        });
    }


    let mobJewelType = $state(null);
    let mobSeed = $state('');
    let mobGeneral = $state(null);
    let mobMF = $state([]);
    let oldestMF = '';
    let mfSelectOpen = $state(false);

    const typeToGeneralsMap = new Map([
        ['Brutal Restraint', ["Asenath", "Balbala", "Nasima"]],
        ['Elegant Hubris', ["Cadiro", "Caspiro", "Victario"]],
        ['Glorious Vanity', ["Ahuana", "Doryani", "Xibaqua"]],
        ['Lethal Pride', ["Akoya", "Kaom", "Rakiata"]],
        ['Militant Faith', ["Avarius", "Dominus", "Maxarius"]],
    ]);

    const typeToSeedRangeMap = new Map([
        ['Brutal Restraint', [500, 8000]],
        ['Elegant Hubris', [2000, 160000]],
        ['Glorious Vanity', [100, 8000]],
        ['Lethal Pride', [10000, 18000]],
        ['Militant Faith', [2000, 10000]],
    ]);

    let selGenerals = $state([]);

    function jewelSeedInvalid() {
        const seed = parseInt(mobSeed)

        if (!mobJewelType || !seed) {
            return false
        }
        
        const low = typeToSeedRangeMap.get(mobJewelType)[0]
        const high = typeToSeedRangeMap.get(mobJewelType)[1]

        if (seed >= low && seed <= high) {
            return false
        }

        return true
    }

    function clearFields() {
        mobJewelType = null
        mobSeed = ''
        mobGeneral = null
        oldestMF = ''
        mobMF = []
        mfSelectOpen = false
    }

    function updateSelectedMFMods(newVal) {
        if (!Array.isArray(newVal)) {
            mobMF.push(newVal)
            return
        }

        if (newVal.length <= 2) {
            mobMF = newVal

            if (newVal.length == 2) {
                mfSelectOpen = false
            }
            return
        }

        mobMF = [newVal.pop(), newVal.pop()]
        mfSelectOpen = false
    }

    function formatMFTrigger() {
        let retVal = ''
        if (Array.isArray(mobMF)) {
            retVal = mobMF[0]
            if (mobMF.length > 1) {
                retVal += ','
            }
        } else {
            retVal = mobMF
        }
        return retVal
    }

    function mobFieldsValid() {
        if (mobJewelType === 'Militant Faith' && mobMF.length < 2) {
            return false
        }

        // console.log(mobJewelType !== '')
        return mobSeed && !jewelSeedInvalid() && mobJewelType && mobGeneral
    }

    async function mobSubmit() {

        // invert the MF mod map
        const invertedMFMap = new Map([...MF_MOD_ABBREVIATIONS].map(([k, v]) => [v, k]))

        let mobMFFullText = []
        if (mobMF.length == 2) {
            mobMFFullText = [invertedMFMap.get(mobMF[0]), invertedMFMap.get(mobMF[1])]
        }

        const jewel = {
            jewel_type: mobJewelType,
            seed: parseInt(mobSeed),
            general: mobGeneral,
            mf_mods: mobMFFullText
        };

        searchDBForJewel(jewel).then((okToRedirect) => {
            if (okToRedirect) {
                goto("/search/results");
            }
        });
    }
</script>

<svelte:head>
    <title>Timeless Historian - Search</title>
</svelte:head>


    {#if !isMobile($size_breakpoint)}
    <div
    class="flex flex-col h-full lg:min-w-[830px] xl:min-w-[900px] px-10 py-10"
    style={backgroundStyle}
>
    <span class="searchPageTitle mb-4">Search</span>
    <div class="flex flex-row mt-2">
        <div class="mr-10 flex-1">
            <Card.Root class="transparentBackground">
                <Card.Header>
                    <Card.Title class="cardTitle leading-7"
                        >Hover your jewel in-game and press Ctrl+C to copy it,
                        then paste into the field below</Card.Title
                    >
                </Card.Header>
                <Card.Content>
                    <Textarea
                        class="h-[300px]"
                        placeholder="Ctrl + V to paste here"
                        bind:value={text_input}
                    ></Textarea>
                </Card.Content>
            </Card.Root>
        </div>
        <div class="basis-2/5">
            <Card.Root class="transparentBackground">
                <Card.Header>
                    <Card.Title class="cardTitle">Search Params</Card.Title>
                </Card.Header>
                <Card.Content>
                    <div class="flex flex-row justify-between">
                        <span class="searchParamLabel">Jewel Type: </span>
                        <span class="searchParam">{jewel_type}</span>
                    </div>
                    <div class="flex flex-row mt-2 justify-between">
                        <span class="searchParamLabel">General: </span>
                        <span class="searchParam">{general}</span>
                    </div>
                    <div class="flex flex-row mt-2 justify-between">
                        <span class="searchParamLabel">Seed: </span>
                        <span class="searchParam">{seed}</span>
                    </div>
                    {#if jewel_type === "Militant Faith"}
                        <div class="flex flex-row mt-2 justify-between">
                            <div>
                                <span class="searchParamLabel"
                                    >Devotion Mods:
                                </span>
                            </div>
                            <div>
                                <p class="searchParam text-right">
                                    {mf_mods[0]}
                                </p>
                                <p class="searchParam text-right">
                                    {mf_mods[1]}
                                </p>
                            </div>
                        </div>
                    {/if}
                </Card.Content>
            </Card.Root>
        </div>
    </div>
    <div class="flex flex-row mt-10 gap-10">
        <Button
            class="basis-1/3 h-12 transparentBackground"
            variant="outline"
            onclick={() => {
                text_input = "";
            }}
        >
            <span class="searchButton text-[28px]">Clear</span>
        </Button>
        <Button
            disabled={!allFieldsGood()}
            class="flex-1 h-12"
            onclick={search}
        >
            <span class="searchButton text-[28px]"
                >{#if $waiting_on_api}Searching...{:else}Search{/if}</span
            >
        </Button>
    </div>
    <div class="flex flex-row mt-10 justify-center">
        <Card.Root>
            <Card.Content class="py-0 m-0">
                <div class="flex flex-row items-center">
                    <p style="font-size: 14px;">
                        Don't have a jewel or just want to see some data?
                    </p>
                    <Button
                        variant="link"
                        class="p-0 ml-2"
                        style="font-size: 14px;"
                        onclick={sample}
                        ><b>Click here for a random sample</b></Button
                    >
                </div>
            </Card.Content>
        </Card.Root>
    </div>
    </div>
    {:else}
    <div
    class="flex flex-row h-full px-10 py-10 justify-center"
    style={backgroundStyle}
>
    <div class='flex-col grow max-w-[400px]'>
        <Card.Root class="transparentBackground">
                <Card.Content class='flex flex-col gap-2'>
                    <Select.Root 
                    type='single'
                    value={mobJewelType}
                    onValueChange={(v) => {
                                mobJewelType = v;
                                mobGeneral = null;
                                selGenerals = typeToGeneralsMap.get(v);
                            }}>
                        <Select.Trigger class='w-full'>
                            {mobJewelType ?? 'Select Jewel Type'}
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Item value='Brutal Restraint'>Brutal Restraint</Select.Item>
                            <Select.Item value='Elegant Hubris'>Elegant Hubris</Select.Item>
                            <Select.Item value='Glorious Vanity'>Glorious Vanity</Select.Item>
                            <Select.Item value='Lethal Pride'>Lethal Pride</Select.Item>
                            <Select.Item value='Militant Faith'>Militant Faith</Select.Item>
                        </Select.Content>
                    </Select.Root>
                    <Input bind:value={mobSeed} disabled={mobJewelType === null} aria-invalid={jewelSeedInvalid() ? 'true' : 'false'} placeholder='Jewel Seed #'></Input>
                    <Select.Root 
                    type='single'
                    value={mobGeneral}
                    disabled={!mobJewelType}
                    onValueChange={(v) => {
                                mobGeneral = v;
                            }}>
                        <Select.Trigger class='w-full'>
                            {mobGeneral ?? 'Select a General'}
                        </Select.Trigger>
                        <Select.Content>
                            {#each selGenerals as general}
                            <Select.Item value={general}>{general}</Select.Item>
                            {/each}
                        </Select.Content>
                    </Select.Root>
                    {#if mobJewelType === 'Militant Faith'}
                    <Select.Root 
                    type='multiple'
                    value={mobMF}
                    bind:open={mfSelectOpen}
                    disabled={!mobJewelType}
                    onValueChange={(v) => {
                                updateSelectedMFMods(v)
                            }}>
                        <Select.Trigger class='w-full min-h-16 overflow-visible'>
                            <div class='flex flex-col'>
                            <p>
                            {mobMF.length !== 0 ? formatMFTrigger() : 'Select Devotion Mods'}</p>
                            {#if Array.isArray(mobMF) && mobMF.length == 2}
                            <p>{mobMF[1]}</p>
                            {/if}
                            </div>
                        </Select.Trigger>
                        <Select.Content>
                            {#each MF_MOD_ABBREVIATIONS as [full_text, abbrev]}
                            <Select.Item value={abbrev}>{abbrev}</Select.Item>
                            {/each}
                        </Select.Content>
                    </Select.Root>
                    {/if}
                </Card.Content>
            </Card.Root>
            <Button class='w-full mt-4' variant='outline' onclick={clearFields}><span class="searchButton text-[20px]">Clear</span></Button>
            <Button class='w-full mt-4' disabled={!mobFieldsValid()} onclick={mobSubmit}><span class="searchButton text-[20px]">Search</span></Button>
            <div class="flex flex-row mt-8 justify-center">
                <Card.Root class='bg-background'>
                    <Card.Content class="pt-0 pb-1 m-0">
                        <div class="flex flex-row items-center">
                            <p style="font-size: 14px;">
                                No jewels?
                            </p>
                            <Button
                                variant="link"
                                class="p-0 ml-4"
                                style="font-size: 14px;"
                                onclick={sample}
                                ><b class='underline'>Get some sample data</b></Button
                            >
                        </div>
                    </Card.Content>
                </Card.Root>
            </div>
    </div>
    </div>
    {/if}

<style>
    .searchPageTitle {
        font-family: Fontin-SmallCaps;
        font-size: 48px;
        margin-left: 5px;
    }
</style>
