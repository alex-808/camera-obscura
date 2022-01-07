import { Bar } from 'react-chartjs-2'

const Bargraph = function ({
  datasets,
  enabledFeatures,
  onLegendClick,
  onLegendHover,
}) {
  console.log(datasets)

  const removeDeselectedXLabels = () => {
    datasets = datasets.filter(dataset =>
      enabledFeatures.includes(dataset.label)
    )
  }

  //removeDeselectedXLabels()

  const data = {
    datasets: datasets,
  }

  const options = {
    animation: true,
    parsing: {
      xAxisKey: 'label',
      yAxisKey: 'value',
    },
    plugins: {
      legend: {
        onHover: onLegendHover,
        onClick: onLegendClick,
      },
    },
    scales: {
      xAxes: {
        ticks: {
          // could be used to hide x-axis labels but not clear out space
          //
          //callback: function (value, index, values) {
          //return index % 3 === 0 ? this.getLabelForValue(value) : ''
          //},
        },
      },
    },
  }
  return <Bar data={data} options={options} />
}

export { Bargraph }
