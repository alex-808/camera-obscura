import { DateFeatures } from '../../utils/dateFeatures'
import { ANALYSIS_FEATURES } from '../../utils/charts'

const averageConcurrentTracks = function (tracks, viewMethods) {
  const dateFormatter = viewMethods.getFormatter()
  const comparer = viewMethods.getComparer()

  const bundledTracks = bundleConcurrentTracks(tracks, comparer)
  if (!bundledTracks) return

  const averages = []
  for (let bundle of bundledTracks) {
    const bundleDate = dateFormatter(bundle[0].date)
    if (bundle.length > 1) {
      let avg = averageBundleData(bundle)

      averages.push(new DateFeatures(bundleDate, avg))
    } else {
      averages.push(new DateFeatures(bundleDate, bundle[0].analysisFeatures))
    }
  }
  return averages
}

const bundleConcurrentTracks = function (tracks, comparer) {
  if (!tracks.length) return
  const isSameTimePeriod = comparer
  const bundledTracks = []

  bundledTracks.push([tracks[0]])
  for (let i = 1; i < tracks.length; i++) {
    if (
      isSameTimePeriod(
        tracks[i].date,
        bundledTracks[bundledTracks.length - 1][0].date
      )
    ) {
      bundledTracks[bundledTracks.length - 1].push(tracks[i])
    } else {
      bundledTracks.push([tracks[i]])
    }
  }
  return bundledTracks
}

function averageBundleData(bundle) {
  let sums = {}
  for (let item of bundle) {
    for (let [label, value] of Object.entries(item.analysisFeatures)) {
      if (ANALYSIS_FEATURES.includes(label)) {
        if (!sums[`${label}`]) {
          sums[`${label}`] = value
        } else {
          sums[`${label}`] += value
        }
      }
    }
  }
  let avgs = {}
  for (let [label, value] of Object.entries(sums)) {
    avgs[`${label}`] = value / bundle.length
  }
  return avgs
}

export { averageConcurrentTracks }
