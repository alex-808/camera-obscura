import { useState, useEffect, useRef } from 'react';
import * as dateUtils from '../../utils/dates';
import { Line } from 'react-chartjs-2';
import { DEFAULT_ENABLED_FEATURES, CHART_COLORS } from '../../utils/charts';
import 'chartjs-adapter-luxon';

const Linegraph = function ({ datasets, view, selectedDateRange = [0, 0] }) {
    const [enabledFeatures, setEnabledFeatures] = useState(
        DEFAULT_ENABLED_FEATURES
    );
    const [isSameTimePeriod] = dateUtils.getViewsMethods(view);
    const chartRef = useRef();

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

    // todo maybe port this out of Linegraph actually, it's unneccessary
    const buildOutDatasets = function (datasets) {
        const finalizedDatasets = [];
        let i = 0;
        for (let [label, data] of Object.entries(datasets)) {
            const dataset = {
                label: label,
                data: data,
                // fill: true,
                hidden: !enabledFeatures.includes(label),
                backgroundColor: CHART_COLORS[i],
                borderColor: CHART_COLORS[i],
                tension: 0.5,
                hoverBackgroundColor: 'black',
            };
            finalizedDatasets.push(dataset);
            i++;
        }
        return finalizedDatasets;
    };

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

    const onLegendHover = function (event, legendItem, legend) {
        // todo Write/reveal explainer on audio feature on hover
    };

    const onLegendClick = function (event, legendItem, legend) {
        const wasHidden = legendItem.hidden;
        const legendItemLabel = legendItem.text;

        if (wasHidden) {
            setEnabledFeatures([...enabledFeatures, legendItemLabel]);
        } else {
            setEnabledFeatures(
                enabledFeatures.filter((el) => el !== legendItemLabel)
            );
        }

        const index = legendItem.datasetIndex;
        const ci = legend.chart;
        if (ci.isDatasetVisible(index)) {
            ci.hide(index);
            legendItem.hidden = true;
        } else {
            ci.show(index);
            legendItem.hidden = false;
        }
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

export default Linegraph;
