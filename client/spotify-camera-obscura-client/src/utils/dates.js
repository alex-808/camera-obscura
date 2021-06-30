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

export { isSameDay, isSameMonth, isSameYear };
