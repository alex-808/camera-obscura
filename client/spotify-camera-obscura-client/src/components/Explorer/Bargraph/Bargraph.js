import { Bar } from 'react-chartjs-2';
import { CHART_COLORS, Dataset } from '../../../utils/charts';
import { bargraphTestData } from '../graphTestData/graphTestData';

const Bargraph = function ({
    dataset,
    enabledFeatures,
    onLegendClick,
    onLegendHover,
}) {
    // todo investigate how data is sent differently/used between Linegraph and this component
    const buildOutDatasets = function (datasets) {
        // ! Clean this mess up wow
        const datasetsArr = [];
        let i = 0;
        for (let [label, data] of Object.entries(datasets)) {
            if (data.length === 0) return null;
            [data] = data;
            data = data.value;
            const dataObj = {
                label: label,
                data: data,
            };
            const dataset = new Dataset(
                label,
                [dataObj],
                CHART_COLORS[i],
                CHART_COLORS[i]
            );
            dataset.hidden = !enabledFeatures.includes(dataset.label);
            datasetsArr.push(dataset);
            i++;
        }
        console.log(datasetsArr);
        return datasetsArr;
        // return an array of length 1 containing 1 'data' object which contains an array of label/value obj pairs
    };

    dataset = buildOutDatasets(dataset);

    const data = {
        datasets: dataset,
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
