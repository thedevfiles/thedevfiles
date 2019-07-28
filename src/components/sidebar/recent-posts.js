import React from 'react';
import {graphql, Link, StaticQuery} from "gatsby"

const RecentPosts = () => (
  <StaticQuery
    query={graphql`
      query RecentPostsQuery {
        allMarkdownRemark(
          filter: { frontmatter: { published: { eq: true } } }
          limit: 5
          sort: { order: DESC, fields: [frontmatter___date] }
        ) {
          edges {
            node {
              frontmatter {
                path
                title
              }
            }
          }
        }
      }
    `}
    render={data => {
      return (
        <aside className="widget widget--recent">
          <h4 className="widget__title">Recent Posts</h4>

          <div className="widget__body">
            <ul className="widget--recent_posts">
              {data.allMarkdownRemark.edges.map(function(post, index) {
                return (
                  <li key={index}>
                    <Link to={post.node.frontmatter.path + "/"}>
                      {post.node.frontmatter.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      );
    }}
  />
);

export default RecentPosts
