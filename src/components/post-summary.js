import React, { Component } from 'react';
import {Link} from "gatsby"
import TeaserHeader from './post/teaser-header'
import TeaserFooter from './post/teaser-footer'

export default class PostSummary extends Component {
    render() {
        const post = this.props.post;
        
        return (
            <article className="post card post--teaser h-entry">
                <TeaserHeader post={post} />
                <div className="post__body">
                    <div className="post__body--teaser p-summary" dangerouslySetInnerHTML={{__html: post.excerpt}}/>
                    
                    <div className="post__readmore">
                        <Link rel="full-article" className="u-url" to={post.frontmatter.path + '/'}>
                            Read More &rarr;
                        </Link>
                    </div>
                
                </div>
                <TeaserFooter post={post} />
            </article>
        )
    }
}
