import { useState, React, useEffect } from 'react';
import { Calendar } from 'react-calendar';
import Linegraph from '../Linegraph/Linegraph.js';
import 'react-calendar/dist/Calendar.css';
import useStyles from './styles';
import * as dates from '../../utils/dates';
import { analysisFeatures } from '../../utils/charts';

const Explorer = function ({ trackData }) {
    const classes = useStyles();

    const defaultDate = { activeStartDate: new Date(), view: 'month' };
    const [currentDateRange, setCurrentDateRange] = useState(
        getDateRange(defaultDate)
    );
    const [currentTracks, setCurrentTracks] = useState(
        getTracksInRange(currentDateRange, trackData)
    );
    const [graphLabels, setGraphLabels] = useState([]);
    const [graphDatasets, setGraphDatasets] = useState({ datasets: {} });

    function updateDateRange(props) {
        // todo make this generic to also update currentTracks
        const date = props ? props : defaultDate;
        const range = getDateRange(date);
        setCurrentDateRange(range);
    }

    useEffect(() => {
        const tracks = getTracksInRange(currentDateRange, trackData);
        setCurrentTracks(tracks);
    }, [currentDateRange, trackData]);

    useEffect(() => {
        const { labels, datasets } = createGraphData(
            currentDateRange,
            currentTracks
        );
        setGraphLabels(labels);
        setGraphDatasets(datasets);
    }, [currentTracks]);

    const generateTileContent = function ({ date, view }) {
        const tracks = [];
        for (let [trackDate, trackInfo] of Object.entries(trackData)) {
            trackDate = new Date(trackDate);
            if (view === 'month') {
                if (dates.isSameDay(date, trackDate)) {
                    tracks.push(trackInfo);
                }
            }
            if (view === 'year') {
                if (dates.isSameMonth(date, trackDate)) {
                    tracks.push(trackInfo);
                }
            }
        }
        return tracks.map((trackInfo) => (
            <p key={trackInfo.track.id}>{trackInfo.track.name}</p>
        ));
    };

    function getDateRange({ activeStartDate, view }) {
        let startDate = !activeStartDate ? new Date() : activeStartDate;
        const currentMonth = startDate.getMonth();
        const currentYear = startDate.getFullYear();
        let range;
        if (view) {
            if (view === 'month') {
                range = [
                    new Date(currentYear, currentMonth),
                    new Date(currentYear, currentMonth + 1),
                ];
            }
            if (view === 'year') {
                range = [
                    new Date(currentYear, 0),
                    new Date(currentYear + 1, 0),
                ];
            }
            // todo Add decade and century views
        } else {
            range = [
                new Date(currentYear, currentMonth),
                new Date(currentYear, currentMonth + 1),
            ];
        }
        return range;
    }

    function getTracksInRange(dateRange, tracks) {
        const tracksInRange = [];
        for (let [trackDate, trackInfo] of Object.entries(tracks)) {
            trackDate = new Date(trackDate);
            if (
                trackDate > dateRange[0] &&
                trackDate < dateRange[dateRange.length - 1]
            ) {
                tracksInRange.push(trackInfo);
            }
        }

        return tracksInRange;
    }

    function createGraphData(dateRange, tracks) {
        const days = dates.getDaysInRange(dateRange[0], dateRange[1]);
        const datasets = createEmptyDataSets(analysisFeatures);

        tracks = sanitizeTrackData(tracks);
        const bundle = bundleConcurrentTracks(tracks);

        const averages = averageConcurrentTracks(bundle) || [];
        console.log(averages);
        for (let i = 0; i < days.length; i++) {
            for (let track of averages) {
                let trackDate = new Date(track.date);
                if (dates.isSameDay(trackDate, days[i])) {
                    for (let [label, dataset] of Object.entries(datasets)) {
                        dataset.push(track.analysisFeatures[`${label}`]);
                    }
                }
            }
            for (let [, array] of Object.entries(datasets)) {
                if (array.length === i) array.push(null);
            }
        }
        return { labels: days, datasets: datasets };
    }

    const bundleConcurrentTracks = function (tracks) {
        if (!tracks.length) return;
        const bundles = [];
        bundles.push([tracks[0]]);
        for (let i = 1; i < tracks.length; i++) {
            if (
                dates.isSameDay(
                    tracks[i].date,
                    bundles[bundles.length - 1][0].date
                )
            ) {
                bundles[bundles.length - 1].push(tracks[i]);
            } else {
                bundles.push([tracks[i]]);
            }
        }

        return bundles;
    };

    const averageConcurrentTracks = function (bundledTracks) {
        if (!bundledTracks) return;
        const averages = [];
        for (let bundle of bundledTracks) {
            if (bundle.length > 1) {
                let avg = averageBundleData(bundle);

                // averages.push([bundle[0].date, avg]);
                averages.push(new AnalysisFeatures(bundle[0].date, avg));
            } else {
                averages.push(bundle[0]);
            }
        }

        return averages;
    };

    function averageBundleData(bundle) {
        let sums = {};
        for (let item of bundle) {
            for (let [label, value] of Object.entries(item.analysisFeatures)) {
                if (analysisFeatures.includes(label)) {
                    if (!sums[`${label}`]) {
                        sums[`${label}`] = value;
                    } else {
                        sums[`${label}`] += value;
                    }
                }
            }
        }
        let avgs = {};
        for (let [label, value] of Object.entries(sums)) {
            avgs[`${label}`] = value / bundle.length;
        }

        return avgs;
    }

    function sanitizeTrackData(tracks) {
        const analysisData = [];
        for (let trackInfo of tracks) {
            const data = new AnalysisFeatures(
                trackInfo.added_at,
                trackInfo.analysis_features
            );
            analysisData.push(data);
        }

        return analysisData;
    }

    class AnalysisFeatures {
        constructor(date, analysisFeatures) {
            this.date = date;
            this.analysisFeatures = analysisFeatures;
        }
    }

    const createEmptyDataSets = function (labels) {
        const datasets = {};
        for (let label of labels) {
            datasets[label] = [];
        }
        return datasets;
    };

    return (
        <>
            <div>Explorer</div>
            <Calendar
                className={classes.myClass}
                tileContent={generateTileContent}
                calendarType="US"
                onViewChange={updateDateRange}
                onActiveStartDateChange={updateDateRange}
            />
            <Linegraph labels={graphLabels} datasets={graphDatasets} />
        </>
    );
};

export default Explorer;
