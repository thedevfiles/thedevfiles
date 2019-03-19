import React from 'react';
import config from "../../../data/config";

const CommentForm = ({slug}) => (
    <form
        method="POST"
        action={config.staticmanPostUrl}
        className="form--comment"
    >
        <fieldset>
            <legend className="form-legend">Add a comment</legend>
            <input
                name="fields[slug]"
                type="hidden"
                value={slug}
            />
            <input className="comment-name" name="fields[name]" type="text" placeholder="Name"
                   required/>
            
            <textarea className="comment-message" name="fields[message]" placeholder="Comment" rows="5" cols="60" required/>
            
            <button className="comment-submit button" type="submit">Submit Comment</button>
        </fieldset>
    </form>
)

export default CommentForm
