import React from 'react';
import {graphql, Link, StaticQuery} from "gatsby"
import _ from 'lodash'

const MonthlyArchive = () => (
    <StaticQuery
        query={graphql`
          query MonthlyArchiveQuery {
            allYearlyArchive(sort: { order: DESC, fields: [year] }) {
                edges {
                  node {
                    id
                    year
                    count
                    childrenMonthlyArchive {
                      id
                      month
                      display
                      count
                    }
                  }
                }
              }
          }
        `}
        render={data => {
            return (
                <aside className="widget widget--monthly">
                    <h4 className="widget__title">Monthly Archives</h4>
                    
                    <div className="widget__body">
                        <ul className="widget--monthly__list">
                            {_.map(data.allYearlyArchive.edges, function (node) {
                                let year = node.node;
                                
                                return (
                                    <li key={year.id}>
                                        <Link className="widget--monthly__year"
                                           to={year.year + '/'}>{year.year} ({year.count})</Link>
                                        <ul className="widget--monthly__months">
                                            {_.map(year.childrenMonthlyArchive, function (month) {
                                                return (
                                                    <li key={month.id}>
                                                        <Link className="widget--monthly__month"
                                                              to={year.year + '/' + month.month + '/'}>{month.display} ({month.count})</Link>
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
            )
        }}
    />
)

export default MonthlyArchive
