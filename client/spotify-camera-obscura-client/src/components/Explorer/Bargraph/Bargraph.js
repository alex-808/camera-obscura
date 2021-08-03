import { Bar } from 'react-chartjs-2';
import { useState } from 'react';
import {
    DEFAULT_ENABLED_FEATURES,
    CHART_COLORS,
    randomColor,
} from '../../../utils/charts';

const Bargraph = function ({ dataset }) {
    console.log('Bargraph', dataset);
    // todo raise this state to the Explorer component
    const [enabledFeatures, setEnabledFeatures] = useState(
        DEFAULT_ENABLED_FEATURES
    );

    // todo investigate how data is sent differently/used between Linegraph and this component
    const buildOutDatasets = function (datasets) {
        // ! Clean this mess up wow
        const datasetsArr = [];
        for (let [label, data] of Object.entries(datasets)) {
            if (data.length === 0) return null;
            [data] = data;
            data = data.value;
            const dataObj = {
                label: label,
                data: data,
            };
            const dataset = {
                label: label,
                data: [dataObj],
                backgroundColor: randomColor(),
            };
            datasetsArr.push(dataset);
        }
        return datasetsArr;
        // return an array of length 1 containing 1 'data' object which contains an array of label/value obj pairs
    };

    dataset = buildOutDatasets(dataset);
    const data = {
        datasets: dataset,
    };

    // ! Figure out how to shape this data
    // const data2 = {
    //     datasets: [
    //         {
    //             label: 'Danceability',
    //             data: [{ label: 'Danceability', data: 1500 }],
    //         },
    //         {
    //             label: 'Energy',
    //             data: [{ label: 'Energy', data: 1500 }],
    //         },
    //     ],
    // };

    // console.log(data2);
    const options = {
        animation: false,
        parsing: {
            xAxisKey: 'label',
            yAxisKey: 'data',
        },
    };
    return <Bar data={data} options={options} />;
};

export { Bargraph };
