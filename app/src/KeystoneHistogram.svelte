<script>
    import { Chart, tooltip } from "flowbite-svelte";
    
    import { LEGION_COLORS } from "./drawingConstants";
    import { colorVariants } from "$lib/utils";
    import BlackScythe from "$lib/images/keystones/Black Scythe Training.png"
    import CelestialMathematics from "$lib/images/keystones/Celestial Mathematics.png"
    import Chainbreaker from "$lib/images/keystones/Chainbreaker.png"
    import CorruptedSoul from "$lib/images/keystones/Corrupted Soul.png"
    import DanceWithDeath from "$lib/images/keystones/Dance with Death.png"
    import DivineFlesh from "$lib/images/keystones/Divine Flesh.png"
    import ImmortalAmbition from "$lib/images/keystones/Immortal Ambition.png"
    import InnerConviction from "$lib/images/keystones/Inner Conviction.png"
    import PowerOfPurpose from "$lib/images/keystones/Power of Purpose.png"
    import SecondSight from "$lib/images/keystones/Second Sight.png"
    import StrengthOfBlood from "$lib/images/keystones/Strength of Blood.png"
    import SupremeDecadence from "$lib/images/keystones/Supreme Decadence.png"
    import SupremeGrandstanding from "$lib/images/keystones/Supreme Grandstanding.png"
    import SupremeOstentation from "$lib/images/keystones/Supreme Ostentation.png"
    import TemperedByWar from "$lib/images/keystones/Tempered by War.png"
    import TheTraitor from "$lib/images/keystones/The Traitor.png"
    import TheUnbreakingCircle from "$lib/images/keystones/The Unbreaking Circle.png"
    import Transcendence from "$lib/images/keystones/Transcendence.png"
    import { isBright } from "$lib/utils";

    let { histogram_data, hardcore } = $props()

    console.log(LEGION_COLORS.get('Brutal Restraint'))

    let hardcore_label = $derived(hardcore ? 'hardcore' : 'softcore')

    let legionColorVariants = {
        'Brutal Restraint': colorVariants(LEGION_COLORS.get('Brutal Restraint')),
        'Militant Faith': colorVariants(LEGION_COLORS.get('Militant Faith')),
        'Glorious Vanity': colorVariants(LEGION_COLORS.get('Glorious Vanity')),
        'Elegant Hubris': colorVariants(LEGION_COLORS.get('Elegant Hubris')),
        'Lethal Pride': colorVariants(LEGION_COLORS.get('Lethal Pride')),
        'Heroic Tragedy': colorVariants(LEGION_COLORS.get('Heroic Tragedy')),
    }

    let generalColorMap = {
        'Asenath': legionColorVariants['Brutal Restraint'][0],
        'Balbala': legionColorVariants['Brutal Restraint'][1],
        'Nasima': legionColorVariants['Brutal Restraint'][2],
        'Cadiro': legionColorVariants['Elegant Hubris'][0],
        'Caspiro': legionColorVariants['Elegant Hubris'][1],
        'Victario': legionColorVariants['Elegant Hubris'][2],
        'Ahuana': legionColorVariants['Glorious Vanity'][0],
        'Doryani': legionColorVariants['Glorious Vanity'][1],
        'Xibaqua': legionColorVariants['Glorious Vanity'][2],
        'Akoya': legionColorVariants['Lethal Pride'][0],
        'Kaom': legionColorVariants['Lethal Pride'][1],
        'Rakiata': legionColorVariants['Lethal Pride'][2],
        'Avarius': legionColorVariants['Militant Faith'][0],
        'Dominus': legionColorVariants['Militant Faith'][1],
        'Maxarius': legionColorVariants['Militant Faith'][2],
        'Vorana': legionColorVariants['Heroic Tragedy'][0],
        'Uhtred': legionColorVariants['Heroic Tragedy'][1],
        'Medved': legionColorVariants['Heroic Tragedy'][2],
    }

    let keystoneGeneralMap = {
        "Dance with Death": "Asenath",
        "The Traitor": "Balbala",
        "Second Sight": "Nasima",
        "Supreme Decadence": "Cadiro",
        "Supreme Ostentation": "Caspiro",
        "Supreme Grandstanding": "Victario",
        "Immortal Ambition": "Ahuana",
        "Corrupted Soul": "Doryani",
        "Divine Flesh": "Xibaqua",
        "Chainbreaker": "Akoya",
        "Strength of Blood": "Kaom",
        "Tempered by War": "Rakiata",
        "Power of Purpose": "Avarius",
        "Inner Conviction": "Dominus",
        "Transcendence": "Maxarius",
        "Black Scythe Training": "Vorana",
        "Celestial Mathematics": "Uhtred",
        "The Unbreaking Circle": "Medved",
    }

    let keystoneToImgMap = {
        "Dance with Death": DanceWithDeath,
        "The Traitor": TheTraitor,
        "Second Sight": SecondSight,
        "Supreme Decadence": SupremeDecadence,
        "Supreme Ostentation": SupremeOstentation,
        "Supreme Grandstanding": SupremeGrandstanding,
        "Immortal Ambition": ImmortalAmbition,
        "Corrupted Soul": CorruptedSoul,
        "Divine Flesh": DivineFlesh,
        "Chainbreaker": Chainbreaker,
        "Strength of Blood": StrengthOfBlood,
        "Tempered by War": TemperedByWar,
        "Power of Purpose": PowerOfPurpose,
        "Inner Conviction": InnerConviction,
        "Transcendence": Transcendence,
        "Black Scythe Training": BlackScythe,
        "Celestial Mathematics": CelestialMathematics,
        "The Unbreaking Circle": TheUnbreakingCircle
    }

    function getAllCount(league) {
        return histogram_data.ALL[hardcore_label].filter(l => l.league_name === league)[0].total
    }

    function getPercentCount(general, league) {
        let count = histogram_data[general][hardcore_label].filter(l => l.league_name === league)[0].total
        let total = getAllCount(league)
        return (count / total) * 100
    }

    let leagues = $derived(histogram_data.ALL[hardcore_label]
        .sort((a, b) => a.league_id - b.league_id)
        .map(l => l.league_name))

    let series = $derived.by(() => {
        let ret = []
        for (const [general, stats] of Object.entries(histogram_data)) {
            if (general === 'ALL') continue

            // get the counts at each league
            let counts_per_league = stats[hardcore_label]
                .sort((a, b) => a.league_id - b.league_id)
                .map(l => getPercentCount(general, l.league_name))

            // slop man here - did you know that the heroic tragedy bros couldn't drop prior to Mirage league?
            if (stats.jewel_type === 'Heroic Tragedy') {
                counts_per_league.unshift(0, 0, 0)
            }

            let general_data = {
                name: stats.keystone_name,
                data: counts_per_league,
                color: generalColorMap[general]
            }
            
            ret.push(general_data)

            console.log(general, general_data)
        }
        return ret
    })

    let options = $derived.by(() => {
        return {
            chart: {
                height: "800px",
                // width: '500px',
                type: "line",
                
                fontFamily: "Inter, sans-serif",
                dropShadow: {
                    enabled: false
                },
                toolbar: {
                    show: false,
                    tools: {
                        zoom: false,
                        zoomin: false,
                        zoomout: false,
                        pan: false
                    },
                    
                },
                animations: {
                    enabled: false
                },
                zoom: {
                    type: 'y',
                    enabled: false,
                    allowMouseWheelZoom: false,
                },
            },
            
            tooltip: {
                shared: false,
                intersect: true,
                enabled: true,
                custom: function({ series, seriesIndex, dataPointIndex, w }) {
                    const xValue = w.globals.categoryLabels[dataPointIndex];
                    const yValue = series[seriesIndex][dataPointIndex];
                    const keystone = w.globals.seriesNames[seriesIndex]
                    const general = keystoneGeneralMap[keystone]
                    const icon = keystoneToImgMap[keystone]
                    const tooltipColor = generalColorMap[keystoneGeneralMap[keystone]]
                    const textColor = isBright(tooltipColor) ? 'black' : 'white'

                    return `
                        <div class="flex flex-row p-2 gap-2"
                            style="background-color: ${tooltipColor};
                                   color: ${textColor};">
                            <div class='flex flex-col justify-center'>
                                <img
                                    class='border-3 rounded-[50%]'
                                    style="border-color: ${textColor};"
                                    src="${icon}"
                                    width="60"
                                    height="60"
                                    style="border-radius:50%;"
                                />
                            </div>
                            <div class='flex flex-col justify-center text-md'>
                                <div>
                                    ${keystone}:
                                    ${Math.pow(yValue, 2).toFixed(1)}%
                                </div>
                                <div>${general}</div>
                                <div>${xValue}</div>
                            </div>
                        </div>
                    `;
                }
            },
            markers: {
                size: 8,
                hover: {
                    size: 10
                }
            },

            dataLabels: {
                enabled: false
            },
            stroke: {
                width: 6,
                curve: "smooth"
            },
            grid: {
                show: true,
                strokeDashArray: 4,
                padding: {
                    left: 30,
                    right: 30,
                    top: 10
                }
            },
            series: series.map(s => ({
                ...s,
                data: s.data.map(v => Math.sqrt(v))
            })),
            legend: {
                show: false
            },
            xaxis: {
                categories: leagues,
                title: {
                    text: 'League',
                    style: {
                        fontFamily: "Inter, sans-serif",
                        cssClass: "text-xl font-normal fill-gray-500 dark:fill-gray-400"
                    }
                },
                labels: {
                    show: true,
                    style: {
                        fontFamily: "Inter, sans-serif",
                        cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400"
                    }
                },
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                tooltip: {
                    enabled: false
                }
            },
            yaxis: {
                title: {
                    text: 'Percent Usage',
                    style: {
                        fontFamily: "Inter, sans-serif",
                        cssClass: "text-xl font-normal fill-gray-500 dark:fill-gray-400"
                    }
                },
                labels: {
                    show: true,
                    style: {
                        fontFamily: "Inter, sans-serif",
                        cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400"
                    },
                    formatter: (value) => `${Math.pow(value, 2).toFixed(0)}%`
                },
                // show: false
                forceNiceScale: true,
                decimalsInFloat: 1
            }
        }
    })
</script>

<Chart {options} />
