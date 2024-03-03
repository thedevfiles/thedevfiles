require('dotenv').config();
const _ = require('lodash')
const path = require('node:path')
const fs = require('node:fs')
const pluginRss = require("@11ty/eleventy-plugin-rss");
const sitemap = require("@quasibit/eleventy-plugin-sitemap");
const directoryOutputPlugin = require("@11ty/eleventy-plugin-directory-output");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginSafeExternalLinks = require('eleventy-plugin-safe-external-links');
const eleventyWebcPlugin = require("@11ty/eleventy-plugin-webc");
const JSDOM = require("jsdom").JSDOM;
const site = require('./src/_data/site');

const dateFunctions = require('./filters/date');
const imageFunctions = require('./filters/image');
const assetFunctions = require('./filters/assets');
const archiveFunctions = require('./filters/archive');
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('src/favicon.ico')
  eleventyConfig.addPassthroughCopy('src/assets/images/favicon')
  eleventyConfig.addPassthroughCopy('src/robots.txt')
  eleventyConfig.addWatchTarget(path.resolve(__dirname, "resources/css/"));
  eleventyConfig.addWatchTarget(path.resolve(__dirname, "resources/js/"));

  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.setQuietMode(true);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(directoryOutputPlugin);
  eleventyConfig.addPlugin(pluginSafeExternalLinks, {
    pattern: 'https{0,1}://', // RegExp pattern for external links
    noopener: true,
    noreferrer: true,
    files: ['.html']
  });
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: site.url,
    },
  });
  eleventyConfig.addPlugin(syntaxHighlight, {
    templateFormats: ["md"],
    // init callback lets you customize Prism
    init: function ({ Prism }) {
      //Prism.languages.myCustomLanguage = /* */;
    },

    // Added in 3.1.1, add HTML attributes to the <pre> or <code> tags
    preAttributes: {
      tabindex: 0
    },
    codeAttributes: {},
  });
  let markdownIt = require("markdown-it");
  eleventyConfig.setLibrary(
    "md",
    markdownIt({
      html: true,
      breaks: false,
      linkify: true,
      typographer: true,
      quotes: "“”‘’",
    })
  );

  eleventyConfig.addCollection("posts", function (collection) {
    return collection.getFilteredByGlob("src/posts/*.md").reverse();
  });
  eleventyConfig.addCollection('categories', collection => {
    let catSet = {};
    collection.getFilteredByTag('post').forEach(item => {
      if (!item.data.categories) return;
      item.data.categories.forEach(
        cat => {
          if (!catSet[cat]) catSet[cat] = {
            category: cat,
            posts: []
          };
          catSet[cat].posts.push(item)
        }
      );
    });
    return catSet;
  });
  eleventyConfig.addCollection('years', collection => {
    let years = [];
    collection.getFilteredByTag('post').forEach(item => {
      let date = dateFunctions.parseDate(item.date);
      let year = date.toFormat('yyyy');
      let index = years.findIndex(y => y.year === year);
      if (index === -1) {
        years.push({
          year: year,
          count: 0,
          posts: []
        });
        index = years.length - 1;
      }
      years[index].count++;
      years[index].posts.push(item);
    });
    return years;
  });
  eleventyConfig.addCollection('months', collection => {
    let months = [];
    collection.getFilteredByTag('post').forEach(item => {
      let date = dateFunctions.parseDate(item.date);
      let slug = `${date.toFormat('yyyy')}-${date.toFormat('LL')}`;
      let index = months.findIndex(y => y.slug === slug);
      if (index === -1) {
        months.push({
          slug: slug,
          year: date.toFormat('yyyy'),
          numeric: Number(date.toFormat('L')),
          month: date.toFormat('LL'),
          name: date.toFormat('LLLL'),
          count: 0,
          posts: []
        });
        index = months.length - 1;
      }
      months[index].count++;
      months[index].posts.push(item);
    });
    return months;
  });

  eleventyConfig.addFilter("getAllCategories", collection => {
    let categories = [];
    for (let item of collection) {
      (item.data.categories || []).forEach(category => {
        let index = categories.findIndex(c => c.category === category);
        if (index === -1) {
          categories.push({
            category: category,
            count: 0
          });
          index = categories.length - 1;
        }
        categories[index].count++;
      });
    }
    return _.sortBy(categories, 'category');
  });


  eleventyConfig.addFilter("digits", function (value) {
    return value.replace(/\D/g, '');
  });

  eleventyConfig.addFilter("limit", function (array, limit) {
    return array.slice(0, limit);
  });

  eleventyConfig.addFilter("json", function (value, pretty = false) {
    return JSON.stringify(value, null, pretty ? '    ' : null);
  });

  eleventyConfig.addFilter("dateToISO", dateFunctions.dateToISO);
  eleventyConfig.addFilter("year", dateFunctions.yearFilter);
  eleventyConfig.addFilter("month", dateFunctions.monthFilter);
  eleventyConfig.addFilter("date", dateFunctions.dateFilter);
  eleventyConfig.addAsyncShortcode("photo", imageFunctions.photoShortcode);
  eleventyConfig.addAsyncFilter("image", imageFunctions.imageFilter);
  eleventyConfig.addAsyncShortcode("svg", imageFunctions.svgShortcode);
  eleventyConfig.addAsyncShortcode("icon", imageFunctions.iconShortcode);
  eleventyConfig.addShortcode("stylesheet", assetFunctions.stylesheetShortcode);
  eleventyConfig.addFilter("versioned", assetFunctions.versionFilter);
  eleventyConfig.addAsyncFilter("asset", assetFunctions.assetFilter);
  eleventyConfig.addFilter("archive", archiveFunctions.archiveFilter);
  eleventyConfig.addFilter("teaser", archiveFunctions.teaserFilter);

  return {
    dir: { input: "src", output: "_site", layouts: "_layouts" },
    templateFormats: ["html", "md", "njk", "11ty.js"],
    markdownTemplateEngine: "njk",
  };
}
