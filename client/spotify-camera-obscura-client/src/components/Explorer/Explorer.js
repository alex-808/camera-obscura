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

        for (let i = 0; i < days.length; i++) {
            for (let track of tracks) {
                let trackDate = new Date(track.added_at);
                if (dates.isSameDay(trackDate, days[i])) {
                    for (let [label, dataset] of Object.entries(datasets)) {
                        dataset.push(track.analysis_features[`${label}`]);
                    }
                }
            }
            for (let [, array] of Object.entries(datasets)) {
                if (array.length === i) array.push(null);
            }
        }
        return { labels: days, datasets: datasets };
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
