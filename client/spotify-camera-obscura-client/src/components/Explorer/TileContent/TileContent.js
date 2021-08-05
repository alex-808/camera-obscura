import { Tooltip } from '@material-ui/core';
import { ToolTipContent } from './ToolTipContent/ToolTipContent';
import { useRef } from 'react';

const TileContent = function ({
    date,
    tracks,
    setSelectedDateRange,
    selectedTile,
    toggleSelectedTile,
    toggleSelectedSong,
}) {
    const tileRef = useRef();

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

    function calcBGColor() {
        const color = selectedTile === tileRef.current ? 'blue' : 'yellow';

        return { backgroundColor: color };
    }

    function handleClick(e, props) {
        toggleSelectedTile(tileRef, date);
    }
    return (
        <Tooltip
            ref={tileRef}
            interactive={true}
            arrow={true}
            title={
                <ToolTipContent
                    tracks={tracks}
                    toggleSelectedSong={toggleSelectedSong}
                />
            }
        >
            <div
                onMouseEnter={hoverTile.bind(null, date)}
                onMouseLeave={exitTile}
                style={calcBGColor()}
                onClick={handleClick}
            >
                <i>{tracks.length ? tracks.length + ' songs' : ''}</i>
            </div>
        </Tooltip>
    );
};

export { TileContent };
