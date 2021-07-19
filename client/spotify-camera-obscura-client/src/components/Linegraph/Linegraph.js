import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import * as dateUtils from '../../utils/dates';
import { randomColor, analysisFeatures } from '../../utils/charts';
import { DateTime } from 'luxon';

const Linegraph = function ({ labels, datasets }) {
    // todo make creation of this object dynamic
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
