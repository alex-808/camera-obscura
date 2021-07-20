import { Line } from 'react-chartjs-2';
import { randomColor } from '../../utils/charts';
import 'chartjs-adapter-luxon';

const Linegraph = function ({ labels, datasets }) {
    // todo maybe port this out of Linegraph actually, it's unneccessary

    const buildOutDatasets = function (datasets) {
        const finalizedDatasets = [];
        for (let [label, data] of Object.entries(datasets)) {
            const dataset = {
                label: label,
                data: data,
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
        labels: labels,
        datasets: datasets,
    };

    const options = {
        animations: {
            tension: {
                duration: 1000,
                easing: 'easeOutQuart',
                from: 0.4,
                to: 0.5,
                loop: true,
            },
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
            },
        },
        spanGaps: true,
    };

    return <Line data={data} options={options} />;
};

export default Linegraph;
