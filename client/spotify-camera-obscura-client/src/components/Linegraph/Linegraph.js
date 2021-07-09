import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import * as dateUtils from '../../utils/dates';
import { randomColor, analysisFeatures } from '../../utils/charts';
import { DateTime } from 'luxon';

const Linegraph = function ({ dateRange, currentTracks }) {
    const [labels, setLabels] = useState(0);
    const [datasets, setDatasets] = useState([]);

    const generateDatasets = function (tracks, dates) {
        const datasets = createEmptyDataSets(analysisFeatures);

        for (let i = 0; i < dates.length; i++) {
            for (let track of tracks) {
                let trackDate = new Date(track.added_at);
                if (dateUtils.isSameDay(trackDate, dates[i])) {
                    for (let [label, dataset] of Object.entries(datasets)) {
                        dataset.push(track.analysis_features[`${label}`]);
                    }
                }
            }
            for (let [, array] of Object.entries(datasets)) {
                if (array.length === i) array.push(null);
            }
        }
        // for every day (label), check if the track's day is the same, if it's not, write null to that dataset, else write the values
        // we need an array of datasets
        return datasets;
    };

    const createEmptyDataSets = function (labels) {
        const datasets = {};
        for (let label of labels) {
            datasets[label] = [];
        }
        return datasets;
    };

    useEffect(() => {
        // console.log('Date range:', dateRange);
        // console.log('Current tracks', currentTracks);
        const days = dateUtils.getDaysInRange(dateRange[0], dateRange[1]);
        setLabels(days);
    }, [dateRange, currentTracks]);

    useEffect(() => {
        const updatedDatasets = generateDatasets(currentTracks, labels);
        // console.log(updatedDatasets);
        setDatasets(updatedDatasets);
    }, [labels]);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'energy',
                data: datasets.energy,
                backgroundColor: randomColor(),
                borderColor: randomColor(),
                tension: 0.5,
            },

            {
                label: 'acousticness',
                data: datasets.acousticness,
                backgroundColor: randomColor(),
                borderColor: randomColor(),
                tension: 0.5,
            },
            {
                label: 'instrumentalness',
                data: datasets.instrumentalness,
                backgroundColor: randomColor(),
                borderColor: randomColor(),
                tension: 0.5,
            },
            // {
            //     label: 'key',
            //     data: datasets.key,
            // },
            {
                label: 'liveness',
                data: datasets.liveness,
                backgroundColor: randomColor(),
                borderColor: randomColor(),
                tension: 0.5,
            },
            // {
            //     label: 'loudness',
            //     data: datasets.loudness,
            // },
            {
                label: 'mode',
                data: datasets.mode,
                backgroundColor: randomColor(),
                borderColor: randomColor(),
                tension: 0.5,
            },
            {
                label: 'speechiness',
                data: datasets.speechiness,
                backgroundColor: randomColor(),
                borderColor: randomColor(),
                tension: 0.5,
            },
            // {
            //     label: 'tempo',
            //     data: datasets.tempo,
            // },
            // {
            //     label: 'timeSignature',
            //     data: datasets.timeSignature,
            // },
            {
                label: 'valence',
                data: datasets.valence,
                backgroundColor: randomColor(),
                borderColor: randomColor(),
                tension: 0.5,
            },
        ],
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
