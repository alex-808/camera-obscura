const ToolTipContent = function ({ tracks }) {
    function onClick(e) {
        console.log('click');
    }
    return (
        <>
            {tracks.map((trackInfo) => (
                <button key={trackInfo.track.id} onClick={onClick}>
                    <i>{trackInfo.track.name}</i> by{' '}
                    {trackInfo.track.artists[0].name}
                </button>
            ))}
        </>
    );
};

export { ToolTipContent };
