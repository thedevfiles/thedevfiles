const _ = require("lodash");
const { DateTime } = require("luxon");
const site = require("../src/_data/site");

const parseDate = (value) => {
    let date;
    if (value instanceof Date) {
        date = DateTime.fromJSDate(value);
    } else if (value instanceof DateTime) {
        date = value;
    } else if (value === "now") {
        date = DateTime.utc();
    } else if (_.isString(value)) {
        date = DateTime.fromISO(value, { zone: 'UTC' });
    } else {
        return null;
    }
    return date.setLocale(site.locale).setZone('UTC');
}

const dateToISO = (value) => {
    let date = parseDate(value);
    if (!date) {
        return '';
    }

    return date.toISO();
};

const yearFilter = (value = null) => {
    let date = parseDate(value);
    if (!date) {
        return '';
    }

    return date.toFormat('yyyy');
};

const monthFilter = (value = null) => {
    let date = parseDate(value);
    if (!date) {
        return '';
    }

    return date.toFormat('MM');
};

const dateFilter = (value, format = 'local') => {
    let date = parseDate(value);
    if (!date) {
        return '';
    }

    if (format === 'localdate') {
        return date.toLocaleString();
    }
    if (format === 'longdate') {
        return date.toLocaleString({
            year: 'numeric',
            month: 'long',
            day: '2-digit'
        });
    }
    if (format === 'year') {
        return date.toLocaleString({
            year: 'numeric',
        });
    }
    if (format === 'monthname') {
        return date.toLocaleString({
            month: 'long',
        });
    }
    if (format === 'short') {
        return date.toLocaleString({
            month: 'short',
            day: '2-digit'
        });
    }
    if (format === 'localtime') {
        return date.toLocaleString(DateTime.TIME_SIMPLE);
    }
    if (format === 'local') {
        return date.toLocaleString(DateTime.DATETIME_SHORT);
    }
    if (format === 'iso') {
        return date.toISO();
    }

    return date.toFormat(format);
};




module.exports = {
    parseDate, yearFilter, monthFilter, dateFilter, dateToISO
}
