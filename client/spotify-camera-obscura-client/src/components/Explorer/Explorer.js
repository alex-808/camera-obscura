import { useState, React, useEffect } from 'react';
import { Calendar } from 'react-calendar';
import Linegraph from '../Linegraph/Linegraph';
import 'react-calendar/dist/Calendar.css';
import * as dates from '../../utils/dates';

// ! This all needs a big time refactor

const Explorer = function ({ trackData }) {
    const [currentDateRange, setCurrentDateRange] = useState(getDateRange());
    const [currentTracks, setCurrentTracks] = useState(
        getTracksInRange(trackData)
    );

    useEffect(() => {
        console.log(currentDateRange);
    }, [currentDateRange]);

    const tileContentGenerator = function ({ activeStartDate, date, view }) {
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
            // setCurrentTracks(tracks);
            return tracks.map((trackInfo) => <p>{trackInfo.track.name}</p>);
        }
    };

    function getDateRange(props) {
        let startDate = !props ? new Date() : props.activeStartDate;
        let range;
        if (props) {
            if (props.view === 'month') {
                const currentMonth = props.activeStartDate.getMonth();
                const currentYear = startDate.getFullYear();
                range = [
                    new Date(currentYear, currentMonth),
                    new Date(currentYear, currentMonth + 1),
                ];
            }
            if (props.view === 'year') {
                const currentYear = startDate.getFullYear();
                console.log('currentYear', currentYear);
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

        console.log(range);

        return range;
    }

    function updateDateRange(props) {
        // todo make this generic to also update currentTracks
        const range = getDateRange(props);
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
                tracksInRange.push(trackDate);
            }
        }

        return tracksInRange;
    }
    return (
        <>
            <div>Explorer</div>
            <Calendar
                tileContent={tileContentGenerator}
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
