import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import SocialLinks from '../social-link'

const About = () => (
    <StaticQuery
      query={graphql`
      query AvatarQuery {
        file(relativePath: { eq: "jonathan-bernardi.jpg" }) {
          publicURL
        }
      }
    `}
      render={data => (
          <aside className="widget widget--about h-card">
              <div className="widget__title p-name">Jonathan Bernardi</div>

              <div className="widget__body">
                  <div className="widget--about__gravatar">
                      <img src={data.file.publicURL} width="80" height="80" alt="Jonathan Bernardi"/>
                  </div>
                  <SocialLinks />
              </div>
          </aside>
      )}
    />
)

export default About
