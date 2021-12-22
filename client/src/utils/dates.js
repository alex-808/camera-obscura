const isExactSameTime = function (date1, date2) {
  date1 = new Date(date1)
  date2 = new Date(date2)
  return date1.getTime() === date2.getTime()
}

const isSameDay = function (date1, date2) {
  date1 = new Date(date1)
  date2 = new Date(date2)
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const isSameMonth = function (date1, date2) {
  date1 = new Date(date1)
  date2 = new Date(date2)
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  )
}

const isSameYear = function (date1, date2) {
  date1 = new Date(date1)
  date2 = new Date(date2)
  return date1.getFullYear() === date2.getFullYear()
}

// todo I'd like to create a static class out of this:

const getViewsMethods = function (view) {
  // todo fix this so we aren't accidentally calling a function not there
  if (view === 'day') return [isExactSameTime, generateDateFormatter(Date)]
  if (view === 'month')
    return [isSameDay, generateDateFormatter(getYearMonthDay)]
  if (view === 'year') return [isSameMonth, generateDateFormatter(getYearMonth)]
  if (view === 'decade') return [isSameYear, generateDateFormatter(getYear)]
}

class ViewMethods {
  constructor(view) {
    this.view = view
  }

  getFormatter = function () {
    switch (this.view) {
      case 'day':
        return generateDateFormatter(Date)
      case 'month':
        return generateDateFormatter(getYearMonthDay)
      case 'year':
        return generateDateFormatter(getYearMonth)
      case 'decade':
        return generateDateFormatter(getYear)
      default:
        throw new Error('No view provided to class')
    }
  }

  getComparer = function () {
    switch (this.view) {
      case 'day':
        return isExactSameTime
      case 'month':
        return isSameDay
      case 'year':
        return isSameMonth
      case 'decade':
        return isSameYear
      default:
        throw new Error('No view provided to class')
    }
  }
}

const getDaysInRange = function (startDate, endDate) {
  startDate = new Date(startDate)
  endDate = new Date(endDate)
  const days = []
  let currentDate = startDate
  while (currentDate < endDate) {
    days.push(currentDate)
    const [currentYear, currentMonth, currentDay] = getYearMonthDay(currentDate)
    currentDate = new Date(currentYear, currentMonth, currentDay + 1)
  }

  return days
}

const getMonthsInRange = function (startDate, endDate) {
  startDate = new Date(startDate)
  endDate = new Date(endDate)
  const months = []
  let currentDate = startDate
  while (currentDate < endDate) {
    months.push(currentDate)
    const [currentYear, currentMonth, currentDay] = getYearMonthDay(currentDate)
    currentDate = new Date(currentYear, currentMonth + 1, currentDay)
  }

  return months
}

const getYearsInRange = function (startDate, endDate) {
  startDate = new Date(startDate)
  endDate = new Date(endDate)
  const months = []
  let currentDate = startDate
  while (currentDate < endDate) {
    months.push(currentDate)
    const [currentYear, currentMonth, currentDay] = getYearMonthDay(currentDate)
    currentDate = new Date(currentYear + 1, currentMonth, currentDay)
  }

  return months
}

const generateDateFormatter = function (fn) {
  return function (date) {
    const dates = fn(date)
    if (dates.length < 2) dates.push(0)
    return new Date(...dates)
  }
}

const getYearMonthDay = function (date) {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()

  return [year, month, day]
}

const getYearMonth = function (date) {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth()

  return [year, month]
}

const getYear = function (date) {
  date = new Date(date)
  const year = date.getFullYear()

  return [year]
}

function getViewsDateRange(activeStartDate, view) {
  let startDate = !activeStartDate ? new Date() : activeStartDate
  startDate = new Date(startDate)
  const currentMonth = startDate.getMonth()
  const currentYear = startDate.getFullYear()
  const currentDay = startDate.getUTCDate()
  let range
  if (view) {
    if (view === 'day') {
      range = [
        new Date(currentYear, currentMonth, currentDay),
        new Date(currentYear, currentMonth, currentDay + 1),
      ]
    }
    if (view === 'month') {
      range = [
        new Date(currentYear, currentMonth),
        new Date(currentYear, currentMonth + 1),
      ]
    }
    if (view === 'year') {
      range = [new Date(currentYear, 0), new Date(currentYear + 1, 0)]
    }
    if (view === 'decade') {
      range = [new Date(currentYear, 0), new Date(currentYear + 10, 0)]
    }
  } else {
    range = [
      new Date(currentYear, currentMonth),
      new Date(currentYear, currentMonth + 1),
    ]
  }
  return range
}

const getNextDay = () => {}
const getNextMonth = () => {}
const getNextYear = () => {}
const getNextDecade = () => {}

export {
  getViewsMethods,
  getViewsDateRange,
  getYearMonthDay,
  generateDateFormatter,
  ViewMethods,
}
