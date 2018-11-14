import React from "react"
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'
import {StaticQuery, graphql} from 'gatsby'

import '../assets/sass/style.scss'
import Header from './header'
import Sidebar from './sidebar'
import Footer from './footer'


const Layout = ({children}) => (
    <StaticQuery
        query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `}
        render={data => (
            <>
                <Helmet
                    title={data.site.siteMetadata.title}
                    meta={[
                        {name: 'description', content: data.site.siteMetadata.description},
                        {name: 'author', content: data.site.siteMetadata.author},
                        {name: 'robots', content: 'index, follow'},
                        { property: "og:locale", content: 'en_US' },
                        { property: "og:site_name", content: 'The Dev Files' },
                    ]}
                >
                    <html lang="en"/>
                </Helmet>
                <Header site={data.site.siteMetadata}/>
                <div className="middle-section">
                    <div className="container content-wrapper">
                        <main aria-label="Main content" className="main main-column">
                            {children}
                        </main>
                        <Sidebar />
                    </div>
                </div>
                <Footer />
            </>
        )}
    />
)

Layout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Layout
