import { useEffect, useState, useRef, React } from 'react';
import { Calendar } from 'react-calendar';
import Linegraph from '../Linegraph/Linegraph';
import 'react-calendar/dist/Calendar.css';

const Explorer = function ({ trackData }) {
    const [currentTracks, setCurrentTracks] = useState(0);
    const [currentDateRange, setCurrentDateRange] = useState(0);

    useEffect(() => {
        getDateRange();
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

    const getDateRange = function (props) {
        console.log('props', props);

        let startDate = !props ? new Date() : props.activeStartDate;
        if (props) {
            if (props.view === 'month') {
                const currentMonth = startDate.getMonth();
                const currentYear = startDate.getFullYear();
                const range = [
                    new Date(currentYear, currentMonth),
                    new Date(currentYear, currentMonth + 1),
                ];
                console.log(range);
                setCurrentDateRange(range);
            }
            if (props.view === 'year') {
                const currentYear = startDate.getFullYear();
                console.log('currentYear', currentYear);
                const range = [
                    new Date(currentYear, 0),
                    new Date(currentYear + 1, 0),
                ];
                console.log(range);
                setCurrentDateRange(range);
            }
        } else {
            const currentMonth = startDate.getMonth();
            const currentYear = startDate.getFullYear();
            const range = [
                new Date(currentYear, currentMonth),
                new Date(currentYear, currentMonth + 1),
            ];
            console.log(range);
            setCurrentDateRange(range);
        }
    };

    return (
        <>
            <div>Explorer</div>
            <Calendar
                tileContent={tileContentGenerator}
                calendarType="US"
                // view="month"
                activeStartDate={currentDateRange[0]}
                onViewChange={getDateRange}
                onActiveStartDateChange={getDateRange}
            />
            {/* Get start and end dates for the particular calendar view and pass all that data to linegraph */}
            <Linegraph dateRange={currentDateRange} />
        </>
    );
};

export default Explorer;
