import { useState } from 'react';
import { Calendar } from '../Calendar.jsx';
import { GraphHandler } from './GraphHandler/GraphHandler';
import { Header } from '../Header/Header.jsx';
import * as dates from '../../utils/dates';
import {
  ANALYSIS_FEATURES,
  Dataset,
  CHART_TYPES,
  CHART_COLORS,
} from '../../utils/charts';
import { DateFeatures } from '../../utils/dateFeatures.js';
import { averageConcurrentTracks } from './average';

// ! Dates and times are relative to the user's current timezone
const Explorer = function ({ trackData }) {
  const defaultDate = { activeStartDate: new Date(), view: 'month' };

  const [selectedDateRange, setSelectedDateRange] = useState();
  const [graphDatasets, setGraphDatasets] = useState(
    createEmptyDataSets(ANALYSIS_FEATURES)
  );
  const [currentView, setCurrentView] = useState(defaultDate.view);

  function updateDataSets(activeStartDate, view, tracks) {
    if (view !== 'single_track') {
      const range = dates.getViewsDateRange(activeStartDate, view);
      tracks = getTracksInRange(range, tracks);
    }

    const { datasets } = createGraphData(tracks, view);
    setCurrentView(view);
    setGraphDatasets(datasets);
  }

  function getTracksInRange(dateRange, tracks) {
    const tracksInRange = [];
    for (let [trackDate, trackInfo] of Object.entries(tracks)) {
      trackDate = new Date(trackDate);
      if (trackDate >= dateRange[0] && trackDate < dateRange[1]) {
        tracksInRange.push(trackInfo);
      }
    }

    return tracksInRange;
  }

  function createGraphData(tracks, view) {
    if (!tracks) return { datasets: null };

    let dateFeatures = convertTracksToDateFeatures(tracks);

    if (view !== 'day' && view !== 'single_track') {
      const viewMethods = new dates.ViewMethods(view);
      dateFeatures = averageConcurrentTracks(dateFeatures, viewMethods || []);
    }

    const datasets = createGraphTypeDatasets(dateFeatures);

    return { datasets: datasets };
  }

  function createGraphTypeDatasets(dateFeatures) {
    const graphType = getGraphType(dateFeatures);
    const datasets = createEmptyDataSets(ANALYSIS_FEATURES);
    for (let dateFeature of dateFeatures) {
      let trackDate = new Date(dateFeature.date);
      for (let dataset of datasets) {
        if (graphType === CHART_TYPES.Linegraph) {
          dataset.data.push({
            date: trackDate,
            value: dateFeature.analysisFeatures[`${dataset.label}`],
          });
        } else {
          dataset.data.push({
            label: dataset.label,
            value: dateFeature.analysisFeatures[`${dataset.label}`],
          });
        }
      }
    }
    return datasets;
  }

  const getGraphType = function (dateFeatures) {
    if (dateFeatures.length !== 1) return CHART_TYPES.Linegraph;
    else return CHART_TYPES.Bargraph;
  };

  function convertTracksToDateFeatures(tracks) {
    return tracks.map(
      (trackInfo) =>
        new DateFeatures(trackInfo.added_at, trackInfo.analysis_features)
    );
  }

  function createEmptyDataSets(labels) {
    const datasets = [];
    let i = 0;
    for (let label of labels) {
      datasets.push(new Dataset(label, [], CHART_COLORS[i], CHART_COLORS[i]));
      i++;
    }
    return datasets;
  }

  if (graphDatasets) {
    return (
      <>
        <Header />
        <GraphHandler
          datasets={graphDatasets}
          currentView={currentView}
          selectedDateRange={selectedDateRange}
        />
        <Calendar
          trackData={trackData}
          setSelectedDateRange={setSelectedDateRange}
          updateDataSets={updateDataSets}
        />
      </>
    );
  } else {
    return <>Loading</>;
  }
};

export { Explorer };
