import { useRef } from 'react'

const ToolTipContent = function ({ tracks, toggleSelectedSong }) {
  const buttonRef = useRef()
  function handleClick(buttonRef, trackInfo) {
    toggleSelectedSong(buttonRef, [trackInfo])
  }

  return (
    <>
      {tracks.map(trackInfo => (
        <button
          key={trackInfo.track.id}
          onClick={handleClick.bind(null, buttonRef, trackInfo)}
          ref={buttonRef}
        >
          <p>
            <i>{trackInfo.track.name}</i> by {trackInfo.track.artists[0].name}
          </p>
        </button>
      ))}
    </>
  )
}

export { ToolTipContent }
