<script>
    import * as Card from "$lib/components/ui/card";
    import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
    import * as Accordion from "$lib/components/ui/accordion";
    import JewelDrawing from "../../../jewelDrawing.svelte";
    import { Button } from "$lib/components/ui/button/index.js";
    import Separator from "$lib/components/ui/separator/separator.svelte";
    import Switch from "$lib/components/ui/switch/switch.svelte";
    import * as Select from "$lib/components/ui/select";
    import ChevronLeft from "lucide-svelte/icons/chevron-left";
    import ResultChart from "../../../ResultChart.svelte";
    import { ArrowLeft } from "lucide-svelte";
    import JewelDetailsCard from "../../../JewelDetailsCard.svelte";
    import { Badge } from "$lib/components/ui/badge";
    import KaruiSymbol from '$lib/images/KaruiSymbol.svg';
    import { cn } from "$lib/utils";
    import { mode } from 'mode-watcher';

    let backgroundStyle = `background-size: 110% 110%; background-image: url(${KaruiSymbol});`
    let hoverData = $state(null);
    let selectedJewel = $state(null);
    let selectedLeague = $state(null);
    let minMatchingMFMods = $state(0);

    // init switches to preference
    let matchGeneral = $state(localStorage.getItem('matchGeneral') === 'true');
    let hardcoreOnly = $state(localStorage.getItem('matchGeneral') === 'true');

    let { data } = $props();
    const body = data.body;
    const response = data.response.results;
    let displayedResponse = $state($state.snapshot(response));

    let selectedTradeLeague = $state(
        Object.keys(response).find((key) => response[key].is_active),
    );

    // trade site always redirects you to your preferred league but we need an initial value
    if (!selectedTradeLeague) {
        selectedTradeLeague = "Settlers";
    }

    function totalResults(results) {
        let count = 0;
        Object.keys(results).forEach((league) => {
            results[league].jewels.forEach((entry) => {
                count++;
            });
        });
        return count;
    }

    function topAttr(results, attr) {
        let values = {};
        let top = { name: "", count: 0 };
        Object.keys(results).forEach((league) => {
            results[league].jewels.forEach((entry) => {
                if (!Object.keys(values).includes(entry[attr])) {
                    values[entry[attr]] = 1;
                } else {
                    values[entry[attr]]++;
                }

                if (values[entry[attr]] > top.count) {
                    top = { name: entry[attr], count: values[entry[attr]] };
                }
            });
        });

        return top;
    }

    function topLeague(results) {
        let all = {};
        let top = { name: "", count: 0 };
        Object.keys(results).forEach((league) => {
            all[league] = results[league].jewels.length;
            if (all[league] > top.count) {
                top = { name: league, count: all[league] };
            }
        });
        return top;
    }

    function topSocket(results) {
        let all = {};
        let top = { value: {}, count: 0 };
        Object.keys(results).forEach((league) => {
            results[league].jewels.forEach((entry) => {
                if (!Object.keys(all).includes(entry.socket.name)) {
                    all[entry.socket.name] = 1;
                } else {
                    all[entry.socket.name]++;
                }

                if (all[entry.socket.name] > top.count) {
                    top = {
                        value: entry.socket,
                        count: all[entry.socket.name],
                    };
                }
            });
        });

        return top;
    }

    function getSocketCounts(results) {
        let all = {};
        Object.keys(results).forEach((league) => {
            results[league].jewels.forEach((entry) => {
                if (!Object.keys(all).includes(entry.socket.name)) {
                    all[entry.socket.name] = 1;
                } else {
                    all[entry.socket.name]++;
                }
            });
        });
        all = sortObjectByValue(all);
        return all;
    }

    function applyFilters() {
        let results = $state.snapshot(response);

        // league filters
        if (hardcoreOnly === true) {
            results = Object.fromEntries(
                Object.entries(results).filter(
                    ([key, value]) => value.hardcore,
                ),
            );
        }

        // jewel filters
        Object.keys(results).forEach((league) => {
            results[league].jewels = results[league].jewels.filter((jewel) => {
                let mf = jewel.mf_mods_match_count >= minMatchingMFMods;
                let gen = true;
                if (matchGeneral) {
                    gen = jewel.general_match;
                }
                return mf && gen;
            });
        });
        displayedResponse = results;
    }

    function sortObjectByValue(obj) {
        const entries = Object.entries(obj);

        entries.sort(([, valueA], [, valueB]) => valueB - valueA); // Sort in ascending order

        const sortedObject = {};
        for (const [key, value] of entries) {
            sortedObject[key] = value;
        }

        return sortedObject;
    }

    function getAttrCounts(results, attr) {
        let all = {};
        Object.keys(results).forEach((league) => {
            results[league].jewels.forEach((entry) => {
                if (!Object.keys(all).includes(entry[attr])) {
                    all[entry[attr]] = 1;
                } else {
                    all[entry[attr]]++;
                }
            });
        });
        all = sortObjectByValue(all);
        return all;
    }

    function openTradeLink(mode) {
        const league = selectedTradeLeague;
        console.log(`got ${league}, ${mode}`);

        const generalToModIdMap = {
            Asenath: "explicit.pseudo_timeless_jewel_asenath",
            Balbala: "explicit.pseudo_timeless_jewel_balbala",
            Nasima: "explicit.pseudo_timeless_jewel_nasima",
            Cadiro: "explicit.pseudo_timeless_jewel_cadiro",
            Caspiro: "explicit.pseudo_timeless_jewel_caspiro",
            Victario: "explicit.pseudo_timeless_jewel_victario",
            Ahuana: "explicit.pseudo_timeless_jewel_ahuana",
            Doryani: "explicit.pseudo_timeless_jewel_doryani",
            Xibaqua: "explicit.pseudo_timeless_jewel_xibaqua",
            Akoya: "explicit.pseudo_timeless_jewel_akoya",
            Kaom: "explicit.pseudo_timeless_jewel_kaom",
            Rakiata: "explicit.pseudo_timeless_jewel_rakiata",
            Avarius: "explicit.pseudo_timeless_jewel_avarius",
            Dominus: "explicit.pseudo_timeless_jewel_dominus",
            Maxarius: "explicit.pseudo_timeless_jewel_maxarius",
        };

        const typeToGeneralsMap = {
            Brutal_Restraint: ["Asenath", "Balbala", "Nasima"],
            Elegant_Hubris: ["Cadiro", "Caspiro", "Victario"],
            Glorious_Vanity: ["Ahuana", "Doryani", "Xibaqua"],
            Lethal_Pride: ["Akoya", "Kaom", "Rakiata"],
            Militant_Faith: ["Avarius", "Dominus", "Maxarius"],
        };

        let seedFilter = {
            type: "count",
            filters: [
                {
                    value: {
                        min: body.seed,
                        max: body.seed,
                    },
                    id: generalToModIdMap[body.general],
                },
            ],
            value: {
                min: 1,
            },
        };

        if (mode == "seed") {
            seedFilter.filters = typeToGeneralsMap[
                body.jewel_type.replace(" ", "_")
            ].map((general) => {
                return {
                    value: {
                        min: body.seed,
                        max: body.seed,
                    },
                    id: generalToModIdMap[general],
                };
            });
        }

        let queryObj = {
            query: {
                status: {
                    option: "online",
                },
                stats: [seedFilter],
            },
            sort: {
                price: "asc",
            },
        };

        if (body.jewel_type === "Militant Faith" && mode === "exact") {
            // add mf mods to query
            console.log("adding mf mods");
            function devoModMap(devoMod) {
                switch (devoMod) {
                    case "4% increased Totem Damage per 10 Devotion":
                        return "explicit.stat_2566390555";
                    case "4% increased Brand Damage per 10 Devotion":
                        return "explicit.stat_2697019412";
                    case "Channelling Skills deal 4% increased Damage per 10 Devotion":
                        return "explicit.stat_970844066";
                    case "4% increased Area Damage per 10 Devotion":
                        return "explicit.stat_1724614884";
                    case "4% increased Elemental Damage per 10 Devotion":
                        return "explicit.stat_3103189267";
                    case "+2% to all Elemental Resistances per 10 Devotion":
                        return "explicit.stat_1910205563";
                    case "3% increased Effect of non-Damaging Ailments on Enemies per 10 Devotion":
                        return "explicit.stat_1810368194";
                    case "4% reduced Elemental Ailment Duration on you per 10 Devotion":
                        return "explicit.stat_730530528";
                    case "4% reduced Duration of Curses on you per 10 Devotion":
                        return "explicit.stat_4235333770";
                    case "1% increased Minion Attack and Cast Speed per 10 Devotion":
                        return "explicit.stat_3808469650";
                    case "Minions have +60 to Accuracy Rating per 10 Devotion":
                        return "explicit.stat_2830135449";
                    case "Regenerate 0.6 Mana per Second per 10 Devotion":
                        return "explicit.stat_2042813020";
                    case "1% reduced Mana Cost of Skills per 10 Devotion":
                        return "explicit.stat_3293275880";
                    case "1% increased effect of Non-Curse Auras per 10 Devotion":
                        return "explicit.stat_2585926696";
                    case "3% increased Defences from Equipped Shield per 10 Devotion":
                        return "explicit.stat_2803981661";
                    default:
                        throw new Error("Mod was not found in map!");
                }
            }

            const mf_filters = body.mf_mods.map((mod) => {
                let filter = {
                    id: devoModMap(mod),
                };

                return filter;
            });

            const devoFilter = {
                type: "count",
                filters: mf_filters,
                value: {
                    min: 2,
                },
            };

            queryObj.query.stats.push(devoFilter);
        }

        let url =
            "http://www.pathofexile.com/trade/search/" +
            league.replace(" ", "") +
            "/?q=" +
            encodeURIComponent(JSON.stringify(queryObj));
        console.log(JSON.stringify(queryObj));
        window.open(url, "_blank");
    }

    function numMatchingDevoMods(minDevoCount) {
        let count = 0;
        Object.keys(response).forEach((league) => {
            response[league].jewels.forEach((jewel) => {
                if (jewel.mf_mods_match_count >= minDevoCount) {
                    count++;
                }
            });
        });
        return count;
    }

    function numExactMatch() {
        let count = 0;
        Object.keys(response).forEach((league) => {
            response[league].jewels.forEach((jewel) => {
                if (jewel.mf_mods_match_count == 2 && jewel.general_match) {
                    count++;
                }
            });
        });
        return count;
    }
</script>

<div class='mb-2 px-10 py-8 min-w-[1700px]' style={backgroundStyle}>
<!-- Title row -->
<div class="mb-4 flex flex-row items-center justify-between">
    <div class="flex items-center">
        <span class="contentTitle">Results Summary - </span>
        <div class="queryDetail">
            <span class="queryHeaderLabel">Type: </span><span
                class="queryHeader">{body.jewel_type}</span
            >
        </div>
        <div class="queryDetail">
            <span class="queryHeaderLabel">General: </span><span
                class="queryHeader">{body.general}</span
            >
        </div>
        <div class="queryDetail">
            <span class="queryHeaderLabel">Seed: </span><span
                class="queryHeader">{body.seed}</span
            >
        </div>
        {#if body.jewel_type === "Militant Faith"}
            <div class="queryDetail">
                <span class="queryHeaderLabel">Devotion Mods: </span><span
                    class="queryHeader"
                    >{body.mf_mods[0]}, {body.mf_mods[1]}</span
                >
            </div>
        {/if}
    </div>
    <Button class="pl-1 ml-5" variant="ghost" href="/search"
        ><ChevronLeft class="h-5" /><span
            style="text-decoration: underline; font-family: Roboto;"
            >Back to Search</span
        ></Button
    >
</div>

<!-- Results Summary -->
<Card.Root class="transparentBackground">
    <!-- <Card.Header> -->
    <!-- <Card.Title class='cardTitle'>Stats</Card.Title> -->
    <!-- </Card.Header> -->
    <Card.Content class="flex flex-row justify-start">
        <div class="flex flex-col p-3 pr-6">
            <div>
                <p class="resultsSummaryTitle mb-3">Breakdown</p>
                <Card.Root class='mb-4'>
                    <Card.Content>
                <p class="resultsSummaryText mb-4">
                    Total Results: <b>{totalResults(response)}</b>
                </p>
                <div class="ml-5">
                    <p class="resultsSummaryText mb-2">
                        Of the search results:
                    </p>
                    <!-- <p class='resultsSummaryText'>• {totalResults(response)} jewels found had a matching seed</p> -->
                    <div class="flex flex-col gap-1">
                        {#if body.jewel_type === "Militant Faith"}
                            <p class="resultsSummaryText">
                                • &nbsp;<b>{topAttr(response, "general").count}</b>&nbsp; jewels had
                                a matching general
                            </p>
                            <p class="resultsSummaryText">
                                • &nbsp;<b>{numMatchingDevoMods(1)}</b>&nbsp; jewels had at least 1
                                matching devotion modifier
                            </p>
                            <p class="resultsSummaryText">
                                • &nbsp;<b>{numMatchingDevoMods(2)}</b>&nbsp; jewels matched both devotion
                                modifiers
                            </p>
                            <p class="resultsSummaryText">
                                • &nbsp;<b>{numExactMatch()}</b>&nbsp; jewels were an exact match
                            </p>
                        {:else}
                            <p class="resultsSummaryText">
                                • &nbsp;<b>{topAttr(response, "general").count}</b>&nbsp; jewels were
                                an exact match
                            </p>
                        {/if}
                    </div>
                </div>
                    </Card.Content>
                </Card.Root>
            </div>

            <!-- Waste of time but if they ever change the site I guess we can go back to using this -->
            <!-- <Select.Root 
            selected={selectedTradeLeague}
            onSelectedChange={(v) => {
                    selectedTradeLeague = v.value
                }}>
                <Select.Trigger>
                    <Select.Value placeholder="Select a League"></Select.Value>
                </Select.Trigger>
                <Select.Content>
                    {#each Object.entries(response) as [key, value]}
                        {#if value.is_active === true}
                        <Select.Item value={key}>
                            {key}
                        </Select.Item>
                        {/if}
                    {/each}
                </Select.Content>
            </Select.Root> -->
            <div class="mt-auto mb-3">
                <p class="resultsSummaryTitle">
                    Search on the Official Trade Site:
                </p>
            </div>
            <div class="flex flex-row gap-3">
                <Button
                    class="tradeSearch"
                    disabled={!selectedTradeLeague}
                    on:click={() => openTradeLink("seed")}>Any General</Button
                >
                <Button
                    class="tradeSearch"
                    disabled={!selectedTradeLeague}
                    on:click={() => openTradeLink("general")}
                    >Match General</Button
                >
                {#if body.jewel_type === "Militant Faith"}
                    <Button
                        class="tradeSearch"
                        disabled={!selectedTradeLeague}
                        on:click={() => openTradeLink("exact")}
                        >General + Devo Mods</Button
                    >
                {/if}
            </div>
        </div>
        <Separator orientation="vertical" class="mx-auto"></Separator>
        <div class="flex flex-row ml-3 mr-6 gap-6 items-center">
            <ResultChart
                values={Object.values(getAttrCounts(response, "general"))}
                labels={Object.keys(getAttrCounts(response, "general"))}
                theme="legion"
                title={"Top General: " + topAttr(response, "general").name}
            />
            <ResultChart
                values={Object.values(
                    getAttrCounts(response, "ascendancy_name"),
                )}
                labels={Object.keys(getAttrCounts(response, "ascendancy_name"))}
                theme="legion"
                title={"Top Ascendancy: " +
                    topAttr(response, "ascendancy_name").name}
            />
            <ResultChart
                values={Object.values(getSocketCounts(response))}
                labels={Object.keys(getSocketCounts(response))}
                theme="legion"
                title={"Top Socket: " + topSocket(response).value.name}
            />
        </div>
        <!-- <div>
            <p>Total Matches:</p><p>{totalResults(response)}</p>
            <p>
                Top General: <span style={topAttr(response, 'general').name === body.general ? 'color: green;' : 'color: red;'}>{topAttr(response, 'general').name} ({topAttr(response, 'general').count})</span>
            </p>
            <p>Top Ascendancy: <span>{topAttr(response, 'ascendancy_name').name} ({topAttr(response, 'ascendancy_name').count})</span></p>
            <p>Top Socket: <span>{topSocket(response).value.name} ({topSocket(response).count})</span></p>
            <p>Top League: <span>{topLeague(response).name} ({topLeague(response).count})</span></p>
        </div> -->
    </Card.Content>
</Card.Root>

<div class="flex flex-row justify-start mt-5">
    <p class="contentTitle">Results Browser</p>
</div>

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
        <ScrollArea class="h-full rounded-md border mt-5">
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
                                                style="font-size: 18px;"
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
                                                class={cn(selectedJewel === jewel ? 'selectedJewelBadge' : '')}
                                                >Week {jewel.start_week}{jewel.start_week ===
                                                jewel.end_week
                                                    ? ""
                                                    : " - " +
                                                      jewel.end_week}</Badge
                                            >
                                            {#if jewel["vip"] && jewel["vip"] !== ""}
                                                <Badge variant="secondary"
                                                class={cn(selectedJewel === jewel ? 'selectedJewelBadge' : '')}
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
                    <JewelDetailsCard data={hoverData}></JewelDetailsCard>
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
            {:else if Object.keys(response).length > 0}
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
</div>
