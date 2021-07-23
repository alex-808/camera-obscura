import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { randomColor } from '../../utils/charts';
import 'chartjs-adapter-luxon';

const Linegraph = function ({ datasets, view }) {
    console.log('rerender');

    let defaultEnabledFeatures = ['energy', 'danceability', 'acousticness'];

    const [enabledFeatures, setEnabledFeatures] = useState(
        defaultEnabledFeatures
    );

    // todo maybe port this out of Linegraph actually, it's unneccessary
    const buildOutDatasets = function (datasets) {
        const finalizedDatasets = [];
        for (let [label, data] of Object.entries(datasets)) {
            const dataset = {
                label: label,
                data: data,
                // fill: true,
                hidden: !enabledFeatures.includes(label),
                backgroundColor: randomColor(),
                borderColor: randomColor(),
                tension: 0.5,
            };
            finalizedDatasets.push(dataset);
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
    };

    options = setupOpts(view, options);

    const onClick = function (props) {
        console.log(props);
    };

    return <Line data={data} options={options} getElementAtEvent={onClick} />;
};

export default Linegraph;
