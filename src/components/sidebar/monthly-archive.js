import React from 'react';
import {graphql, Link, StaticQuery} from "gatsby"
import _ from 'lodash'
import ArchiveBuilder from '../../helpers/monthly-archive';

const MonthlyArchive = () => (
  <StaticQuery
    query={graphql`
      query {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          filter: { frontmatter: { published: { eq: true } } }
        ) {
          edges {
            node {
              id
              frontmatter {
                year: date(formatString: "YYYY")
                month: date(formatString: "MM")
                mname: date(formatString: "MMM")
              }
            }
          }
        }
      }
    `}
    render={data => {
      const archive = new ArchiveBuilder(data.allMarkdownRemark.edges);

      return (
        <aside className="widget widget--monthly">
          <div className="widget__title">Monthly Archives</div>

          <div className="widget__body">
            <ul className="widget--monthly__list">
              {_.map(archive.archive, function(year) {
                return (
                  <li key={year.year}>
                    <Link className="widget--monthly__year" to={year.slug}>
                      {year.year} ({year.count})
                    </Link>
                    <ul className="widget--monthly__months">
                      {_.map(year.months, function(month) {
                        return (
                          <li key={month.month}>
                            <Link
                              className="widget--monthly__month"
                              to={month.slug}
                            >
                              {month.name} ({month.count})
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
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

export default MonthlyArchive
