import { useEffect } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Explorer = function ({ trackData }) {
    useEffect(() => {
        console.log(trackData);
    });

    // const tileContentGenerator = function ({ activeStartDate, date, view }) {
    //     console.log(view);
    //     if (view === 'month' && date.getDay() === 0) {
    //         return <p>It's Sunday!</p>;
    //     } else {
    //         return null;
    //     }
    // };

    const tileContentGeneratorV2 = function ({ activeStartDate, date, view }) {
        console.log(date);
        if (view === 'month') {
            for (let [trackDate, trackInfo] of Object.entries(trackData)) {
                trackDate = new Date(trackDate);
                console.log(trackDate);

                if (isSameDay(date, trackDate)) {
                    return <p>{trackInfo.track.name}</p>;
                }
                //! this return is causing the loop to terminate
            }
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
        // todo
    };

    const isSameYear = function (date1, date2) {
        // todo
    };

    return (
        <>
            <div>Explorer</div>
            <Calendar tileContent={tileContentGeneratorV2} />
        </>
    );
};

export default Explorer;
