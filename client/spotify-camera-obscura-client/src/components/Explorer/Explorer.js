import { useState, useEffect } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Linegraph from '../Linegraph/Linegraph.js';
import useStyles from './styles';
import * as dates from '../../utils/dates';
import { analysisFeatures } from '../../utils/charts';

const Explorer = function ({ trackData }) {
    const classes = useStyles();

    const defaultDate = { activeStartDate: new Date(), view: 'month' };
    // const [currentDateRange, setCurrentDateRange] = useState(
    //     getViewsDateRange(defaultDate)
    // );
    const [selectedDateRange, setSelectedDateRange] = useState();
    // const [currentTracks, setCurrentTracks] = useState();
    const [graphDatasets, setGraphDatasets] = useState(
        createEmptyDataSets(analysisFeatures)
    );
    const [currentView, setCurrentView] = useState(defaultDate.view);

    function updateDateRange(props) {
        // console.log(props);
        const date = props ? props : defaultDate;
        const range = getViewsDateRange(date);
        const tracks = getTracksInRange(range, trackData);
        const { datasets } = createGraphData(tracks, props.view);
        // setCurrentDateRange(range);
        setCurrentView(props.view);
        // setCurrentTracks(tracks);
        setGraphDatasets(datasets);
    }

    // useEffect(() => {
    //     const tracks = getTracksInRange(currentDateRange, trackData);
    //     setCurrentTracks(tracks);
    // }, [currentDateRange, trackData]);

    // useEffect(() => {
    //     const { datasets } = createGraphData(currentTracks, currentView);
    //     setGraphDatasets(datasets);
    // }, [currentTracks]);

    const generateTileContent = function ({ date, view }) {
        const tracks = [];
        const [isSameTimePeriod] = dates.getViewsMethods(view);
        for (let [trackDate, trackInfo] of Object.entries(trackData)) {
            trackDate = new Date(trackDate);
            if (isSameTimePeriod(date, trackDate)) {
                tracks.push(trackInfo);
            }
        }
        return (
            <div
                onMouseEnter={hoverOverTile.bind(null, date)}
                onMouseOut={exitTile}
            >
                {tracks.map((trackInfo) => (
                    <p key={trackInfo.track.id}>{trackInfo.track.name}</p>
                ))}
            </div>
        );
    };

    function hoverOverTile(date) {
        const start = new Date(date);
        const end = new Date(date);
        // todo will need to create a version for months and years as well
        end.setUTCHours(23, 59, 59, 999);
        console.log([start, end]);
        setSelectedDateRange([start, end]);
    }

    function exitTile() {
        setSelectedDateRange([0, 0]);
    }

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

    function createGraphData(tracks, view) {
        if (!tracks) return { datasets: null };
        const datasets = createEmptyDataSets(analysisFeatures);
        tracks = sanitizeTrackData(tracks);
        const averages = averageConcurrentTracks(tracks, view) || [];
        for (let track of averages) {
            let trackDate = new Date(track.date);
            for (let [label, dataset] of Object.entries(datasets)) {
                dataset.push({
                    date: trackDate,
                    value: track.analysisFeatures[`${label}`],
                });
            }
        }
        return { datasets: datasets };
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

    const averageConcurrentTracks = function (tracks, view) {
        const bundledTracks = bundleConcurrentTracks(tracks, view);
        const [_, dateFormatter] = dates.getViewsMethods(view);
        if (!bundledTracks) return;
        const averages = [];
        for (let bundle of bundledTracks) {
            const date = dateFormatter(bundle[0].date);
            if (bundle.length > 1) {
                let avg = averageBundleData(bundle);

                averages.push(new AnalysisFeatures(date, avg));
            } else {
                averages.push(
                    new AnalysisFeatures(date, bundle[0].analysisFeatures)
                );
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

    function createEmptyDataSets(labels) {
        const datasets = {};
        for (let label of labels) {
            datasets[label] = [];
        }
        return datasets;
    }

    const onChange = function (returnVal) {
        console.log(returnVal);
    };

    const onClick = (props) => {
        console.log(props);
    };
    if (graphDatasets) {
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
                <Linegraph
                    datasets={graphDatasets}
                    view={currentView}
                    selectedDateRange={selectedDateRange}
                />
            </>
        );
    } else {
        return <>Loading</>;
    }
};

export default Explorer;
