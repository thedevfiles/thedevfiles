import React from 'react';
import {graphql, Link, StaticQuery} from "gatsby"
import TagCloudBuilder from '../../helpers/tag-cloud';

const TagCloud = () => (
  <StaticQuery
    query={graphql`
      query {
        allMarkdownRemark(
          filter: { frontmatter: { published: { eq: true } } }
        ) {
          edges {
            node {
              id
              frontmatter {
                tags
              }
            }
          }
        }
      }
    `}
    render={data => {
      const cloud = new TagCloudBuilder(data.allMarkdownRemark.edges);

      return (
        <aside className="widget widget--tags">
          <div className="widget__title">Tags</div>

          <div className="widget__body">
            {cloud.cloud.map(function(tag) {
              return (
                <span className={"tag size" + tag.weight} key={tag.tag}>
                  <Link to={"/tag/" + tag.slug + "/"}>{tag.tag}</Link>
                </span>
              );
            })}
          </div>
        </aside>
      );
    }}
  />
);

export default TagCloud
