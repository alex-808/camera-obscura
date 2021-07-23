const isSameDay = function (date1, date2) {
    date1 = new Date(date1);
    date2 = new Date(date2);
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getUTCDate() === date2.getUTCDate()
    );
};

const isSameMonth = function (date1, date2) {
    date1 = new Date(date1);
    date2 = new Date(date2);
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth()
    );
};

const isSameYear = function (date1, date2) {
    date1 = new Date(date1);
    date2 = new Date(date2);
    return date1.getFullYear() === date2.getFullYear();
};

const getViewsMethods = function (view) {
    if (view === 'month') return [isSameDay, getDaysInRange, getYearMonthDay];
    if (view === 'year') return [isSameMonth, getMonthsInRange, getYearMonth];
    if (view === 'decade') return [isSameYear, getYearsInRange, getYear];
};

const getDaysInRange = function (startDate, endDate) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    const days = [];
    let currentDate = startDate;
    while (currentDate < endDate) {
        days.push(currentDate);
        const [currentYear, currentMonth, currentDay] =
            getYearMonthDay(currentDate);
        currentDate = new Date(currentYear, currentMonth, currentDay + 1);
    }

    return days;
};

const getMonthsInRange = function (startDate, endDate) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    const months = [];
    let currentDate = startDate;
    while (currentDate < endDate) {
        months.push(currentDate);
        const [currentYear, currentMonth, currentDay] =
            getYearMonthDay(currentDate);
        currentDate = new Date(currentYear, currentMonth + 1, currentDay);
    }

    return months;
};

const getYearsInRange = function (startDate, endDate) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    const months = [];
    let currentDate = startDate;
    while (currentDate < endDate) {
        months.push(currentDate);
        const [currentYear, currentMonth, currentDay] =
            getYearMonthDay(currentDate);
        currentDate = new Date(currentYear + 1, currentMonth, currentDay);
    }

    return months;
};

const generateDateFormatter = function (fn) {
    return function (date) {
        const dates = fn(date);
        if (dates.length < 2) dates.push(0);
        return new Date(...dates);
    };
};

const getYearMonthDay = function (date) {
    date = new Date(date);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getUTCDate();

    return [year, month, day];
};

const getYearMonth = function (date) {
    date = new Date(date);
    const year = date.getFullYear();
    const month = date.getMonth();

    return [year, month];
};

const getYear = function (date) {
    date = new Date(date);
    const year = date.getFullYear();

    return [year];
};

export {
    getDaysInRange,
    getViewsMethods,
    getYearMonthDay,
    generateDateFormatter,
};
