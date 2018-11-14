import React from "react"
import { Link } from 'gatsby'
import PostSummary from "../components/post-summary"
import Layout from "../components/layout";
import Helmet from "react-helmet";
import config from "../../data/config";

const NavLink = props => {
    if (!props.test) {
        return <Link className={props.className} to={props.url}>{props.text}</Link>;
    } else {
        return <span></span>;
    }
};

const IndexPage = ({ data, pageContext }) => {
    const { group, index, pageCount } = pageContext;
    const previousUrl = index - 1 === 1 ? "" : (index - 1).toString();
    const nextUrl = (index + 1).toString();
    const first = index === 1;
    const last = index === pageCount;
    
    return (
        <Layout>
            <Helmet>
                <link rel="canonical" href={config.siteUrl} />
            </Helmet>
            <div>
                {group.map(({ node }) => {
                    return (
                        <PostSummary key={node.id} post={node}/>
                    )
                })}
            </div>
    
            <nav className="pagination pagination--home">
                <ul>
                    <li>
                        <NavLink className="pagination__prev button" test={first} url={previousUrl} text="&laquo; Newer Items" />
                    </li>
                    
                    <li>
                        <NavLink className="pagination__next button" test={last} url={nextUrl} text="Older Items &raquo;" />
                    </li>
                </ul>
            </nav>
    
            <div className="previousLink">
            
            </div>
            <div className="nextLink">
            
            </div>
            
        </Layout>
    )
}

export default IndexPage
