import { useState } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { GraphHandler } from './GraphHandler/GraphHandler.js';
import { TileContent } from './TileContent/TileContent';
import useStyles from './styles';
import * as dates from '../../utils/dates';
import { ANALYSIS_FEATURES } from '../../utils/charts';
import { DateFeatures } from '../../utils/dateFeatures.js';
import { averageConcurrentTracks } from './average';

// ! Dates and times are relative to the user's current timezone
const Explorer = function ({ trackData }) {
    const classes = useStyles();

    const defaultDate = { activeStartDate: new Date(), view: 'month' };

    const [selectedDateRange, setSelectedDateRange] = useState();
    const [graphDatasets, setGraphDatasets] = useState(
        createEmptyDataSets(ANALYSIS_FEATURES)
    );
    const [currentView, setCurrentView] = useState(defaultDate.view);

    function updateDataSets(activeStartDate, view) {
        const range = getViewsDateRange(activeStartDate, view);
        const tracks = getTracksInRange(range, trackData);
        const { datasets } = createGraphData(tracks, view);
        setCurrentView(view);
        setGraphDatasets(datasets);
    }

    const generateTileContent = function ({ activeStartDate, view, date }) {
        const tracks = [];
        // todo Optimize this, we shouldn't have to go thru every single track on every render. Maybe bring back the currentTracks state
        const range = getViewsDateRange(activeStartDate, view);
        const [isSameTimePeriod] = dates.getViewsMethods(view);
        for (let [trackDate, trackInfo] of Object.entries(trackData)) {
            trackDate = new Date(trackDate);
            if (
                isSameTimePeriod(date, trackDate) &&
                trackDate >= range[0] &&
                trackDate <= range[1]
            ) {
                tracks.push(trackInfo);
            }
        }
        return (
            <TileContent
                date={date}
                tracks={tracks}
                setSelectedDateRange={setSelectedDateRange}
            />
        );
    };

    function getViewsDateRange(activeStartDate, view) {
        let startDate = !activeStartDate ? new Date() : activeStartDate;
        const currentMonth = startDate.getMonth();
        const currentYear = startDate.getFullYear();
        const currentDay = startDate.getUTCDate();
        let range;
        if (view) {
            if (view === 'day') {
                range = [
                    new Date(currentYear, currentMonth, currentDay),
                    new Date(currentYear, currentMonth, currentDay + 1),
                ];
            }
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
            if (trackDate >= dateRange[0] && trackDate < dateRange[1]) {
                tracksInRange.push(trackInfo);
            }
        }

        return tracksInRange;
    }

    function createGraphData(tracks, view) {
        if (!tracks) return { datasets: null };
        const datasets = createEmptyDataSets(ANALYSIS_FEATURES);
        tracks = sanitizeTrackData(tracks);
        if (view !== 'day')
            tracks = averageConcurrentTracks(tracks, view || []);
        for (let track of tracks) {
            let trackDate = new Date(track.date);
            for (let [label, dataset] of Object.entries(datasets)) {
                dataset.push({
                    date: trackDate,
                    value: track.analysisFeatures[`${label}`],
                });
            }
        }

        console.log('Explorer', datasets);

        return { datasets: datasets };
    }

    function sanitizeTrackData(tracks) {
        return tracks.map(
            (trackInfo) =>
                new DateFeatures(
                    trackInfo.added_at,
                    trackInfo.analysis_features
                )
        );
    }

    function createEmptyDataSets(labels) {
        const datasets = {};
        for (let label of labels) {
            datasets[label] = [];
        }
        return datasets;
    }

    const onChange = function (dayStart, e) {
        updateDataSets(dayStart, 'day');
    };

    const onClick = (props) => {
        console.log(props);
    };

    const handleViewChange = function ({ activeStartDate, view }) {
        updateDataSets(activeStartDate, view);
    };
    if (graphDatasets) {
        return (
            <>
                <div>Explorer</div>
                <Calendar
                    // className={classes.myClass}
                    tileContent={generateTileContent}
                    calendarType="US"
                    onViewChange={handleViewChange}
                    onActiveStartDateChange={handleViewChange}
                    onChange={onChange}
                    // returnValue={'range'}
                    minDetail={'decade'}
                    onClick={onClick}
                    value={new Date()}
                    // selectRange
                />
                <GraphHandler
                    datasets={graphDatasets}
                    currentView={currentView}
                    selectedDateRange={selectedDateRange}
                />
            </>
        );
    } else {
        return <>Loading</>;
    }
};

export default Explorer;
