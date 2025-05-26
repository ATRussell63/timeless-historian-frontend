<script>
    import { Chart, A, Dropdown, DropdownItem, Popover } from "flowbite-svelte";

    let { values, labels, theme, title } = $props();

    let colors = [];

    if (theme === 'legion') {
        colors = [
            '#009933', // templar
            '#CC3333', // vaal
            // '#46268C', // legion purple
            '#7D5CF2',
            '#CC6633', // karui
            '#CCCCCC',  // eternal
            '#FF9933', // maraketh
        ]
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }

    colors = shuffleArray(colors)

    const options = {
        series: values,
        colors: colors,
        chart: {
            height: 420,
            width: "100%",
            type: "pie",
        },
        stroke: {
            colors: ["white"],
            lineCap: "",
        },
        plotOptions: {
            pie: {
                labels: {
                    show: true,
                },
                size: "100%",
                dataLabels: {
                    offset: -25,
                },
            },
        },
        labels: labels,
        dataLabels: {
            enabled: true,
            style: {
                fontFamily: "Roboto, sans-serif",
            },
            formatter: function(value, { seriesIndex, dataPointIndex, w }) {
                // only show wedges larger than x%
                if (value >= 10) {
                    return w.config.labels[seriesIndex]
                } else {
                    return ''
                }
            }
        },
        legend: {
            show: false,
            position: "bottom",
            fontFamily: "Inter, sans-serif",
        },
        title: {
            text: title,
            align: 'center',
            style: {
                fontSize: '20px',
                fontFamily: 'Roboto-Bold',
                color: 'black'
            }
        },
        tooltip: {
            // style: {
            //     fontFamily: "Roboto-Light, sans-serif",
            //     fontSize: '12px'
            // }
            custom: function({series, seriesIndex, dataPointIndex, w}) {
                return `<div class='chartTooltipWrapper'><span class='chartTooltipText'>${w.config.labels[seriesIndex]}: ${w.config.series[seriesIndex]}</span></div>`
            }
        }
        // yaxis: {
        //     labels: {
        //         formatter: function (value) {
        //             return value;
        //         },
        //     },
        // },
        // xaxis: {
        //     labels: {
        //         formatter: function (value) {
        //             return value;
        //         },
        //     },
        //     axisTicks: {
        //         show: false,
        //     },
        //     axisBorder: {
        //         show: false,
        //     },
        // },
    };
</script>

<Chart {options} class="py-6" />
