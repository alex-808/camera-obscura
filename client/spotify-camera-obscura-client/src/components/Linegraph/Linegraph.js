import { useState, useEffect, useRef } from 'react';
import * as dateUtils from '../../utils/dates';
import { Line } from 'react-chartjs-2';
import {
    randomColor,
    defaultEnabledFeatures,
    CHART_COLORS,
} from '../../utils/charts';
import 'chartjs-adapter-luxon';

const Linegraph = function ({ datasets, view, selectedDateRange = [0, 0] }) {
    const [isSameTimePeriod, dateFormatter] = dateUtils.getViewsMethods(view);
    const chartRef = useRef();
    console.log(Object.entries(datasets).length);
    useEffect(() => {
        const chart = chartRef.current;
        if (chart) {
            let data = chart.data.datasets;

            const selectedIndex = data[0].data.findIndex((el) => {
                return isSameTimePeriod(el.date, selectedDateRange[0]);
            });

            if (chart.setActiveElements) {
                if (selectedDateRange[0] === 0) {
                    chart.setActiveElements([]);
                    chart.tooltip.setActiveElements([]);
                } else {
                    // const n = Object.entries(datasets).length;
                    // for (let i = 0; i < n; i++) {
                    //     chart.tooltip.setActiveElements([
                    //         {
                    //             datasetIndex: n,
                    //             index: selectedIndex,
                    //         },
                    //     ]);
                    // }

                    chart.setActiveElements([
                        {
                            datasetIndex: 0,
                            index: selectedIndex,
                        },
                        {
                            datasetIndex: 1,
                            index: selectedIndex,
                        },
                    ]);
                    console.log(chart.getActiveElements());
                }

                chart.render();
            }
        }
    });

    const [enabledFeatures, setEnabledFeatures] = useState(
        defaultEnabledFeatures
    );

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
            month: {
                tooltipFormat: 'DD',
                tickUnit: 'day',
            },
            year: { tooltipFormat: 'MMM yy', tickUnit: 'month' },
            decade: { tooltipFormat: 'yyyy', tickUnit: 'year' },
        };

        opts.scales.xAxes.time.tooltipFormat =
            viewTooltipFormats[`${view}`].tooltipFormat;
        opts.scales.xAxes.time.unit = viewTooltipFormats[`${view}`].tickUnit;

        return opts;
    };

    const onLegendHover = function (event, legendItem, legend) {
        // console.log(event);
        // console.log(legendItem);
        // console.log(legend);
    };

    const onLegendClick = function (event, legendItem, legend) {
        console.log(event);
        console.log(legendItem);
        console.log(legend);
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
            tooltip: {
                // If I could make this scriptable or something
                enabled: true,
            },
        },

        spanGaps: true,
        elements: {
            point: {
                // radius: customRadius,
                // display: false,
            },
        },
    };
    // this is how we can highlight points when a calendar date is hovered over
    // function customRadius(context) {
    //     // console.log(context);
    //     if (!context.raw) return 2;
    //     if (
    //         context.raw.date >= selectedDateRange[0] &&
    //         context.raw.date <= selectedDateRange[1]
    //     ) {
    //         return 10;
    //     } else return 2;
    // }

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
                // redraw={true}
            />
        </>
    );
};

export default Linegraph;
