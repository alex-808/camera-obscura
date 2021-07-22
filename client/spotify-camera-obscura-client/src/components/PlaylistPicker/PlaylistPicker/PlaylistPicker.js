import placeholder from '../../../imgs/logo192.png';

function Playlist({ playlist, handleClick }) {
    const [image] = playlist.images.filter((el, i) => i === 0);

    return (
        <div>
            <p>{playlist.name}</p>
            <img
                src={image ? image.url : placeholder}
                alt={`${playlist.name}`}
            />
            <input type="checkbox" id={playlist.id} onChange={handleClick} />
        </div>
    );
}

export default Playlist;
