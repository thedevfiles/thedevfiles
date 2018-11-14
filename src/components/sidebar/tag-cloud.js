import React from 'react';
import {graphql, Link, StaticQuery} from "gatsby"
import _ from 'lodash'

const TagCloud = () => (
    <StaticQuery
        query={graphql`
          query TagCloudQuery {
            allTagCloud {
                edges {
                  node {
                    id
                    tag
                    weight
                  }
                }
              }
          }
        `}
        render={data => {
           
            return (
                <aside className="widget widget--tags">
                    <h4 className="widget__title">Tags</h4>
                    
                    <div className="widget__body">
                        {data.allTagCloud.edges.map(function (edge) {
                            return (
                                <span className={'tag size' + edge.node.weight} key={edge.node.id}>
                                    <Link to={'/tag/' + _.kebabCase(edge.node.tag) + '/'}>{edge.node.tag}</Link>
                                </span>
                            );
                        })}
                    </div>
                </aside>
            )
        }}
    />
)

export default TagCloud
