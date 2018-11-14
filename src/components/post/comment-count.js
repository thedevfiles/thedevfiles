import React, { Component } from 'react';
import {Link} from "gatsby"
import {CommentCount} from "disqus-react";

export default class CommentSummary extends Component {
    render() {
        const path = this.props.path;
        const title = this.props.title;
        
        return (
            <div className="comments comments--summary">
                <div className="comments__count">
            
                    <Link to={path + '/#disqus_thread'}
                          data-disqus-identifier={'https://www.thedevfiles.com' + path + '/'}>
                        <CommentCount shortname={'thedevfiles'} config={{
                            url: 'https://www.thedevfiles.com' + path + '/',
                            identifier: 'https://www.thedevfiles.com' + path + '/',
                            title: title
                        }}>
                            Comments
                        </CommentCount>
                    </Link>
                </div>
            </div>
        )
    }
}
