import {
  hideUnusedDatasets,
  CHART_TYPES,
  DEFAULT_ENABLED_FEATURES,
} from '../../../utils/charts'
import { Bargraph } from './Bargraph/Bargraph'
import { Linegraph } from './Linegraph/Linegraph'
import { useState } from 'react'

const GraphHandler = function ({ datasets, currentView, selectedDateRange }) {
  const [enabledFeatures, setEnabledFeatures] = useState(
    DEFAULT_ENABLED_FEATURES
  )

  // This isn't DRY anymore, it's also present in explorer
  const setGraphType = function (datasets) {
    if (datasets[0].data.length !== 1) return CHART_TYPES.Linegraph
    else return CHART_TYPES.Bargraph
  }

  const graphType = setGraphType(datasets)

  // this function just handles hiding/unhiding different legend features now, should be moved or factored out completely
  datasets = hideUnusedDatasets(datasets, enabledFeatures)

  const onLegendHover = function (event, legendItem, legend) {
    // todo Write/reveal explainer on audio feature on hover
  }

  const onLegendClick = function (event, legendItem, legend) {
    const wasHidden = legendItem.hidden
    const legendItemLabel = legendItem.text

    if (wasHidden) {
      setEnabledFeatures([...enabledFeatures, legendItemLabel])
    } else {
      setEnabledFeatures(enabledFeatures.filter(el => el !== legendItemLabel))
    }

    const index = legendItem.datasetIndex
    const ci = legend.chart
    if (ci.isDatasetVisible(index)) {
      ci.hide(index)
      legendItem.hidden = true
    } else {
      ci.show(index)
      legendItem.hidden = false
    }
  }

  if (graphType === CHART_TYPES.Linegraph) {
    return (
      <Linegraph
        datasets={datasets}
        view={currentView}
        selectedDateRange={selectedDateRange}
        enabledFeatures={enabledFeatures}
        setEnabledFeatures={setEnabledFeatures}
        onLegendClick={onLegendClick}
        onLegendHover={onLegendHover}
      />
    )
  } else {
    return (
      <Bargraph
        datasets={datasets}
        enabledFeatures={enabledFeatures}
        setEnabledFeatures={setEnabledFeatures}
        onLegendClick={onLegendClick}
        onLegendHover={onLegendHover}
      />
    )
  }
}
export { GraphHandler }
