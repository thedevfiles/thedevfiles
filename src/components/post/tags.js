import React, { Component } from 'react';
import {Link} from "gatsby"
import _ from 'lodash'

export default class PostTags extends Component {
    render() {
        const tags = this.props.tags;
        
        const tagLinks = tags.sort().map((tag, index) => {
            
            let end = (index === tags.length - 1) ? '' : ', ';
            
            return (
                <span key={`tag-${index}`}>
                    <Link className='tag-list-link'
                          to={'/tag/' + _.kebabCase(tag) + '/'}
                          key={`link-${index}`}>
                        {tag}
                    </Link>
                    {end}
                </span>
            )
        })
        
        return (
            <>{tagLinks}</>
        )
    }
}
