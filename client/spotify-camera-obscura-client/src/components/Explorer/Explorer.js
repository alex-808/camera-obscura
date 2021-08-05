import { useState } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { GraphHandler } from './GraphHandler/GraphHandler.js';
import { TileContent } from './TileContent/TileContent';
import * as dates from '../../utils/dates';
import { ANALYSIS_FEATURES } from '../../utils/charts';
import { DateFeatures } from '../../utils/dateFeatures.js';
import { averageConcurrentTracks } from './average';

// I'm debating with myself whether to include the functionality to be able to select individual songs and currently am siding on the idea that I should hold off. It could be worth a brief experiment. For example if I was able to just pass the trackInfo from a ToolTipContent into a createGraphData and setGraphDatasets it it could be pretty simple. But then what about the toggling functionality? Would I have to add a whole new piece of state for that?

// I think a better solution would be to reuse the selectedTile functionality and just add an option for a 'single track' view or something

// These are possibilities to explore but ultimately I also think I could/should spend this time cleaning up the code I have. Make some quality of life improvements like making getFirstOfMonth and getLastOfMonth helper functions for getViewsDateRange so I'm not using it to get a range when I just need a single day anyway

// To me from the past: If you want to tackle this additional functionality, set a time limit on it. Give yourself an hour to try out the concept. If the simple solutions I've outlined don't seem like they will work, just leave it. We have a solid app right here as it is, it's just rough around the edges. If there's time we can always go back and work on that functionality.

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
            const range = getViewsDateRange(activeStartDate, view);
            tracks = getTracksInRange(range, tracks);
        }

        console.log('updateDatasets tracks', tracks);

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
                setSelectedTile={setSelectedTile}
                selectedTile={selectedTile}
                toggleSelectedTile={toggleSelectedTile}
                toggleSelectedSong={toggleSelectedSong}
            />
        );
    };

    const toggleSelectedTile = function (tileRef, date) {
        if (tileRef.current === selectedTile) {
            setSelectedTile(null);
            const range = getViewsDateRange(date, 'month');
            updateDataSets(range[0], 'month', trackData);
        } else {
            setSelectedTile(tileRef.current);
            updateDataSets(date, 'day', trackData);
        }
    };

    const toggleSelectedSong = function (buttonRef, track) {
        if (buttonRef.current === selectedTile) {
            setSelectedTile(null);
            const range = getViewsDateRange(track[0].added_at, 'month');
            updateDataSets(range[0], 'month', trackData);
        } else {
            setSelectedTile(buttonRef.current);
            console.log('toggleSelectedSong tracks', track);
            updateDataSets(null, 'single_track', track);
        }
    };

    function getViewsDateRange(activeStartDate, view) {
        let startDate = !activeStartDate ? new Date() : activeStartDate;
        startDate = new Date(startDate);
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
        if (view !== 'day' && view !== 'single_track')
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
        console.log(datasets);
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
                    // className={classes.myClass}
                    tileContent={generateTileContent}
                    calendarType="US"
                    onViewChange={handleViewChange}
                    onActiveStartDateChange={handleViewChange}
                    // onChange={onChange}
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
