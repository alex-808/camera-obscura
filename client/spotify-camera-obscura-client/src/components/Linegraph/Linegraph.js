import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import * as dates from '../../utils/dates';

const Linegraph = function ({ dateRange, currentTracks }) {
    const [labels, setLabels] = useState(0);
    const [datasets, setDatasets] = useState([]);

    const generateDatasets = function () {
        return [];
    };

    useEffect(() => {
        console.log('Date range:', dateRange);
        console.log('Current tracks', currentTracks);
        const days = dates.getDaysInRange(dateRange[0], dateRange[1]);
        setLabels(days);
        const updatedDatasets = generateDatasets(currentTracks);
    }, [dateRange, currentTracks]);

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
    };

    return <Line data={data} options={options} />;
};

export default Linegraph;
