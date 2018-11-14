import React, { Component } from 'react';
import PostTags from "./tags";
import CommentSummary from "./comment-count";

export default class TeaserFooter extends Component {
    render() {
        const post = this.props.post;
        
        return (
            <footer className="post__footer">
                <div className="post__tags p-category">
                    <strong>Tags: </strong>
                    <PostTags tags={post.frontmatter.tags} />
                </div>
                <CommentSummary path={post.frontmatter.path} title={post.frontmatter.title} />
            </footer>
        )
    }
}
