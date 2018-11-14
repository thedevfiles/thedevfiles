import React from 'react'

import About from './sidebar/about'
import TagCloud from './sidebar/tag-cloud'
import MonthlyArchive from './sidebar/monthly-archive'
import RecentPosts from './sidebar/recent-posts'

const Sidebar = () => (
    <section className="sidebar sidebar-column">
        <About />
        <RecentPosts />
        <MonthlyArchive />
        <TagCloud />
    </section>
)

export default Sidebar
