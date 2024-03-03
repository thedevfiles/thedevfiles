const path = require('node:path')
const postcss = require('postcss')
const fs = require('node:fs')
const atImport = require("postcss-import")
const nested = require("postcss-nested")
const cssnano = require("cssnano")
const postcssPresetEnv = require('postcss-preset-env');

module.exports = class {
    // define meta data for this template,
    // just like you would with front matter in markdown.
    async data() {
        return {
            permalink: '/assets/css/styles.css',
            eleventyExcludeFromCollections: true,
            entryFile: path.resolve(__dirname, '../../../resources/css/styles.css')
        }
    }

    async compileCss(file) {

        let plugins = [atImport, nested, postcssPresetEnv()];
        if (process.env.NODE_ENV === 'production') {
            plugins.push(cssnano);
        }

        return new Promise((resolve, reject) => {
            let source = path.resolve(__dirname, '../../../resources/css/styles.css');
            fs.readFile(source, (err, css) => {
                postcss(plugins)
                    .process(css, { from: source, to: 'assets/css/styles.css' })
                    .then(result => {
                        resolve(result.css);
                    })
                    .catch(error => reject(error));
            })
        })
    }

    // this function is mandatory and determines the contents of the
    // generated output file. it gets passed all our "front matter" data.
    async render({ entryFile }) {
        try {
            return await this.compileCss(entryFile)
        } catch (error) {
            throw error
        }
    }
}
