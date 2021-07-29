import { Tooltip } from '@material-ui/core';
import { ToolTipContent } from './CalendarToolTip/ToolTipContent';

const TileContent = function ({ date, tracks, setSelectedDateRange }) {
    function hoverTile(date) {
        const start = new Date(date);
        const end = new Date(date);
        // todo will need to create a version for months and years as well
        end.setUTCHours(23, 59, 59, 999);
        setSelectedDateRange([start, end]);
    }

    function exitTile() {
        setSelectedDateRange([0, 0]);
    }

    function hoverToolTip() {
        console.log('hovered');
    }
    return (
        <Tooltip
            interactive={true}
            arrow={true}
            title={<ToolTipContent tracks={tracks} />}
        >
            <div
                onMouseEnter={hoverTile.bind(null, date)}
                onMouseLeave={exitTile}
            >
                <i>{tracks.length ? tracks.length + ' songs' : ''}</i>
            </div>
        </Tooltip>
    );
};

export { TileContent };
