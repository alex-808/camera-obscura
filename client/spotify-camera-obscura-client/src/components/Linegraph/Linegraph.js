import { Line } from 'react-chartjs-2';
import { randomColor } from '../../utils/charts';

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
    // console.log(datasets);

    const data = {
        labels: labels,
        datasets: datasets,
    };

    const options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
        spanGaps: true,
    };

    return <Line data={data} options={options} />;
};

export default Linegraph;
