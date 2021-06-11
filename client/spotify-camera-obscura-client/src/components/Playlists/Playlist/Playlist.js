function Playlist({ playlist, handleClick }) {
    return (
        <div>
            {playlist.name}
            <input type="checkbox" id={playlist.id} onChange={handleClick} />
        </div>
    );
}

export default Playlist;
