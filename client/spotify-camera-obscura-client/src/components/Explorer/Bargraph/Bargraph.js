import { Bar } from 'react-chartjs-2';
import { CHART_COLORS, Dataset } from '../../../utils/charts';
import { bargraphTestData } from '../graphTestData/graphTestData';

const Bargraph = function ({
    datasets,
    enabledFeatures,
    onLegendClick,
    onLegendHover,
}) {
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
