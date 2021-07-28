import * as dates from '../utils/dates';
import { DateFeatures } from '../utils/dateFeatures';
import { ANALYSIS_FEATURES } from '../utils/charts';

const averageConcurrentTracks = function (tracks, view) {
    const bundledTracks = bundleConcurrentTracks(tracks, view);
    const [_, dateFormatter] = dates.getViewsMethods(view);
    if (!bundledTracks) return;
    const averages = [];
    for (let bundle of bundledTracks) {
        const date = dateFormatter(bundle[0].date);
        if (bundle.length > 1) {
            let avg = averageBundleData(bundle);

            averages.push(new DateFeatures(date, avg));
        } else {
            averages.push(new DateFeatures(date, bundle[0].analysisFeatures));
        }
    }
    return averages;
};

const bundleConcurrentTracks = function (tracks, view) {
    if (!tracks.length) return;
    const [isSameTimePeriod] = dates.getViewsMethods(view);
    const bundles = [];
    bundles.push([tracks[0]]);
    for (let i = 1; i < tracks.length; i++) {
        if (
            isSameTimePeriod(
                tracks[i].date,
                bundles[bundles.length - 1][0].date
            )
        ) {
            bundles[bundles.length - 1].push(tracks[i]);
        } else {
            bundles.push([tracks[i]]);
        }
    }
    return bundles;
};

function averageBundleData(bundle) {
    let sums = {};
    for (let item of bundle) {
        for (let [label, value] of Object.entries(item.analysisFeatures)) {
            if (ANALYSIS_FEATURES.includes(label)) {
                if (!sums[`${label}`]) {
                    sums[`${label}`] = value;
                } else {
                    sums[`${label}`] += value;
                }
            }
        }
    }
    let avgs = {};
    for (let [label, value] of Object.entries(sums)) {
        avgs[`${label}`] = value / bundle.length;
    }
    return avgs;
}

export { averageConcurrentTracks };
