import { useEffect, useState, useRef, React } from 'react';
import { Calendar } from 'react-calendar';
import Linegraph from '../Linegraph/Linegraph';
import 'react-calendar/dist/Calendar.css';

// ! This all needs a big time refactor

const Explorer = function ({ trackData }) {
    console.log(trackData);
    const [currentDateRange, setCurrentDateRange] = useState(getDateRange());
    const [currentTracks, setCurrentTracks] = useState(
        getTracksInRange(trackData)
    );

    useEffect(() => {
        // let range = getDateRange();
        // setCurrentDateRange(range);
        // console.log('currentDateRange', currentDateRange);
        // getTracksInRange(trackData);
    }, []);

    const tileContentGenerator = function ({ activeStartDate, date, view }) {
        if (view === 'month') {
            const tracks = [];
            for (let [trackDate, trackInfo] of Object.entries(trackData)) {
                trackDate = new Date(trackDate);
                if (isSameDay(date, trackDate)) {
                    tracks.push(trackInfo);
                }
            }
            return tracks.map((trackInfo) => <p>{trackInfo.track.name}</p>);
        }
        if (view === 'year') {
            const tracks = [];

            for (let [trackDate, trackInfo] of Object.entries(trackData)) {
                trackDate = new Date(trackDate);
                if (isSameMonth(date, trackDate)) {
                    tracks.push(trackInfo);
                }
            }
            // setCurrentTracks(tracks);
            return tracks.map((trackInfo) => <p>{trackInfo.track.name}</p>);
        }
    };

    const isSameDay = function (date1, date2) {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getUTCDate() === date2.getUTCDate()
        );
    };

    const isSameMonth = function (date1, date2) {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth()
        );
    };

    const isSameYear = function (date1, date2) {
        return date1.getFullYear() === date2.getFullYear();
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
                console.log(range);
            }
            if (props.view === 'year') {
                const currentYear = startDate.getFullYear();
                console.log('currentYear', currentYear);
                range = [
                    new Date(currentYear, 0),
                    new Date(currentYear + 1, 0),
                ];
                console.log(range);
            }
        } else {
            const currentMonth = startDate.getMonth();
            const currentYear = startDate.getFullYear();
            range = [
                new Date(currentYear, currentMonth),
                new Date(currentYear, currentMonth + 1),
            ];
            console.log(range);
        }

        return range;
    }

    function updateDateRange(props) {
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
                // view="month"
                // activeStartDate={currentDateRange[0]}
                onViewChange={updateDateRange}
                onActiveStartDateChange={updateDateRange}
            />
            {/* Get start and end dates for the particular calendar view and pass all that data to linegraph */}
            <Linegraph dateRange={currentDateRange} />
        </>
    );
};

export default Explorer;
