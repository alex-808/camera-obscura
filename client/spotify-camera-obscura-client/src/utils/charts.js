const randomColor = function (r, g, b, a) {
    const red = r || Math.floor(Math.random() * 256);
    const green = g || Math.floor(Math.random() * 256);
    const blue = b || Math.floor(Math.random() * 256);
    const alpha = a || 1;
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

class Dataset {
    constructor(label, data, bgColor, bdrColor, tension) {
        this.label = label || '';
        this.data = data || [];
        this.backgroundColor = bgColor || randomColor();
        this.borderColor = bdrColor || randomColor();
        this.tension = tension || 0.5;
    }
}

const ANALYSIS_FEATURES = [
    'energy',
    'acousticness',
    'danceability',
    'instrumentalness',
    'key',
    'liveness',
    'loudness',
    'mode',
    'speechiness',
    'tempo',
    'time_signature',
    'valence',
];

const CHART_COLORS = [
    'red',
    'green',
    'blue',
    'yellow',
    'orange',
    'purple',
    'pink',
    'black',
    'teal',
    'maroon',
    'brown',
    'grey',
];

const CHART_TYPES = {
    Linegraph: 'linegraph',
    Bargraph: 'bargraph',
};

const buildOutDatasets = function (datasets, type, enabledFeatures) {
    const finalizedDatasets = [];
    let i = 0;
    for (let dataset of datasets) {
        console.log(dataset);
        // if (type === CHART_TYPES.Bargraph) {
        //     dataset = createLineDataset(dataset);
        // } else {
        //     dataset = createBarDataset(dataset);
        // }
        dataset.hidden = !enabledFeatures.includes(dataset.label);
        finalizedDatasets.push(dataset);
        i++;
    }
    return finalizedDatasets;
};

const createBarDataset = function (label, data, datasetIndex) {
    data = data[0].value;
    const dataObj = {
        label: label,
        data: data,
    };
    const dataset = new Dataset(
        label,
        [dataObj],
        CHART_COLORS[datasetIndex],
        CHART_COLORS[datasetIndex]
    );

    return dataset;
};

const createLineDataset = function (label, data, datasetIndex) {
    const dataset = new Dataset(
        label,
        data,
        CHART_COLORS[datasetIndex],
        CHART_COLORS[datasetIndex]
    );
    return dataset;
};

const DEFAULT_ENABLED_FEATURES = ['energy', 'danceability', 'acousticness'];

export {
    randomColor,
    Dataset,
    ANALYSIS_FEATURES,
    DEFAULT_ENABLED_FEATURES,
    CHART_COLORS,
    CHART_TYPES,
    buildOutDatasets,
};
