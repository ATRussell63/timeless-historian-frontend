<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Card from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Textarea } from "$lib/components/ui/textarea";
    import { derived } from "svelte/store";
    import { redirect } from "@sveltejs/kit";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { toast } from "@zerodevx/svelte-toast";
    import { mode } from "mode-watcher";
    import TemplarSymbol from "$lib/images/TemplarSymbol.svg";

    import { searchDBForJewel } from "$lib/api";
    import * as p from "$lib/parse";
    import { search_result, waiting_on_api } from "../../store";

    // clear prior search results
    search_result.set(null);

    let backgroundStyle = `background-size: 150% 150%; background-position: bottom 70% right 60%; background-image: url(${TemplarSymbol});`;
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
</script>

<svelte:head>
    <title>Timeless Historian - Search</title>
</svelte:head>

<div
    class="flex flex-col h-full min-w-[1400px] px-10 py-10"
    style={backgroundStyle}
>
    <span class="searchPageTitle mb-4">Search</span>
    <div class="flex flex-row mt-2">
        <div class="mr-10 flex-1">
            <Card.Root class="transparentBackground">
                <Card.Header>
                    <Card.Title class="cardTitle"
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
            <span class="searchButton">Clear</span>
        </Button>
        <Button
            disabled={!allFieldsGood()}
            class="flex-1 h-12"
            onclick={search}
        >
            <span class="searchButton"
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

<style>
    .searchPageTitle {
        font-family: Fontin-SmallCaps;
        font-size: 48px;
        margin-left: 5px;
    }
</style>
