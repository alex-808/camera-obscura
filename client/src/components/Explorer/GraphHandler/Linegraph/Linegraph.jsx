import { useEffect, useRef } from 'react'
import * as dateUtils from '../../../../utils/dates'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-luxon'

const Linegraph = function ({
  datasets,
  view,
  selectedDateRange = [0, 0],
  enabledFeatures,
  onLegendClick,
  onLegendHover,
}) {
  const chartRef = useRef()
  const data = {
    datasets: datasets,
  }

  useEffect(() => {
    const viewMethods = new dateUtils.ViewMethods(view)
    const chart = chartRef.current
    // This useEffect allows a hover on calendar to highlight the same
    // day on chart via change in selectedDateRange prop

    function updateSelectedElements(chart) {
      if (!chart) return
      let datasets = chart.data.datasets
      const isSameTimePeriod = viewMethods.getComparer()

      const selectedIndex = datasets[0].data.findIndex(el => {
        return isSameTimePeriod(el.date, selectedDateRange[0])
      })

      if (selectedDateRange[0] === 0 || selectedIndex === -1) {
        disableAllElements(chart)
      } else {
        activateSelectedElements(chart, selectedIndex)
      }
      chart.render()
    }

    function activateSelectedElements(chart, selectedIndex) {
      const activeElements = []
      const n = Object.entries(datasets).length
      for (let i = 0; i < n; i++) {
        if (enabledFeatures.includes(datasets[i].label)) {
          activeElements.push({
            datasetIndex: i,
            index: selectedIndex,
          })
        }
      }
      if (!activeElements.length) return
      chart.setActiveElements(activeElements)
      chart.tooltip.setActiveElements(activeElements)
    }

    function disableAllElements(chart) {
      chart.setActiveElements([])
      chart.tooltip.setActiveElements([])
    }

    updateSelectedElements(chart)
  }, [selectedDateRange, datasets, enabledFeatures, view])

  const setupOpts = function (view, opts) {
    const viewTooltipFormats = {
      day: {
        tooltipFormat: 'DD ttt',
        tickUnit: 'hour',
      },
      month: {
        tooltipFormat: 'DD',
        tickUnit: 'day',
      },
      year: { tooltipFormat: 'MMM yyyy', tickUnit: 'month' },
      decade: { tooltipFormat: 'yyyy', tickUnit: 'year' },
    }

    opts.scales.xAxes.time.tooltipFormat =
      viewTooltipFormats[`${view}`].tooltipFormat
    opts.scales.xAxes.time.unit = viewTooltipFormats[`${view}`].tickUnit

    return opts
  }

  let options = {
    animation: false,
    parsing: {
      xAxisKey: 'date',
      yAxisKey: 'value',
    },
    responsive: true,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      yAxes: {
        ticks: {
          beginAtZero: true,
          font: {
            family: 'Roboto',
            size: 10,
          },
        },
      },

      xAxes: {
        type: 'time',
        time: {
          tooltipFormat: 'MMMM yy',
          unit: 'month',
        },
        ticks: {
          beginAtZero: true,
          font: {
            family: 'Roboto',
            size: 16,
          },
        },
      },
    },
    plugins: {
      legend: {
        onHover: onLegendHover,
        onClick: onLegendClick,
        position: 'bottom',
        align: 'start',
        labels: {
          font: {
            family: 'Roboto',
            size: 16,
          },
          boxWidth: 40,
          boxHeight: 40,
          usePointStyle: true,
        },
      },
    },

    spanGaps: true,
    elements: {
      point: {
        borderWidth: 5,
      },
      line: {
        borderWidth: 2,
      },
    },
  }

  options = setupOpts(view, options)

  const onClick = function (props) {
    console.log(props)
  }

  return (
    <>
      <Line
        ref={chartRef}
        data={data}
        options={options}
        getElementAtEvent={onClick}
      />
    </>
  )
}

export { Linegraph }
