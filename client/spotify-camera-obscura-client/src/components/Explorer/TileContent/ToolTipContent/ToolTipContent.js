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
                >
                    <p>
                        <i>{trackInfo.track.name}</i> by{' '}
                        {trackInfo.track.artists[0].name}
                    </p>
                </button>
            ))}
        </>
    );
};

export { ToolTipContent };
