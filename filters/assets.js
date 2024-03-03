const fs = require('node:fs')
const site = require("../src/_data/site");

const stylesheetShortcode = (path, inline = false) => {
    if (process.env.NODE_ENV !== "production") return `<link rel="stylesheet" href="${path}" />`;
    let url = new URL(path, site.url);
    url.searchParams.set("v", site.version);

    return `<link rel="stylesheet" href="${url.pathname + url.search}" ${inline ? 'inline' : ''} />`;
};

const versionFilter = (path) => {
    if (process.env.NODE_ENV !== 'production') return path;
    let url = new URL(path, site.url);
    url.searchParams.set('v', site.version);

    return url.pathname + url.search;
};

const assetFilter = async (src) => {
    let path = path.resolve(__dirname, 'src', src);
    let dest = path.join(__dirname, "_site", src);

    await fs.copyFile(path, dest);
    return path.join('/', src);
};

module.exports = {
    stylesheetShortcode, versionFilter, assetFilter
};
