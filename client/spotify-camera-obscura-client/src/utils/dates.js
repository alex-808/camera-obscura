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
    if (view === 'month') return [isSameDay, getDaysInRange];
    if (view === 'year') return [isSameMonth, getMonthsInRange];
    if (view === 'decade') return [isSameYear, getYearsInRange];
};

const getDaysInRange = function (startDate, endDate) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    const days = [];
    let currentDate = startDate;
    while (currentDate < endDate) {
        days.push(currentDate);
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getUTCDate();
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
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getUTCDate();
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
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getUTCDate();
        currentDate = new Date(currentYear + 1, currentMonth, currentDay);
    }

    return months;
};

export { isSameDay, isSameMonth, isSameYear, getDaysInRange, getViewsMethods };
