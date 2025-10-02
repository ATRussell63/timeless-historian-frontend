<script>
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button/index.js";
    import Separator from "$lib/components/ui/separator/separator.svelte";    
    import * as Select from "$lib/components/ui/select";
    import ChevronLeft from "lucide-svelte/icons/chevron-left";
    import ResultChart from "../../../ResultChart.svelte";
    import KaruiSymbol from '$lib/images/KaruiSymbol.svg';
    import { cn } from "$lib/utils";
    import { mode } from 'mode-watcher';
    import ResultsBrowser from "../../../ResultsBrowser.svelte";
    import { forceHidden, clearSelection } from "../../../resultsBrowserStore";

    let backgroundStyle = `background-size: 110% 110%; background-image: url(${KaruiSymbol});`

    let { data } = $props();
    // reset force flag if it was set by bulk search
    clearSelection();
    forceHidden.set(false);
    console.log('data')
    console.log(data)
    const body = data.body;
    const response = data.response.results;

    let selectedTradeLeague = $state(
        Object.keys(response).find((key) => response[key].is_active),
    );

    // trade site always redirects you to your preferred league but we need an initial value
    if (!selectedTradeLeague) {
        // TODO - this doesn't matter, right?
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
        // console.log(`got ${league}, ${mode}`);

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
            // console.log("adding mf mods");
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
        // console.log(JSON.stringify(queryObj));
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

<svelte:head>
    <title>
        Timeless Historian - Search Results
    </title>
</svelte:head>

<div class='mb-2 px-10 py-8 min-w-[1700px]' style={backgroundStyle}>
<!-- Title row -->
<div class="mb-4 flex flex-row items-center justify-between">
    <div class="flex items-center">
        <span class="contentTitle">Results Summary - </span>
        <div class='flex flex-row gap-2 items-center'>
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
            <!-- TODO - I think I like the two bullet points better but I'm keeping the old version here for now -->
             <!-- if mf mods is very long split it into two rows -->
            {#if body.mf_mods[0].length + body.mf_mods[1].length > 10}
            <div class='queryDetail'>
                <span class="queryHeaderLabel">Devotion Mods: </span>
            </div>
            <div class='flex flex-col'>
                <span
                    class="queryHeader"
                    >&#9679 {body.mf_mods[0]}</span
                >
                <span
                    class="queryHeader"
                    >&#9679 {body.mf_mods[1]}</span
                >
            </div>
            {:else}
            <div class="queryDetail">
                <span class="queryHeaderLabel">Devotion Mods: </span><span
                    class="queryHeader"
                    >{body.mf_mods[0]}, {body.mf_mods[1]}</span
                >
            </div>
            {/if}
        {/if}
    </div>
    </div>
    <Button class="pl-1 ml-4" variant="ghost" href="/search"
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
                <Card.Root class='insetCard mb-4'>
                    <Card.Content>
                <p class="resultsSummaryText mb-0">
                    Total Results: <b>{totalResults(response)}</b>
                </p>
                {#if body.seed !== 'Any'}
                <div class="ml-5 mt-4">
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
                <!-- {:else}
                <div class='ml-5'>

                </div> -->
                {/if}
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
            {#if body.seed !== 'Any'}
            <div class="mt-auto mb-3">
                <p class="resultsSummaryTitle">
                    Search on the Official Trade Site:
                </p>
            </div>
            <div class="flex flex-row gap-3">
                <Button
                    class="tradeSearch"
                    disabled={!selectedTradeLeague}
                    onclick={() => openTradeLink("seed")}>Any General</Button
                >
                <Button
                    class="tradeSearch"
                    disabled={!selectedTradeLeague}
                    onclick={() => openTradeLink("general")}
                    >Match General</Button
                >
                {#if body.jewel_type === "Militant Faith"}
                    <Button
                        class="tradeSearch"
                        disabled={!selectedTradeLeague}
                        onclick={() => openTradeLink("exact")}
                        >General + Devo Mods</Button
                    >
                {/if}
            </div>
            {/if}
        </div>
        <Separator orientation="vertical" class="mx-auto"></Separator>
        <div class="flex flex-row ml-3 mr-6 gap-6 items-center">
            {#if body.seed === 'Any'}
            <ResultChart
                values={Object.values(getAttrCounts(response, "jewel_type"))}
                labels={Object.keys(getAttrCounts(response, "jewel_type"))}
                theme="legion"
                title={"Top Jewel Type: " + topAttr(response, "jewel_type").name}
            />
            {/if}
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

<ResultsBrowser totalW={1618} />
</div>
