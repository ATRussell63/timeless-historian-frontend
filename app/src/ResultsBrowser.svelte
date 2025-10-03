<script>
    import { get } from "svelte/store";
    import { ArrowLeft } from "lucide-svelte";
    import Switch from "$lib/components/ui/switch/switch.svelte";
    import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
    import * as Card from "$lib/components/ui/card";
    import * as Accordion from "$lib/components/ui/accordion";
    import * as Select from "$lib/components/ui/select";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Badge } from "$lib/components/ui/badge";
    import Separator from "$lib/components/ui/separator/separator.svelte";
    import { mode } from "mode-watcher";
    import { cn } from "$lib/utils";
    
    import JewelDetailsCard from "./JewelDetailsCard.svelte";
    import JewelDrawing from "./jewelDrawing.svelte";
    import { search_result } from "./store";
    import {
        hoverData,
        selectedJewel,
        selectedLeague,
        clearSelection,
        forceHidden,
    } from "./resultsBrowserStore";

    const { totalW } = $props();

    let minMatchingMFMods = $state(0);

    const body = $derived.by(() => {
        if ($search_result?.body) {
            return $search_result.body;
        }
        return null;
    });
    const results = $derived.by(() => {
        if ($search_result?.response) {
            return $search_result.response.results;
        }
        return null;
    });

    // init switches to preference
    let matchGeneral = $state(localStorage.getItem("matchGeneral") === "true");
    let hardcoreOnly = $state(localStorage.getItem("matchHardcore") === "true");

    function filterJewel(jewel) {
        if (matchGeneral && jewel.general !== matchGeneral) {
            return false;
        }
        if (
            minMatchingMFMods > 0 &&
            (jewel.mf_mods_match_count ?? 0) < minMatchingMFMods
        ) {
            return false;
        }
        return true;
    }

    let displayedResults = $derived.by(() => {
        if (results) {
            // first filter out leagues if hardcore only is toggled
            const visibleLeagues = {
                ...Object.fromEntries(
                    Object.entries(results).filter(([key, value]) => {
                        if (hardcoreOnly) {
                            return value.hardcore;
                        } else {
                            return true;
                        }
                    }),
                ),
            };

            if (visibleLeagues === {}) {
                return {};
            }

            // filter each league's jewels based on other filter criteria
            return Object.fromEntries(
                Object.entries(visibleLeagues).map(([key, value]) => [
                    key,
                    {
                        ...value,
                        jewels: value.jewels.filter(filterJewel),
                    },
                ]),
            );
        }
        return {};
    });
</script>

{#if body && results && !$forceHidden}
    <div
        class={cn(
            `flex flex-row mt-5 justify-between h-[1150px] w-[${totalW}px]`,
        )}
    >
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
                                clearSelection();
                                localStorage.setItem("matchHardcore", `${v}`);
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
                                clearSelection();
                                localStorage.setItem("matchGeneral", `${v}`);
                            }}
                        />
                    </div>
                    {#if body?.jewel_type === "Militant Faith"}
                        <div class="flex flex-row justify-between items-center">
                            <span class="searchParamLabel mr-10"
                                >Minimum Matching Devotion Mods</span
                            >
                            <Select.Root
                                type="single"
                                value={minMatchingMFMods}
                                onValueChange={(v) => {
                                    minMatchingMFMods = v;
                                    clearSelection();
                                }}
                            >
                                <Select.Trigger
                                    class="flex flex-row justify-center"
                                >
                                    {minMatchingMFMods}
                                </Select.Trigger>
                                <Select.Content
                                    class="flex flex-row justify-center"
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
            <ScrollArea
                class="h-full rounded-md border mt-5 transparentBackground"
            >
                <Accordion.Root
                    type="multiple"
                    value={Object.entries(displayedResults).length === 1
                        ? `item-${Object.entries(displayedResults)[0][1].league_id}`
                        : ""}
                >
                    {#each Object.entries(displayedResults) as [key, value]}
                        <Accordion.Item value={`item-${value.league_id}`}>
                            <Accordion.Trigger
                                onclick={() => {
                                    selectedLeague.set(key);
                                }}
                                class={cn(
                                    "my-4 " +
                                        (selectedLeague === key
                                            ? "selectedLeagueTrigger"
                                            : "unselectedLeagueTrigger"),
                                )}
                            >
                                <span
                                    style="font-family: Fontin-SmallCaps; font-size: 24px;"
                                    >{key} ({value.jewels.length})</span
                                >
                            </Accordion.Trigger>
                            <Accordion.Content
                                class="flex flex-col items-center"
                            >
                                {#each value.jewels as jewel}
                                    <Button
                                        variant="outline"
                                        onmouseenter={() => {
                                            hoverData.set(
                                                $state.snapshot(jewel),
                                            );
                                        }}
                                        onmouseleave={() => {
                                            if ($selectedJewel) {
                                                hoverData.set(
                                                    structuredClone(
                                                        get(selectedJewel),
                                                    ),
                                                );
                                            } else {
                                                hoverData.set(null);
                                            }
                                        }}
                                        onclick={() => {
                                            selectedJewel.set(jewel);
                                        }}
                                        class={cn(
                                            "jewelResultRowButton rounded-none flex justify-between py-10 " +
                                                (JSON.stringify(
                                                    $selectedJewel,
                                                ) === JSON.stringify(jewel)
                                                    ? "selectedJewelButton"
                                                    : ""),
                                        )}
                                    >
                                        <div
                                            class="flex flex-col items-start gap-2"
                                        >
                                            <span
                                                class="multiLang"
                                                style={cn(
                                                    jewel.character_name
                                                        .length >= 19
                                                        ? "font-size: 14px;"
                                                        : "font-size: 18px;",
                                                )}>{jewel.character_name}</span
                                            >
                                            <p class="fontin">
                                                Level {jewel.character_level}
                                                {jewel.ascendancy_name}
                                            </p>
                                        </div>
                                        <div
                                            class="flex flex-col items-end gap-2"
                                        >
                                            <Badge
                                                variant="secondary"
                                                class={cn(
                                                    JSON.stringify(
                                                        $selectedJewel,
                                                    ) === JSON.stringify(jewel)
                                                        ? "selectedJewelBadge"
                                                        : "jewelBadge",
                                                )}
                                                >Week {jewel.start_week}{jewel.start_week ===
                                                jewel.end_week
                                                    ? ""
                                                    : " - " +
                                                      jewel.end_week}</Badge
                                            >
                                            {#if jewel["vip"] && jewel["vip"] !== ""}
                                                <Badge
                                                    variant="secondary"
                                                    class={cn(
                                                        JSON.stringify(
                                                            $selectedJewel,
                                                        ) ===
                                                            JSON.stringify(
                                                                jewel,
                                                            )
                                                            ? "selectedJewelBadge"
                                                            : "jewelBadge",
                                                    )}>{jewel.vip}</Badge
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
        </div>

        <Card.Root
            class="flex flex-col grow-7 self-stretch ml-5 h-full transparentBackground"
        >
            <Card.Content class="flex flex-row h-full justify-center p-0">
                {#if $hoverData}
                    <div
                        class="flex flex-col flex-auto w-full flex items-center justify-end"
                    >
                        <div class="w-full h-full my-4">
                            <JewelDetailsCard sampleMode={body.seed === "Any"}
                            ></JewelDetailsCard>
                        </div>
                        <Separator class="mb-2"></Separator>
                        <div
                            class="flex flex-row w-full justify-center"
                            style=""
                        >
                            <JewelDrawing w={1050} h={850} {mode} />
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
        <div id="resultsScrollTarget"></div>
    </div>
{:else}
    <div class={cn(`w-[${totalW}px]`)}></div>
{/if}
