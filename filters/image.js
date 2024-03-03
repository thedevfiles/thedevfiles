const _ = require("lodash");
const path = require("node:path");
const fs = require('node:fs')
const Image = require("@11ty/eleventy-img");
const JSDOM = require("jsdom").JSDOM;
const site = require("../src/_data/site");

const photoShortcode = async (src, attributes = {}, width = null) => {

    let format = src.split('.').pop();
    if (format == 'jpg') format = 'jpeg';
    let widths = [width];
    if (width === null) {
        widths = [320, 640, 768, 1024, 1280, 2048, null];
    }
    let stats = await Image(path.resolve(__dirname, '../src', src), {
        widths: widths,
        formats: [format],
        urlPath: "/assets/images/",
        outputDir: path.resolve(__dirname, "../_site/assets/images") + '/',
    });

    let attrs = _.toPairs(attributes).map(attr => {
        return `${attr[0]}="${attr[1]}"`
    }).join(' ');

    return Image.generateHTML(stats, { ...attributes, ...{ loading: "lazy", decoding: "async", sizes: "auto"}});
};

const imageFilter = async (src, width, callback) => {
    if (_.isFunction(width)) {
        callback = width;
        width = null;
    }
    if (!width) width = null;
    let format = src.split('.').pop()
    if (format == 'jpg') format = 'jpeg';
    try {
        let stats = await Image(path.resolve(__dirname, '../src', src), {
            widths: [width],
            formats: [format],
            urlPath: "/assets/images/",
            outputDir: path.resolve(__dirname, "../_site/assets/images") + '/',
        });
        if (_.isFunction(callback)) {
            callback(null, stats[format][0].url + '?v=' + site.version);
        } else {
            return stats[format][0].url + '?v=' + site.version;
        }

    } catch (error) {
        if (_.isFunction(callback)) {
            callback(error);
        }
    }
};

const svgShortcode = async (src, alt = '', attributes = {}) => {
    let file = path.resolve(__dirname, '../src', src)
    const dom = JSDOM.fragment(fs.readFileSync(file).toString());
    let svg = dom.querySelector('svg');

    if (alt) {
        svg.setAttribute('aria-label', alt);
    }

    _.toPairs(attributes).forEach(attr => {
        svg.setAttribute(attr[0], attr[1]);
    });

    return svg.outerHTML;
};

const iconShortcode = async (icon, group = 'solid', attributes = {}) => {
    let file = path.resolve(__dirname, '../node_modules/@fortawesome/fontawesome-free/svgs');
    switch (group) {
        case 'fab':
        case 'brands':
            file = path.join(file, 'brands')
            break;
        case 'far':
        case 'regular':
            file = path.join(file, 'regular')
            break;
        case 'fas':
        case 'solid':
        default:
            file = path.join(file, 'solid')
            break;
    }
    file = path.join(file, icon + '.svg');
    const dom = JSDOM.fragment(fs.readFileSync(file).toString());
    let svg = dom.querySelector('svg');
    svg.setAttribute('role', 'image');
    svg.setAttribute('class', 'icon');
    _.toPairs(attributes).forEach(attr => {
        if (attr[0] === 'class') {
            attr[1] = 'icon ' + attr[1];
        }
        svg.setAttribute(attr[0], attr[1]);
    });


    return svg.outerHTML;
};

module.exports = {
    photoShortcode, imageFilter, svgShortcode, iconShortcode
};
