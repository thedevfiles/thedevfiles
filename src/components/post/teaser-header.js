import React, { Component } from 'react';
import {Link} from "gatsby"

export default class TeaserHeader extends Component {
    render() {
        const post = this.props.post;
        
        return (
            <header className="post__header">
                <h2 className="post__title card__title p-name">
                    <Link className="u-url" to={post.frontmatter.path + '/'}>
                        {post.frontmatter.title}
                    </Link>
                </h2>
                <time className="post__date dt-published"
                      content={post.frontmatter.date}>{post.frontmatter.published}</time>
            </header>
        )
    }
}
