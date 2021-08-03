import { DEFAULT_ENABLED_FEATURES } from '../../../utils/charts';
import { Bargraph } from '../Bargraph/Bargraph';
import { Linegraph } from '../../Linegraph/Linegraph';
import { useState } from 'react';

const GraphHandler = function ({ datasets, currentView, selectedDateRange }) {
    const [enabledFeatures, setEnabledFeatures] = useState(
        DEFAULT_ENABLED_FEATURES
    );

    const onLegendHover = function (event, legendItem, legend) {
        // todo Write/reveal explainer on audio feature on hover
    };

    const onLegendClick = function (event, legendItem, legend) {
        const wasHidden = legendItem.hidden;
        const legendItemLabel = legendItem.text;

        if (wasHidden) {
            setEnabledFeatures([...enabledFeatures, legendItemLabel]);
        } else {
            setEnabledFeatures(
                enabledFeatures.filter((el) => el !== legendItemLabel)
            );
        }

        const index = legendItem.datasetIndex;
        const ci = legend.chart;
        if (ci.isDatasetVisible(index)) {
            ci.hide(index);
            legendItem.hidden = true;
        } else {
            ci.show(index);
            legendItem.hidden = false;
        }
    };

    // todo add generalized buildOutDatasets fn

    if (datasets.energy.length !== 1) {
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
        );
    } else {
        return (
            <Bargraph
                dataset={datasets}
                enabledFeatures={enabledFeatures}
                setEnabledFeatures={setEnabledFeatures}
                onLegendClick={onLegendClick}
                onLegendHover={onLegendHover}
            />
        );
    }
};
export { GraphHandler };
