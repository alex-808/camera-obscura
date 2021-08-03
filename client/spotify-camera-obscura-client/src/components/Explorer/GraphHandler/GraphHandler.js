import { DEFAULT_ENABLED_FEATURES } from '../../../utils/charts';
import { Bargraph } from '../Bargraph/Bargraph';
import { Linegraph } from '../../Linegraph/Linegraph';
import { useState } from 'react';

const GraphHandler = function ({ datasets, currentView, selectedDateRange }) {
    const [enabledFeatures, setEnabledFeatures] = useState(
        DEFAULT_ENABLED_FEATURES
    );

    // todo add generalized buildOutDatasets fn

    if (datasets.energy.length !== 1) {
        return (
            <Linegraph
                datasets={datasets}
                view={currentView}
                selectedDateRange={selectedDateRange}
            />
        );
    } else {
        return <Bargraph dataset={datasets} />;
    }
};
export { GraphHandler };
