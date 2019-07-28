import React from "react"
import {graphql} from "gatsby"
import Layout from "../components/layout"
import PostArchive from "../components/post-archive";
import Helmet from "react-helmet";
import config from "../../data/config";

const Tags = ({pageContext, data}) => {
    const {tag} = pageContext
    const { edges } = data.allMarkdownRemark

    return (
        <Layout>
            <Helmet
                title={'Tag Archive: ' + tag + ' | The Dev Files'}
                meta={[
                    {name: 'robots', content: 'noindex, follow'}
                ]}
            >
                <link rel="canonical" href={config.siteUrl + '/tag/' + tag + '/'} />
            </Helmet>
            <div className="page card">
                <header className="page__header">
                    <h1 className="page__title card__title">Tag Archive: "{tag}"</h1>
                </header>
                <div className="page__body">
                    {edges.map(({ node }) => {
                        return (
                            <PostArchive key={node.id} post={node}/>
                        )
                    })}
                </div>
            </div>
        </Layout>
    )
}


export default Tags

export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] }, published: {eq: true} } }
    ) {
      totalCount
      edges {
        node {
          id
          excerpt(pruneLength: 500)
          frontmatter {
            date
            published:date(formatString: "MMMM Do, YYYY")
            path
            title
            tags
          }
        }
      }
    }
  }
`
