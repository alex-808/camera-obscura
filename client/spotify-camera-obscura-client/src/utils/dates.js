const isSameDay = function (date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getUTCDate() === date2.getUTCDate()
    );
};

const isSameMonth = function (date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth()
    );
};

const isSameYear = function (date1, date2) {
    return date1.getFullYear() === date2.getFullYear();
};

const getDaysInRange = function (startDate, endDate) {
    const days = [];
    let currentDate = startDate;
    let i = 0;
    while (currentDate < endDate) {
        days.push(currentDate);
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getUTCDate();
        currentDate = new Date(currentYear, currentMonth, currentDay + 1);
    }

    return days;
};

export { isSameDay, isSameMonth, isSameYear, getDaysInRange };
