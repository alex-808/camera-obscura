import { Bar } from 'react-chartjs-2';

const Bargraph = function ({ datasets, onLegendClick, onLegendHover }) {
    const data = {
        datasets: datasets,
    };

    const options = {
        animation: false,
        parsing: {
            xAxisKey: 'label',
            yAxisKey: 'data',
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
