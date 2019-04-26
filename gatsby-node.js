const path = require("path")
const _ = require("lodash")
const createPaginatedPages = require("gatsby-paginate");

exports.createPages = ({actions, createNodeId, createContentDigest, graphql}) => {
    const {createPage, createNode} = actions

    const blogPostTemplate = path.resolve(`src/templates/post.js`)
    const tagTemplate = path.resolve(`src/templates/tag.js`)
    const yearArchiveTemplate = path.resolve(`src/templates/year-archive.js`)
    const monthArchiveTemplate = path.resolve(`src/templates/month-archive.js`)

    return graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
      ) {
        edges {
          node {
            id
            excerpt(pruneLength: 500)
            frontmatter {
              path
              title
              date
              tags
              published:date(formatString: "MMMM Do, YYYY")
              fdate:date(formatString: "MMMM YYYY")
              year
              month
              mname:date(formatString: "MMM")
            }
          }
        }
      }
    }
  `).then(result => {
        if (result.errors) {
            return Promise.reject(result.errors)
        }

        const posts = result.data.allMarkdownRemark.edges

        createPaginatedPages({
            edges: posts,
            createPage: createPage,
            pageTemplate: "src/templates/index.js",
            pageLength: 10, // This is optional and defaults to 10 if not used
            pathPrefix: "", // This is optional and defaults to an empty string if not used
            context: {} // This is optional and defaults to an empty object if not used
        });

        let archive = {}
        let tags = []
        posts.forEach(({node}) => {
            // Add post page
            createPage({
                path: `${node.frontmatter.path}`,
                component: blogPostTemplate,
                context: {slug: node.frontmatter.slug, fdate: node.frontmatter.fdate, year: node.frontmatter.year}
            });

            let year = node.frontmatter.year;
            let month = node.frontmatter.month;
            if (!archive.hasOwnProperty(year)) {
                archive[year] =  {
                    year: year,
                    count: 0,
                    months: {}
                };

                createPage({
                    path: `/${year}/`,
                    component: yearArchiveTemplate,
                    context: {year: parseInt(year)}
                })
            }
            archive[year].count++;

            if (!archive[year].months.hasOwnProperty(month)) {
                archive[year].months[month] = {
                    count: 0,
                    month: month,
                    year: year,
                    name: node.frontmatter.mname
                };
                createPage({
                    path: `/${year}/${month}/`,
                    component: monthArchiveTemplate,
                    context: {year: parseInt(year), month}
                })
            }
            archive[year].months[month].count++;

            let t = _.get(node, "frontmatter.tags");
            if (t) {
                tags = _.union(tags, t);
            }
        });

        _.each(tags, (tag) => {
            // Create tag archive page
            createPage({
                path: `/tag/${_.kebabCase(tag)}/`,
                component: tagTemplate,
                context: {
                    tag: tag
                },
                children: []
            })
        })

    })

};
