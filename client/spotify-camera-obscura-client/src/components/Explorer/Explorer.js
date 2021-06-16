import { useEffect } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Explorer = function ({ trackData }) {
    useEffect(() => {
        console.log('Explored');
        console.log(trackData);
    });

    return (
        <>
            <div>Explorer</div>
            <Calendar defaultView="decade" />
        </>
    );
};

export default Explorer;
