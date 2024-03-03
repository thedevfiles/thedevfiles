const path = require('node:path')
const fs = require('node:fs')
const UglifyJS = require("uglify-js");

const isProd = process.env.NODE_ENV === 'production'

module.exports = class {
    // Configure Webpack in Here
    async data() {
        // Transform .js files, run through Babel
        const files = [
            path.resolve(__dirname, '../../../resources/js/turbo.es2017-umd.js.js'),
            path.resolve(__dirname, '../../../resources/js/quicklink.umd.js.js'),
            path.resolve(__dirname, '../../../resources/js/debounce.js'),
            path.resolve(__dirname, '../../../resources/js/prefetch.js'),
            path.resolve(__dirname, '../../../resources/js/comments.js'),
            path.resolve(__dirname, '../../../resources/js/transitions.js'),
        ];


        return {
            permalink: `/assets/js/app.js`,
            eleventyExcludeFromCollections: true,
            production: isProd,
            files: files,
        }
    }

    getScriptContent(files) {
        return files.map(file => {
            return fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });
        });
    }

    compileJs(files) {
        return new Promise((resolve, reject) => {

            if (!isProd) {
                resolve(this.getScriptContent(files).join("\n"))
                return;
            }

            const result = UglifyJS.minify(this.getScriptContent(files));
            if (result.error) {
                reject(result.error)
                return
            }
            resolve(result.code);
        })
    }

    // render the JS file
    async render({ files }) {
        try {
            const result = await this.compileJs(files)
            return result
        } catch (err) {
            console.log(err)
            return null
        }
    }
}
