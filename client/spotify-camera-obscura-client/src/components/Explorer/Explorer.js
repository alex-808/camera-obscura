import { useEffect, React } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Explorer = function ({ trackData }) {
    useEffect(() => {
        console.log(trackData);
    });

    const tileContentGenerator = function ({ activeStartDate, date, view }) {
        if (view === 'month') {
            const tracks = [];
            for (let [trackDate, trackInfo] of Object.entries(trackData)) {
                trackDate = new Date(trackDate);
                if (isSameDay(date, trackDate)) {
                    tracks.push(trackInfo.track.name);
                }
            }

            return tracks.map((track) => <p>{track}</p>);
        }
        if (view === 'year') {
            const tracks = [];

            for (let [trackDate, trackInfo] of Object.entries(trackData)) {
                trackDate = new Date(trackDate);
                if (isSameMonth(date, trackDate)) {
                    tracks.push(trackInfo.track.name);
                }
            }
            return tracks.map((track) => <p>{track}</p>);
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

    return (
        <>
            <div>Explorer</div>
            <Calendar tileContent={tileContentGenerator} calendarType="US" />
        </>
    );
};

export default Explorer;
