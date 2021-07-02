import { useState, React, useEffect } from 'react';
import { Calendar } from 'react-calendar';
import Linegraph from '../Linegraph/Linegraph';
import 'react-calendar/dist/Calendar.css';
import useStyles from './styles';
import * as dates from '../../utils/dates';

const Explorer = function ({ trackData }) {
    const classes = useStyles();
    const defaultDate = { activeStartDate: new Date(), view: 'month' };
    const [currentDateRange, setCurrentDateRange] = useState(
        getDateRange(defaultDate)
    );
    const [currentTracks, setCurrentTracks] = useState(
        getTracksInRange(trackData)
    );

    useEffect(() => {
        setCurrentTracks(getTracksInRange(trackData));
    }, [currentDateRange]);

    const generateTileContent = function ({ activeStartDate, date, view }) {
        if (view === 'month') {
            const tracks = [];
            for (let [trackDate, trackInfo] of Object.entries(trackData)) {
                trackDate = new Date(trackDate);
                if (dates.isSameDay(date, trackDate)) {
                    tracks.push(trackInfo);
                }
            }
            return tracks.map((trackInfo) => <p>{trackInfo.track.name}</p>);
        }
        if (view === 'year') {
            const tracks = [];

            for (let [trackDate, trackInfo] of Object.entries(trackData)) {
                trackDate = new Date(trackDate);
                if (dates.isSameMonth(date, trackDate)) {
                    tracks.push(trackInfo);
                }
            }
            return tracks.map((trackInfo) => <p>{trackInfo.track.name}</p>);
        }
    };

    function getDateRange({ activeStartDate, view }) {
        let startDate = !activeStartDate ? new Date() : activeStartDate;
        console.log(startDate);
        let range;
        if (view) {
            if (view === 'month') {
                const currentMonth = activeStartDate.getMonth();
                const currentYear = startDate.getFullYear();
                range = [
                    new Date(currentYear, currentMonth),
                    new Date(currentYear, currentMonth + 1),
                ];
            }
            if (view === 'year') {
                const currentYear = startDate.getFullYear();
                range = [
                    new Date(currentYear, 0),
                    new Date(currentYear + 1, 0),
                ];
            }
            // todo Add decade and century views
        } else {
            const currentMonth = startDate.getMonth();
            const currentYear = startDate.getFullYear();
            range = [
                new Date(currentYear, currentMonth),
                new Date(currentYear, currentMonth + 1),
            ];
        }

        return range;
    }

    function updateDateRange(props) {
        // todo make this generic to also update currentTracks
        const date = props ? props : defaultDate;
        const range = getDateRange(date);
        setCurrentDateRange(range);
    }

    function getTracksInRange(tracks) {
        const tracksInRange = [];
        for (let [trackDate, trackInfo] of Object.entries(tracks)) {
            trackDate = new Date(trackDate);
            if (
                trackDate > currentDateRange[0] &&
                trackDate < currentDateRange[currentDateRange.length - 1]
            ) {
                tracksInRange.push(trackInfo);
            }
        }

        return tracksInRange;
    }
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
            {/* Get start and end dates for the particular calendar view and pass all that data to linegraph */}
            <Linegraph
                dateRange={currentDateRange}
                currentTracks={currentTracks}
            />
        </>
    );
};

export default Explorer;
