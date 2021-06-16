import { useEffect } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Explorer = function (props) {
    const trackData = [];

    useEffect(() => {
        console.log('Explored');
    });

    return (
        <>
            <div>Explorer</div>
            <Calendar />
        </>
    );
};

export default Explorer;
