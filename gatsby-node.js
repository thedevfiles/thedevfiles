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
              year:date(formatString: "YYYY")
              month:date(formatString: "MM")
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
        let tags = {}
        posts.forEach(({node}) => {
            // Add post page
            createPage({
                path: `${node.frontmatter.path}`,
                component: blogPostTemplate,
                context: {slug: node.frontmatter.slug},
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
                    context: {year, regex: `/^${year}/`},
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
                    context: {fdate: node.frontmatter.fdate, regex: `/^${year}-${month}/`, year, month},
                })
            }
            archive[year].months[month].count++;
            
            let t = _.get(node, "frontmatter.tags")
            if (t) {
                t.forEach(tag => {
                    if (!tags.hasOwnProperty(tag)) {
                        tags[tag] = 0
                    }
                    tags[tag]++;
                })
            }
        })
    
        const max = _.max(_.map(tags));
        let cloud = _.shuffle(_.map(tags, (count, tag) => {
            let percent = count / max * 100;
            let weight = Math.floor(percent / 10);
            if (percent >= 5) {
                weight++;
            }
            if (percent >= 80 && percent < 100) {
                weight = 8;
            } else if (percent === 100) {
                weight = 9;
            }
        
            return {tag, count, weight};
        }))
        _.each(cloud, (tag) => {
            // Create tag archive page
            createPage({
                path: `/tag/${_.kebabCase(tag.tag)}/`,
                component: tagTemplate,
                context: {
                    tag: tag.tag
                },
            })
            // Add tag cloud entry
            createNode({
                tag: tag.tag,
                count: tag.count,
                weight: tag.weight,
                id: createNodeId(`tag-${_.kebabCase(tag.tag)}`),
                parent: null,
                children: [],
                internal: {
                    type: `TagCloud`,
                    content: JSON.stringify(tag),
                    contentDigest: createContentDigest(tag)
                }
            })
        })

        _.each(archive, (year) => {
            year.id = createNodeId(`year-${year.year}`);
            const children = [];
            
            _.each(year.months, month => {
                month.id = createNodeId(`month-${month.year}-${month.month}`);
                children.push(month.id);
                createNode({
                    year: month.year,
                    month: month.month,
                    display: month.name,
                    count: month.count,
                    id: month.id,
                    parent: year.id,
                    children: [],
                    internal: {
                        type: `MonthlyArchive`,
                        content: JSON.stringify(month),
                        contentDigest: createContentDigest(month)
                    }
                })
            })
    
            createNode({
                year: year.year,
                count: year.count,
                id: year.id,
                parent: null,
                children: children,
                internal: {
                    type: `YearlyArchive`,
                    content: JSON.stringify(year),
                    contentDigest: createContentDigest(year)
                }
            })
        })
    })
}
