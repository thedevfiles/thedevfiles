import React from "react"
import {graphql} from "gatsby"
import Layout from "../components/layout"
import PostArchive from "../components/post-archive";
import Helmet from "react-helmet";
import config from "../../data/config";

const MonthArchive = ({pageContext, data}) => {
    const {fdate, year, month} = pageContext
    const { edges } = data.allMarkdownRemark

    return (
        <Layout>
            <Helmet
                title={fdate + ' Blog Archive | The Dev Files'}
                meta={[
                    {name: 'robots', content: 'noindex, follow'}
                ]}
            >
                <link rel="canonical" href={config.siteUrl + '/' + year + '/' + month + '/'} />
            </Helmet>
            <div className="page card">
                <header className="page__header">
                    <h1 className="page__title card__title">Blog Archive: {fdate}</h1>
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


export default MonthArchive

export const pageQuery = graphql`
  query($year: Int, $month: String) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { year: { eq: $year }, month: { eq: $month } } }
    ) {
      totalCount
      edges {
        node {
          id
          excerpt(pruneLength: 500)
          frontmatter {
            date
            published:date(formatString: "MMMM Do, YYYY")
            fdate:date(formatString: "MMMM YYYY")
            path
            title
            tags
          }
        }
      }
    }
  }
`
