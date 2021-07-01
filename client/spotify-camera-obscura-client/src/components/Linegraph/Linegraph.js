import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import * as dateUtils from '../../utils/dates';

const Linegraph = function ({ dateRange, currentTracks }) {
    const [labels, setLabels] = useState(0);
    const [datasets, setDatasets] = useState([]);

    const generateDatasets = function (tracks, dates) {
        let energyData = [];
        const datasets = {
            acousticness: [],
            danceability: [],
            energy: [],
            instrumentalness: [],
            key: [],
            liveness: [],
            loudness: [],
            mode: [],
            speechiness: [],
            tempo: [],
            timeSignature: [],
            valence: [],
        };
        for (let track of tracks) {
            console.log(track);
        }

        // console.log(dates[0]);

        for (let i = 0; i < dates.length; i++) {
            for (let track of tracks) {
                let trackDate = new Date(track.added_at);
                if (dateUtils.isSameDay(trackDate, dates[i])) {
                    energyData.push(track.analysis_features.energy);
                }
            }
            if (energyData.length === i) {
                energyData.push(null);
            }
        }
        // for every day (label), check if the track's day is the same, if it's not, write null to that dataset, else write the values
        // we need an array of datasets
        return { energy: energyData };
    };

    useEffect(() => {
        console.log('Date range:', dateRange);
        console.log('Current tracks', currentTracks);
        const days = dateUtils.getDaysInRange(dateRange[0], dateRange[1]);
        setLabels(days);
    }, [dateRange, currentTracks]);

    useEffect(() => {
        const updatedDatasets = generateDatasets(currentTracks, labels);
        console.log(updatedDatasets);
        setDatasets(updatedDatasets);
    }, [labels]);

    const data = {
        labels: labels,
        datasets: [
            {
                // label for this dataset
                label: 'energy',
                data: datasets.energy,
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
