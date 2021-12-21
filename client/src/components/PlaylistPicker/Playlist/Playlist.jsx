function Playlist({ playlist, img, handleClick }) {
    return (
        <div>
            <p>{playlist.name}</p>
            <img src={img} alt={`${playlist.name}`} />
            <input type="checkbox" id={playlist.id} onChange={handleClick} />
        </div>
    );
}

export { Playlist };
