import { useState } from 'react'
import { Calendar as ReactCalendar } from 'react-calendar'
import { TileContent } from './Explorer/TileContent/TileContent'
import * as dates from '../utils/dates'
import 'react-calendar/dist/Calendar.css'

const Calendar = ({ trackData, setSelectedDateRange, updateDataSets }) => {
  const [selectedTile, setSelectedTile] = useState()

  const generateTileContent = function ({ activeStartDate, view, date }) {
    const tracks = []
    // todo Optimize this, we shouldn't have to go thru every single track on every render. Maybe bring back the currentTracks state
    const viewMethods = new dates.ViewMethods(view)
    const range = dates.getViewsDateRange(activeStartDate, view)
    const isSameTimePeriod = viewMethods.getComparer()

    for (let [trackDate, trackInfo] of Object.entries(trackData)) {
      trackDate = new Date(trackDate)
      if (
        isSameTimePeriod(date, trackDate) &&
        trackDate >= range[0] &&
        trackDate <= range[1]
      ) {
        tracks.push(trackInfo)
      }
    }

    return (
      <TileContent
        date={date}
        tracks={tracks}
        setSelectedDateRange={setSelectedDateRange}
        selectedTile={selectedTile}
        toggleSelectedTile={toggleSelectedTile}
        toggleSelectedSong={toggleSelectedSong}
      />
    )
  }

  const toggleSelectedTile = function (tileRef, date) {
    if (tileRef.current === selectedTile) {
      setSelectedTile(null)
      const range = dates.getViewsDateRange(date, 'month')
      updateDataSets(range[0], 'month', trackData)
    } else {
      setSelectedTile(tileRef.current)
      updateDataSets(date, 'day', trackData)
    }
  }

  const toggleSelectedSong = function (buttonRef, track) {
    if (buttonRef.current === selectedTile) {
      setSelectedTile(null)
      const range = dates.getViewsDateRange(track[0].added_at, 'month')
      updateDataSets(range[0], 'month', trackData)
    } else {
      setSelectedTile(buttonRef.current)
      updateDataSets(null, 'single_track', track)
    }
  }

  const handleViewChange = function ({ activeStartDate, view }) {
    updateDataSets(activeStartDate, view, trackData)
  }

  const onClick = props => {
    console.log(props)
  }

  return (
    <ReactCalendar
      tileContent={generateTileContent}
      calendarType="US"
      onViewChange={handleViewChange}
      onActiveStartDateChange={handleViewChange}
      minDetail={'decade'}
      onClick={onClick}
      value={new Date()}
    />
  )
}

export { Calendar }
