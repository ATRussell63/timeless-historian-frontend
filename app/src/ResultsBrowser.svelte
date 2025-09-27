<script>
    import * as Card from "$lib/components/ui/card";
    import { ArrowLeft } from "lucide-svelte";
    import JewelDetailsCard from "./JewelDetailsCard.svelte";
    import JewelDrawing from "./jewelDrawing.svelte";
    import Switch from "$lib/components/ui/switch/switch.svelte";
    import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
    import * as Accordion from "$lib/components/ui/accordion";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Badge } from "$lib/components/ui/badge";
    import Separator from "$lib/components/ui/separator/separator.svelte";
    import { cn } from "$lib/utils";
    import { mode } from 'mode-watcher';

    let { body, results } = $props();

    let hoverData = $state(null);
    let selectedJewel = $state(null);
    let selectedLeague = $state(null);
    let minMatchingMFMods = $state(0);

    // init switches to preference
    let matchGeneral = $state(localStorage.getItem('matchGeneral') === 'true');
    let hardcoreOnly = $state(localStorage.getItem('matchHardcore') === 'true');

    let displayedResponse = $state($state.snapshot(results));

    function applyFilters() {
        let results_snap = $state.snapshot(results);

        // league filters
        if (hardcoreOnly === true) {
            results_snap = Object.fromEntries(
                Object.entries(results_snap).filter(
                    ([key, value]) => value.hardcore,
                ),
            );
        }

        // jewel filters
        Object.keys(results_snap).forEach((league) => {
            results_snap[league].jewels = results_snap[league].jewels.filter((jewel) => {
                let mf = jewel.mf_mods_match_count >= minMatchingMFMods;
                let gen = true;
                if (matchGeneral && body.general !== 'Any') {
                    gen = jewel.general_match;
                }
                return mf && gen;
            });
        });
        displayedResponse = results_snap;
    }
</script>

<div class="flex flex-row mt-5 justify-between h-[1150px]">
    <div class="flex flex-col h-full w-[400px] flex-none">
        <Card.Root class="p-4 transparentBackground">
            <Card.Content class="flex flex-col p-0 gap-4">
                <div class="flex flex-row justify-between items-center">
                    <span class="searchParamLabel mr-4"
                        >Hardcore Leagues Only</span
                    >
                    <Switch
                        bind:checked={hardcoreOnly}
                        onCheckedChange={(v) => {
                            hardcoreOnly = v;
                            localStorage.setItem('matchHardcore', `${v}`)
                            applyFilters();
                        }}
                    />
                </div>
                <div class="flex flex-row justify-between items-center">
                    <span class="searchParamLabel mr-4"
                        >Matching General Only</span
                    >
                    <Switch
                        bind:checked={matchGeneral}
                        onCheckedChange={(v) => {
                            matchGeneral = v;
                            localStorage.setItem('matchGeneral', `${v}`)
                            applyFilters();
                        }}
                    />
                </div>
                {#if body.jewel_type === "Militant Faith"}
                    <div class="flex flex-row justify-between items-center">
                        <span class="searchParamLabel mr-10"
                            >Minimum Matching Devotion Mods</span
                        >
                        <Select.Root
                            selected={minMatchingMFMods}
                            onSelectedChange={(v) => {
                                minMatchingMFMods = v.value;
                                applyFilters();
                            }}
                        >
                            <Select.Trigger
                                class="flex flex-row justify-center w-12"
                            >
                                {minMatchingMFMods}
                            </Select.Trigger>
                            <Select.Content
                                class="flex flex-row justify-center w-12"
                            >
                                <Select.Item value="0">0</Select.Item>
                                <Select.Item value="1">1</Select.Item>
                                <Select.Item value="2">2</Select.Item>
                            </Select.Content>
                        </Select.Root>
                    </div>
                {/if}
            </Card.Content>
        </Card.Root>
        <ScrollArea class="h-full rounded-md border mt-5 transparentBackground">
            <Accordion.Root value={Object.entries(displayedResponse).length === 1 ? `item-${Object.entries(displayedResponse)[0][1].league_id}` : ''}>
                {#each Object.entries(displayedResponse) as [key, value]}
                    <Accordion.Item value={`item-${value.league_id}`}>
                        <Accordion.Trigger 
                            onclick={() => {
                                            selectedLeague = key;
                                        }}
                            class={cn("my-4 " + (selectedLeague === key ? 'selectedLeagueTrigger' : 'unselectedLeagueTrigger'))}>
                            <span
                                style="font-family: Fontin-SmallCaps; font-size: 24px;"
                                >{key} ({value.jewels.length})</span
                            >
                        </Accordion.Trigger>
                        <Accordion.Content class="flex flex-col items-center">
                            {#each value.jewels as jewel}
                                    <Button
                                        variant='outline'
                                        onmouseenter={() => {
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
                                        class={cn("jewelResultRowButton rounded-none flex justify-between py-10 " + (selectedJewel === jewel ? 'selectedJewelButton': ''))}
                                    >
                                        <div
                                            class="flex flex-col items-start gap-2"
                                        >
                                            <span
                                                class="multiLang"
                                                style={cn(jewel.character_name.length >= 19 ? "font-size: 14px;" : "font-size: 18px;")}
                                                >{jewel.character_name}</span
                                            >
                                            <p class="fontin">
                                                Level {jewel.character_level}
                                                {jewel.ascendancy_name}
                                            </p>
                                        </div>
                                        <div
                                            class="flex flex-col items-end gap-2"
                                        >
                                            <Badge variant="secondary"
                                                class={cn(selectedJewel === jewel ? 'selectedJewelBadge' : 'jewelBadge')}
                                                >Week {jewel.start_week}{jewel.start_week ===
                                                jewel.end_week
                                                    ? ""
                                                    : " - " +
                                                      jewel.end_week}</Badge
                                            >
                                            {#if jewel["vip"] && jewel["vip"] !== ""}
                                                <Badge variant="secondary"
                                                class={cn(selectedJewel === jewel ? 'selectedJewelBadge' : 'jewelBadge')}
                                                    >{jewel.vip}</Badge
                                                >
                                            {/if}
                                        </div>
                                    </Button>
                            {/each}
                        </Accordion.Content>
                    </Accordion.Item>
                {/each}
            </Accordion.Root>
        </ScrollArea>
        <!-- </div> -->
    </div>

    <!-- <div class='flex-col flex-auto ml-5 h-full'> -->
    <Card.Root class="flex flex-col grow-7 self-stretch ml-5 h-full transparentBackground">
        <Card.Content class="flex flex-row h-full justify-center p-0">
            {#if hoverData}
                <div
                    class="flex flex-col flex-auto w-full flex items-center justify-end"
                >
                    <div class='w-full h-full my-4'>
                    <JewelDetailsCard data={hoverData} sampleMode={body.seed === 'Any'}></JewelDetailsCard>
                    </div>
                    <Separator class="mb-2"></Separator>
                     <!-- <div class='flex flex-row w-full justify-center' style='background-color: black; border-bottom-right-radius: 10px; border-bottom-left-radius: 10px;'> -->
                      <div class='flex flex-row w-full justify-center' style=''>
                    <JewelDrawing
                        drawData={hoverData?.drawing}
                        w={1050}
                        h={850}
                        mode={mode}
                    />
                     </div>
                </div>
            {:else if Object.keys(results).length > 0}
                <div class="flex flex-row items-center justify-center">
                    <ArrowLeft class="h-12 w-12" /><span
                        class="ml-3"
                        style="font-family: Fontin-SmallCaps; font-size: 60px;"
                        >Select a league to view results</span
                    >
                </div>
            {:else}
                <div class="flex flex-row items-center justify-center">
                    <span
                        class="ml-5"
                        style="font-family: Fontin-SmallCaps; font-size: 60px;"
                        >No Results Found</span
                    >
                </div>
            {/if}
        </Card.Content>
    </Card.Root>
</div>