import { Bar } from 'react-chartjs-2';

const Bargraph = function ({ datasets, onLegendClick, onLegendHover }) {
    console.log(datasets);
    const data = {
        datasets: datasets,
    };

    const options = {
        animation: false,
        parsing: {
            xAxisKey: 'label',
            yAxisKey: 'value',
        },
        plugins: {
            legend: {
                onHover: onLegendHover,
                onClick: onLegendClick,
            },
        },
    };
    return <Bar data={data} options={options} />;
};

export { Bargraph };
