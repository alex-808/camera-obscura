const ToolTipContent = function ({ tracks }) {
    function onClick(addedAt, e) {
        console.log(addedAt);
        e.stopPropagation();
    }
    return (
        <>
            {tracks.map((trackInfo) => (
                <button
                    key={trackInfo.track.id}
                    onClick={onClick.bind(null, trackInfo.added_at)}
                    addedAt={trackInfo.addedAt}
                >
                    <i>{trackInfo.track.name}</i> by{' '}
                    {trackInfo.track.artists[0].name}
                </button>
            ))}
        </>
    );
};

export { ToolTipContent };
