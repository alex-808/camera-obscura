import { useState, React, useEffect } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Linegraph from '../Linegraph/Linegraph.js';
import useStyles from './styles';
import * as dates from '../../utils/dates';
import { analysisFeatures } from '../../utils/charts';

const Explorer = function ({ trackData }) {
    const classes = useStyles();

    const defaultDate = { activeStartDate: new Date(), view: 'month' };
    const [currentDateRange, setCurrentDateRange] = useState(
        getViewsDateRange(defaultDate)
    );
    const [currentTracks, setCurrentTracks] = useState(
        getTracksInRange(currentDateRange, trackData)
    );
    const [graphLabels, setGraphLabels] = useState([]);
    const [graphDatasets, setGraphDatasets] = useState({ datasets: {} });

    const [currentView, setCurrentView] = useState(defaultDate.view);

    function updateDateRange(props) {
        console.log(props);
        const date = props ? props : defaultDate;
        const range = getViewsDateRange(date);
        setCurrentDateRange(range);
        setCurrentView(props.view);
    }

    useEffect(() => {
        const tracks = getTracksInRange(currentDateRange, trackData);
        setCurrentTracks(tracks);
    }, [currentDateRange, trackData]);

    useEffect(() => {
        const { labels, datasets } = createGraphData(
            currentDateRange,
            currentTracks,
            currentView
        );
        setGraphLabels(labels);
        setGraphDatasets(datasets);
    }, [currentTracks]);

    const generateTileContent = function ({ date, view }) {
        const tracks = [];
        const [isSameTimePeriod] = dates.getViewsMethods(view);
        for (let [trackDate, trackInfo] of Object.entries(trackData)) {
            trackDate = new Date(trackDate);
            if (isSameTimePeriod(date, trackDate)) {
                tracks.push(trackInfo);
            }
        }
        return tracks.map((trackInfo) => (
            <p key={trackInfo.track.id}>{trackInfo.track.name}</p>
        ));
    };

    function getViewsDateRange({ activeStartDate, view }) {
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
            if (view === 'decade') {
                range = [
                    new Date(currentYear, 0),
                    new Date(currentYear + 10, 0),
                ];
            }
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

    function createGraphData(dateRange, tracks, view) {
        const [isSameTimePeriod, getDateUnitsInRange] =
            dates.getViewsMethods(view);
        const dateUnits = getDateUnitsInRange(dateRange[0], dateRange[1]);
        const datasets = createEmptyDataSets(analysisFeatures);

        tracks = sanitizeTrackData(tracks);
        const bundle = bundleConcurrentTracks(tracks, view);

        const averages = averageConcurrentTracks(bundle) || [];
        for (let i = 0; i < dateUnits.length; i++) {
            for (let track of averages) {
                let trackDate = new Date(track.date);
                if (isSameTimePeriod(trackDate, dateUnits[i])) {
                    for (let [label, dataset] of Object.entries(datasets)) {
                        dataset.push({
                            date: trackDate,
                            value: track.analysisFeatures[`${label}`],
                        });
                    }
                }
            }
            // for (let [, array] of Object.entries(datasets)) {
            //     if (array.length === i) array.push(null);
            // }
        }
        return { labels: dateUnits, datasets: datasets };
    }

    const bundleConcurrentTracks = function (tracks, view) {
        if (!tracks.length) return;
        const [isSameTimePeriod] = dates.getViewsMethods(view);
        const bundles = [];
        bundles.push([tracks[0]]);
        for (let i = 1; i < tracks.length; i++) {
            if (
                isSameTimePeriod(
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
            console.log({ bundle });
            if (bundle.length > 1) {
                let avg = averageBundleData(bundle);
                const [year, month, day] = dates.getYearMonthDay(
                    bundle[0].date
                );
                averages.push(
                    new AnalysisFeatures(new Date(year, month, day), avg)
                );
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
        return tracks.map(
            (trackInfo) =>
                new AnalysisFeatures(
                    trackInfo.added_at,
                    trackInfo.analysis_features
                )
        );
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

    const onChange = function (returnVal) {
        console.log(returnVal);
    };

    const onClick = (props) => {
        console.log(props);
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
                onChange={onChange}
                returnValue={'range'}
                minDetail={'decade'}
                onClick={onClick}
                value={new Date()}
            />
            <Linegraph labels={graphLabels} datasets={graphDatasets} />
        </>
    );
};

export default Explorer;
