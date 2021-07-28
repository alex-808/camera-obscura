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

const DEFAULT_ENABLED_FEATURES = ['energy', 'danceability', 'acousticness'];

export {
    randomColor,
    Dataset,
    ANALYSIS_FEATURES,
    DEFAULT_ENABLED_FEATURES,
    CHART_COLORS,
};
