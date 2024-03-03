const path = require('node:path');
const _ = require("lodash");
const Image = require("@11ty/eleventy-img");

module.exports = function (configData) {
    return {
        layout: "post",
        tags: 'post',
        eleventyComputed: {
            author: data => data.author || "Jonathan Bernardi",
            permalink: data => "/{{ date | year }}/{{ date | month }}/{{ slug }}/",
            meta_description: data => data.excerpt,
            meta_tags: async data => {
                let meta = [
                    { "property": "og:type", content: 'article' },
                    { "property": "og:title", content: data.title },
                    { "property": "og:description", content: data.excerpt },
                    { "property": "og:url", content: data.site.url + data.page.url },
                    { "property": "article:published_time", content: data.date },
                    { "property": "article:modified_time", content: data.date },
                    { "property": "twitter:description", content: data.excerpt },
                    { "property": "twitter:title", content: data.title },
                    { "property": "twitter:site", content: data.site.twitter },
                    { "property": "twitter:card", content: "summary_large_image" },
                    { "property": "twitter:creator", content: data.site.twitter },
                ];
                if (data.image) {
                    let src = data.image;
                    let format = src.split('.').pop();
                    if (format == 'jpg') format = 'jpeg';
                    try {
                        let image = await Image(path.resolve(__dirname, '../', src), {
                            widths: [1024],
                            formats: [format],
                            urlPath: "/assets/images/",
                            outputDir: path.resolve(__dirname, "../../_site/assets/images") + '/',
                        });
                        meta.push({ "property": "twitter:image", content: image[format][0].url });
                        meta.push({ "property": "og:image", content: image[format][0].url });
                        meta.push({ "property": "og:image:width", content: image[format][0].width });
                        meta.push({ "property": "og:image:height", content: image[format][0].height });
                    } catch (error) {
                        console.error(error)
                    }
                }
                data.categories.forEach(category => {
                    meta.push({ "property": "article:tag", content: category });
                });

                return meta;
            },


            schema: data => {
                return {
                    "@context": "https://schema.org",
                    "@type": "Blog",
                    "blogPost": {
                        "@type": "BlogPosting",
                        "@id": data.site.url + data.page.url,
                        "headline": data.title,
                        "name": data.title,
                        "description": data.excerpt,
                        "datePublished": data.date,
                        "dateModified": data.date,
                        "author": {
                            "@type": "Person",
                            "name": data.author || "Jonathan Bernardi",
                        },
                        "publisher": {
                            "@type": "Person",
                            "name": "Jonathan Bernardi",
                            "sameAs": ["https://twitter.com/thejonbernardi", "https://www.jonbernardi.com/", "https://www.linkedin.com/pub/jonathan-bernardi/57/318/99a", "https://github.com/spekkionu"]
                        },
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": data.site.url + data.page.url
                        },
                        "keywords": data.categories.join(', ')
                    },
                };
            }
        }
    };
};
