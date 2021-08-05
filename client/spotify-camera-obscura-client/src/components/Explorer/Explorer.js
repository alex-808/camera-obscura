import { useState } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { GraphHandler } from './GraphHandler/GraphHandler.js';
import { TileContent } from './TileContent/TileContent';
import * as dates from '../../utils/dates';
import { ANALYSIS_FEATURES } from '../../utils/charts';
import { DateFeatures } from '../../utils/dateFeatures.js';
import { averageConcurrentTracks } from './average';

// ! Dates and times are relative to the user's current timezone
const Explorer = function ({ trackData }) {
    const defaultDate = { activeStartDate: new Date(), view: 'month' };

    const [selectedDateRange, setSelectedDateRange] = useState();
    const [graphDatasets, setGraphDatasets] = useState(
        createEmptyDataSets(ANALYSIS_FEATURES)
    );
    const [currentView, setCurrentView] = useState(defaultDate.view);
    const [selectedTile, setSelectedTile] = useState();

    function updateDataSets(activeStartDate, view, tracks) {
        if (view !== 'single_track') {
            const range = dates.getViewsDateRange(activeStartDate, view);
            tracks = getTracksInRange(range, tracks);
        }

        const { datasets } = createGraphData(tracks, view);
        setCurrentView(view);
        setGraphDatasets(datasets);
    }

    const generateTileContent = function ({ activeStartDate, view, date }) {
        const tracks = [];
        // todo Optimize this, we shouldn't have to go thru every single track on every render. Maybe bring back the currentTracks state
        const viewMethods = new dates.ViewMethods(view);
        const range = dates.getViewsDateRange(activeStartDate, view);
        const isSameTimePeriod = viewMethods.getComparer();
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
                selectedTile={selectedTile}
                toggleSelectedTile={toggleSelectedTile}
                toggleSelectedSong={toggleSelectedSong}
            />
        );
    };

    const toggleSelectedTile = function (tileRef, date) {
        if (tileRef.current === selectedTile) {
            setSelectedTile(null);
            const range = dates.getViewsDateRange(date, 'month');
            updateDataSets(range[0], 'month', trackData);
        } else {
            setSelectedTile(tileRef.current);
            updateDataSets(date, 'day', trackData);
        }
    };

    const toggleSelectedSong = function (buttonRef, track) {
        if (buttonRef.current === selectedTile) {
            setSelectedTile(null);
            const range = dates.getViewsDateRange(track[0].added_at, 'month');
            updateDataSets(range[0], 'month', trackData);
        } else {
            setSelectedTile(buttonRef.current);
            updateDataSets(null, 'single_track', track);
        }
    };

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
        if (view !== 'day' && view !== 'single_track') {
            const viewMethods = new dates.ViewMethods(view);
            tracks = averageConcurrentTracks(tracks, viewMethods || []);
        }

        for (let track of tracks) {
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

    const onClick = (props) => {
        console.log(props);
    };

    const handleViewChange = function ({ activeStartDate, view }) {
        updateDataSets(activeStartDate, view, trackData);
    };
    if (graphDatasets) {
        return (
            <>
                <div>Explorer</div>
                <Calendar
                    tileContent={generateTileContent}
                    calendarType="US"
                    onViewChange={handleViewChange}
                    onActiveStartDateChange={handleViewChange}
                    minDetail={'decade'}
                    onClick={onClick}
                    value={new Date()}
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
