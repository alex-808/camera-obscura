const TileContent = function ({ date, tracks, setSelectedDateRange }) {
    function hoverTile(date) {
        const start = new Date(date);
        const end = new Date(date);
        // todo will need to create a version for months and years as well
        end.setUTCHours(23, 59, 59, 999);
        console.log([start, end]);
        setSelectedDateRange([start, end]);
    }

    function exitTile() {
        setSelectedDateRange([0, 0]);
    }
    return (
        <div onMouseEnter={hoverTile.bind(null, date)} onMouseOut={exitTile}>
            {tracks.map((trackInfo) => (
                <p key={trackInfo.track.id}>{trackInfo.track.name}</p>
            ))}
        </div>
    );
};

export { TileContent };
