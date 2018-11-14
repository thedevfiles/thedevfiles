import React from 'react'
import { Link } from 'gatsby'

const Header = ({ site }) => (
    <header className="siteheader">
        <div className="container">
            <h2 className="siteheader__title">
                <Link
                    to="/"
                >
                    {site.title}
                </Link>
            </h2>
            <small className="siteheader__subtitle">{site.description}</small>
        </div>
    </header>
)

export default Header
