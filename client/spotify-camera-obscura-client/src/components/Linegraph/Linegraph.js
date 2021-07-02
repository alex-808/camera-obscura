import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import * as dateUtils from '../../utils/dates';
import { randomColor } from '../../utils/charts';
import { DateTime } from 'luxon';

const Linegraph = function ({ dateRange, currentTracks }) {
    const [labels, setLabels] = useState(0);
    const [datasets, setDatasets] = useState([]);

    const generateDatasets = function (tracks, dates) {
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

        for (let i = 0; i < dates.length; i++) {
            for (let track of tracks) {
                let trackDate = new Date(track.added_at);
                if (dateUtils.isSameDay(trackDate, dates[i])) {
                    let {
                        energy,
                        acousticness,
                        danceability,
                        instrumentalness,
                        key,
                        liveness,
                        loudness,
                        mode,
                        speechiness,
                        tempo,
                        timeSignature,
                        valence,
                    } = track.analysis_features;
                    datasets.energy.push(energy);
                    datasets.acousticness.push(acousticness);
                    datasets.danceability.push(danceability);
                    datasets.instrumentalness.push(instrumentalness);
                    datasets.key.push(key);
                    datasets.liveness.push(liveness);
                    datasets.loudness.push(loudness);
                    datasets.mode.push(mode);
                    datasets.speechiness.push(speechiness);
                    datasets.tempo.push(tempo);
                    datasets.timeSignature.push(timeSignature);
                    datasets.valence.push(valence);
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
