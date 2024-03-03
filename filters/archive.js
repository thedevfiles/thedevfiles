const _ = require('lodash');
const parseDate = require('./date').parseDate;
let archive = [];
let computed = false;
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function archiveFilter(posts) {
    if (computed) return archive;
    posts.map(post => {
        let date = parseDate(post.data.date);

        return {
            date: date.toISODate(),
            monthname: date.toFormat('LLLL'),
            year: date.toFormat('yyyy'),
            month: date.toFormat('LL'),
        };
    }).sort((a, b) => {
        if (a.date === b.date) return 0;
        if (a.date < b.date) return 1;
        return -1;
    }).forEach(date => {
        let yindex = archive.findIndex(a => a.year === date.year);
        let year, month;
        if (yindex === -1) {
            year = {year: date.year, count: 0, months: []};
            archive.push(year);
            yindex = archive.length - 1;
        }

        let mindex = archive[yindex].months.findIndex(m => m.month === date.month);
        if (mindex === -1) {
            month = {month: date.month, name: date.monthname, count: 0};
            archive[yindex].months.push(month);
            mindex = archive[yindex].months.length - 1;
        }

        archive[yindex].count++;
        archive[yindex].months[mindex].count++;
    });

    computed = true;
    return archive;
}

function teaserFilter(post) {
    if (_.isString(post)) {
        return post.split('<!--more-->')[0];
    }
    if (post.data.teaser) return post.data.teaser;
    if (post.content.includes('<!--more-->')) {
        return post.content.split('<!--more-->')[0];
    }
    return post.data.description || post.content;
}

module.exports = {
    archiveFilter, teaserFilter
};
