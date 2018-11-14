import React from "react"
import {Link} from "gatsby"
import TeaserHeader from './post/teaser-header'
import TeaserFooter from "./post/teaser-footer";

const PostArchive = ({post}) => (
    <article className="post archive__post h-entry">
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

export default PostArchive
