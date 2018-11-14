const path = require("path")
const _ = require("lodash")
const config = require('./data/config');

const withoutTrailingSlash = path =>
    path === `/` ? path : path.replace(/\/$/, ``)

module.exports = {
    siteMetadata: {
        title: config.siteTitle,
        description: config.siteDescription,
        siteUrl: config.siteUrl,
        author: config.author,
        social: config.social
    },
    plugins: [
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'markdown-pages',
                path: path.join(__dirname, `src`, `posts`),
            }
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: path.join(__dirname, `src`, `assets`, `images`),
            },
        },
        {
            resolve: 'gatsby-plugin-react-svg',
            options: {
                rule: {
                    include: path.join(__dirname, `src`, `assets`, `icons`),
                }
            }
        },
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            // It's important to specify the maxWidth (in pixels) of
                            // the content container as this plugin uses this as the
                            // base for generating different widths of each image.
                            maxWidth: 900,
                            linkImagesToOriginal: false,
                            showCaptions: false,
                            quality: 80,
                            withWebp: true
                        },
                    },
                    `gatsby-remark-responsive-iframe`,
                    {
                        resolve: `gatsby-remark-prismjs`,
                        options: {
                            // Class prefix for <pre> tags containing syntax highlighting;
                            // defaults to 'language-' (eg <pre class="language-js">).
                            // If your site loads Prism into the browser at runtime,
                            // (eg for use with libraries like react-live),
                            // you may use this to prevent Prism from re-processing syntax.
                            // This is an uncommon use-case though;
                            // If you're unsure, it's best to use the default value.
                            classPrefix: "language-",
                            // This is used to allow setting a language for inline code
                            // (i.e. single backticks) by creating a separator.
                            // This separator is a string and will do no white-space
                            // stripping.
                            // A suggested value for English speakers is the non-ascii
                            // character '›'.
                            inlineCodeMarker: null,
                            // This lets you set up language aliases.  For example,
                            // setting this to '{ sh: "bash" }' will let you use
                            // the language "sh" which will highlight using the
                            // bash highlighter.
                            aliases: {},
                            // This toggles the display of line numbers alongside the code.
                            // To use it, add the following line in src/layouts/index.js
                            // right after importing the prism color scheme:
                            //  `require("prismjs/plugins/line-numbers/prism-line-numbers.css");`
                            // Defaults to false.
                            showLineNumbers: false,
                            // If setting this to true, the parser won't handle and highlight inline
                            // code used in markdown i.e. single backtick code like `this`.
                            noInlineHighlight: false,
                        },
                    },
                    "gatsby-remark-copy-linked-files",
                ],
            },
        },
        {
            resolve: "gatsby-plugin-google-analytics",
            options: {
                trackingId: config.googleAnalyticsID
            }
        },
        'gatsby-plugin-sass',
        `gatsby-plugin-sharp`,
        `gatsby-transformer-sharp`,
        {
            resolve: `gatsby-plugin-sitemap`,
            options: {
                output: config.sitemap,
                // Exclude specific pages or groups of pages using glob parameters
                // See: https://github.com/isaacs/minimatch
                // The example below will exclude the single `path/to/page` and all routes beginning with `category`
                exclude: [
                    `/dev-404-page`,
                    `/404`,
                    `/404.html`,
                    `/offline-plugin-app-shell-fallback`,
                ],
                serialize: ({site, allSitePage}) =>
                    allSitePage.edges.map(edge => {
                        return {
                            url: edge.node.path === '/' ? config.siteUrl : withoutTrailingSlash(config.siteUrl + edge.node.path) + '/',
                            changefreq: `daily`,
                            priority: 0.7,
                        }
                    }),
                
            }
        },
        "gatsby-plugin-catch-links",
        {
            resolve: "gatsby-plugin-manifest",
            options: {
                name: config.siteTitle,
                short_name: config.siteTitleShort,
                description: config.siteDescription,
                start_url: '/',
                background_color: config.backgroundColor,
                theme_color: config.themeColor,
                display: "minimal-ui",
                icons: [
                    {
                        src: "/images/favicon/16x16.png",
                        sizes: "16x16",
                        type: "image/png"
                    },
                    {
                        src: "/images/favicon/20x20.png",
                        sizes: "20x20",
                        type: "image/png"
                    },
                    {
                        src: "/images/favicon/24x24.png",
                        sizes: "24x24",
                        type: "image/png"
                    },
                    {
                        src: "/images/favicon/32x32.png",
                        sizes: "32x32",
                        type: "image/png"
                    },
                    {
                        src: "/images/favicon/48x48.png",
                        sizes: "48x48",
                        type: "image/png"
                    },
                    {
                        src: "/images/favicon/64x64.png",
                        sizes: "64x64",
                        type: "image/png"
                    },
                    {
                        src: "/images/favicon/76x76.png",
                        sizes: "76x76",
                        type: "image/png"
                    },
                    {
                        src: "/images/favicon/120x120.png",
                        sizes: "120x120",
                        type: "image/png"
                    },
                    {
                        src: "/images/favicon/128x128.png",
                        sizes: "128x128",
                        type: "image/png"
                    },
                    {
                        src: "/images/favicon/152x152.png",
                        sizes: "152x152",
                        type: "image/png"
                    },
                    {
                        src: "/images/favicon/196x196.png",
                        sizes: "196x196",
                        type: "image/png"
                    },
                    {
                        src: "/images/favicon/256x256.png",
                        sizes: "256x256",
                        type: "image/png"
                    },
                    {
                        src: "/images/favicon/512x512.png",
                        sizes: "512x512",
                        type: "image/png"
                    },
                    {
                        src: "/images/favicon/1024x1024.png",
                        sizes: "1024x1024",
                        type: "image/png"
                    },
                    {
                        src: "/images/favicon/2048x2048.png",
                        sizes: "2048x2048",
                        type: "image/png"
                    },
                    
                ]
            }
        },
        `gatsby-plugin-offline`,
        {
            resolve: `gatsby-plugin-feed`,
            options: {
                query: `
                {
                  site {
                    siteMetadata {
                      title
                      description
                      siteUrl
                      site_url: siteUrl
                    }
                  }
                }
              `,
                feeds: [
                    {
                        serialize: ({query: {site, allMarkdownRemark}}) => {
                            return allMarkdownRemark.edges.map(edge => {
                                return Object.assign({}, edge.node.frontmatter, {
                                    description: edge.node.frontmatter.description,
                                    url: site.siteMetadata.siteUrl + edge.node.frontmatter.path + '/',
                                    guid: site.siteMetadata.siteUrl + edge.node.frontmatter.path + '/',
                                    custom_elements: [{"content:encoded": edge.node.html}],
                                })
                            })
                        },
                        query: `
                        {
                          allMarkdownRemark(
                            sort: { order: DESC, fields: [frontmatter___date] }
                          ) {
                            edges {
                              node {
                                html
                                frontmatter {
                                  title
                                  date
                                  path
                                  description
                                }
                              }
                            }
                          }
                        }
                      `,
                        output: "/rss.xml",
                        title: "The Dev Files",
                    },
                ],
            },
        },
    ]
}
