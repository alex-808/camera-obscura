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

// Todo group these together by what will have the most similar values. For example, looking at tempo and energy at the same time is useless
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
  '#F786A4',
  '#6AD9BB',
  '#250D70',
  '#F20F4B',
  '#5D35DE',
  '#660F2B',
  '#30161F',
  '#0D0F04',
  '#BFB6DB',
  '#C4ADB3',
  'brown',
  'grey',
];

const CHART_TYPES = {
  Linegraph: 'linegraph',
  Bargraph: 'bargraph',
};

const hideUnusedDatasets = function (datasets, enabledFeatures) {
  for (let dataset of datasets) {
    dataset.hidden = !enabledFeatures.includes(dataset.label);
    // dataset.fill = '+1';
  }
  return datasets;
};

const DEFAULT_ENABLED_FEATURES = ['energy', 'danceability', 'acousticness'];

export {
  randomColor,
  Dataset,
  ANALYSIS_FEATURES,
  DEFAULT_ENABLED_FEATURES,
  CHART_COLORS,
  CHART_TYPES,
  hideUnusedDatasets,
};
