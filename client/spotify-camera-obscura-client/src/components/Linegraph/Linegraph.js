import { useEffect, useRef } from 'react';
import * as dateUtils from '../../utils/dates';
import { Line } from 'react-chartjs-2';
import { CHART_COLORS, Dataset } from '../../utils/charts';
import 'chartjs-adapter-luxon';
import { linegraphTestData } from '../Explorer/graphTestData/graphTestData';

const Linegraph = function ({
    datasets,
    view,
    selectedDateRange = [0, 0],
    enabledFeatures,
    onLegendClick,
    onLegendHover,
}) {
    const [isSameTimePeriod] = dateUtils.getViewsMethods(view);
    const chartRef = useRef();

    // todo maybe port this out of Linegraph actually, it's unneccessary
    const buildOutDatasets = function (datasets) {
        const finalizedDatasets = [];
        let i = 0;
        for (let [label, data] of Object.entries(datasets)) {
            const dataset = new Dataset(
                label,
                data,
                CHART_COLORS[i],
                CHART_COLORS[i]
            );
            dataset.hidden = !enabledFeatures.includes(dataset.label);
            finalizedDatasets.push(dataset);
            i++;
        }
        return finalizedDatasets;
    };

    useEffect(() => {
        const chart = chartRef.current;
        updateSelectedElements(chart);
    });

    function updateSelectedElements(chart) {
        if (!chart) return;
        let data = chart.data.datasets;

        const selectedIndex = data[0].data.findIndex((el) => {
            return isSameTimePeriod(el.date, selectedDateRange[0]);
        });

        if (selectedDateRange[0] === 0 || selectedIndex === -1) {
            disableAllElements(chart);
        } else {
            activateSelectedElements(chart, selectedIndex);
        }
        chart.render();
    }

    function activateSelectedElements(chart, selectedIndex) {
        const activeElements = [];
        const n = Object.entries(datasets).length;
        for (let i = 0; i < n; i++) {
            if (enabledFeatures.includes(datasets[i].label)) {
                activeElements.push({
                    datasetIndex: i,
                    index: selectedIndex,
                });
            }
        }
        if (!activeElements.length) return;
        chart.setActiveElements(activeElements);
        chart.tooltip.setActiveElements(activeElements);
    }

    function disableAllElements(chart) {
        chart.setActiveElements([]);
        chart.tooltip.setActiveElements([]);
    }

    datasets = buildOutDatasets(datasets);
    const data = {
        datasets: datasets,
    };

    const setupOpts = function (view, opts) {
        const viewTooltipFormats = {
            day: {
                tooltipFormat: 'DD ttt',
                tickUnit: 'hour',
            },
            month: {
                tooltipFormat: 'DD',
                tickUnit: 'day',
            },
            year: { tooltipFormat: 'MMM yyyy', tickUnit: 'month' },
            decade: { tooltipFormat: 'yyyy', tickUnit: 'year' },
        };

        opts.scales.xAxes.time.tooltipFormat =
            viewTooltipFormats[`${view}`].tooltipFormat;
        opts.scales.xAxes.time.unit = viewTooltipFormats[`${view}`].tickUnit;

        return opts;
    };

    //todo put this in charts module when we're done

    let options = {
        animation: false,
        // animations: {
        //     tension: {
        //         duration: 1000,
        //         easing: 'easeOutQuart',
        //         from: 0.4,
        //         to: 0.5,
        //         loop: true,
        //     },
        // },
        parsing: {
            xAxisKey: 'date',
            yAxisKey: 'value',
        },
        responsive: true,
        interaction: {
            intersect: false,
            mode: 'index',
        },
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
            xAxes: {
                type: 'time',
                time: {
                    tooltipFormat: 'MMMM yy',
                    unit: 'month',
                },
            },
        },
        plugins: {
            legend: {
                onHover: onLegendHover,
                onClick: onLegendClick,
            },
        },

        spanGaps: true,
        elements: {
            point: {
                // todo add styling
            },
        },
    };

    options = setupOpts(view, options);

    const onClick = function (props) {
        console.log(props);
    };

    return (
        <>
            <Line
                ref={chartRef}
                data={data}
                options={options}
                getElementAtEvent={onClick}
            />
        </>
    );
};

export { Linegraph };
