<script>
    import { get } from "svelte/store";
    import { ArrowLeft, ChevronsUp } from "lucide-svelte";
    import Switch from "$lib/components/ui/switch/switch.svelte";
    import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
    import { ScrollArea as BitsSA } from "bits-ui";
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
    import { search_result, size_breakpoint } from "./store";
    import {
        hoverData,
        selectedJewel,
        selectedLeague,
        clearSelection,
        forceHidden,
    } from "./resultsBrowserStore";
    import { tick } from "svelte";
    import { isMobile } from "$lib/breakpoints";

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

    function scrollToJewelDetails() {
        const jd = document.getElementById('jewelSep')
        jd.scrollIntoView({behavior: 'smooth', block: 'nearest'})
    }

</script>

{#if body && results && !$forceHidden}
    {#if !isMobile($size_breakpoint) && $size_breakpoint !== 'lg'}
        <div
            class={cn(
                `flex flex-row justify-between xl:h-[970px] 2xl:h-[1250px]`,
            )}
        >
            <div class="flex flex-col xl:w-[250px] 2xl:w-[400px] flex-none">
                <Card.Root class="p-4 transparentBackground">
                    <Card.Content class="flex flex-col p-0 gap-4 xl:text-[14px] 2xl:text-[16px]">
                        <div class="flex flex-row justify-between items-center">
                            <span class="searchParamLabel mr-4"
                                >Hardcore Leagues Only</span
                            >
                            <Switch
                                bind:checked={hardcoreOnly}
                                onCheckedChange={(v) => {
                                    hardcoreOnly = v;
                                    clearSelection();
                                    localStorage.setItem(
                                        "matchHardcore",
                                        `${v}`,
                                    );
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
                                    localStorage.setItem(
                                        "matchGeneral",
                                        `${v}`,
                                    );
                                }}
                            />
                        </div>
                        {#if body?.jewel_type === "Militant Faith"}
                            <div
                                class="flex flex-row justify-between items-center"
                            >
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
                                    <span class={cn('fontinSmallCaps 2xl:text-[24px] ' +
                                        (`${key} (${value.jewels.length})`.length > 22 ? 'xl:text-[12px]' : 'xl:text-[18px]'))}
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
                                                    class={cn("multiLang fontin" + (jewel.character_name.length >= 19 ? 'xl:text-[14px] 2xl:text-[16px]' : 'xl:text-[18px] 2xl:text-[20px]'))}
                                                    >{jewel.character_name}</span
                                                >
                                                <p class="fontin xl:text-[14px] 2xl:text-[18px]">
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
                                                        ) ===
                                                            JSON.stringify(
                                                                jewel,
                                                            )
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
                class="flex flex-col grow ml-5 transparentBackground"
            >
                <Card.Content class="flex flex-row justify-center p-0">
                    {#if $hoverData}
                        <div
                            class="flex flex-col flex-auto w-full flex items-center justify-start"
                        >
                            <div class="w-full py-0 my-0">
                                <JewelDetailsCard
                                    sampleMode={body.seed === "Any"}
                                ></JewelDetailsCard>
                            </div>
                            <Separator class="mb-2" id='jewelSep'></Separator>
                            <div
                                class="flex flex-row w-full justify-center mt-6"
                            >
                                <JewelDrawing />
                            </div>
                        </div>
                    {:else if Object.keys(results).length > 0}
                        <div class="flex flex-row items-center justify-center xl:mt-[300px] 2xl:mt-[400px]">
                            <ArrowLeft class="2xl:h-12 2xl:w-12" /><span
                                class="ml-3 fontinSmallCaps xl:text-[30px] 2xl:text-[42px]"
                                >Select a league to view results</span
                            >
                        </div>
                    {:else}
                        <div class="flex flex-row items-center justify-center">
                            <span
                                class="ml-5 fontinSmallCaps xl:text-[30px] 2xl:text-[60px]"
                                >No Results Found</span
                            >
                        </div>
                    {/if}
                </Card.Content>
            </Card.Root>
            <div id="resultsScrollTarget"></div>
        </div>
    {:else}
        <div>
            <div class="flex flex-col">
                <Card.Root class="p-4 transparentBackground lg:max-w-[400px]">
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
                                    localStorage.setItem(
                                        "matchHardcore",
                                        `${v}`,
                                    );
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
                                    localStorage.setItem(
                                        "matchGeneral",
                                        `${v}`,
                                    );
                                }}
                            />
                        </div>
                        {#if body?.jewel_type === "Militant Faith"}
                            <div
                                class="flex flex-row justify-between items-center"
                            >
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
                    class="h-full rounded-md border mt-5 transparentBackground h-[400px] lg:h-[500px]"
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
                                        "my-4 text-center " +
                                            (selectedLeague === key
                                                ? "selectedLeagueTrigger"
                                                : "unselectedLeagueTrigger"),
                                    )}
                                >
                                    <span
                                        class="text-[22px] lg:text-[24px]"
                                        style="font-family: Fontin-SmallCaps"
                                        >{key} ({value.jewels.length})</span
                                    >
                                </Accordion.Trigger>
                                <Accordion.Content
                                    class="flex flex-col items-center"
                                >
                                    {#each value.jewels as jewel}
                                        <Button
                                            variant="outline"
                                            onclick={async () => {
                                                selectedJewel.set(jewel);
                                                hoverData.set(jewel);
                                                await tick();
                                                scrollToJewelDetails();
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
                                                    )}
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
                {#if $hoverData}
                <Card.Root class='mt-6'>
                    <Card.Content>
                        <JewelDetailsCard sampleMode={body.seed === "Any"} />
                        <Separator class="mb-2" id='jewelSep'></Separator>
                         <!-- <div id='jewelDetails'></div> -->
                        <JewelDrawing />
                        
                    </Card.Content>
                </Card.Root>
                {/if}
                <div id="resultsScrollTarget"></div>
            </div>
        </div>
    {/if}
{/if}
