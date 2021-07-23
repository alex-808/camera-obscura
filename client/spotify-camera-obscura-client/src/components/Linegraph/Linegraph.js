import { Line } from 'react-chartjs-2';
import { randomColor } from '../../utils/charts';
import 'chartjs-adapter-luxon';

const Linegraph = function ({ datasets }) {
    console.log('rerender');
    // todo maybe port this out of Linegraph actually, it's unneccessary
    const buildOutDatasets = function (datasets) {
        const finalizedDatasets = [];
        for (let [label, data] of Object.entries(datasets)) {
            const dataset = {
                label: label,
                data: data,
                // fill: true,
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
        // labels: labels,
        datasets: datasets,
    };

    //! This is an example of a alternative data structure we could use to trim the front/end of graphs
    // const data = {
    //     datasets: [
    //         {
    //             label: 'values',
    //             data: [{ date: labels[0], value: 20 }],
    //         },
    //         {
    //             label: 'values2',
    //             data: [{ date: labels[0], value: 30 }],
    //         },
    //     ],
    // };

    const options = {
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
                    tooltipFormat: 'DD',
                },
            },
        },
        spanGaps: true,
    };

    return <Line data={data} options={options} />;
};

export default Linegraph;
