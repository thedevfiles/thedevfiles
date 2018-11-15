import React from 'react';
import config from "../../data/config";

const CommentForm = ({ slug }) => (
        <form
            method="POST"
            action={config.staticmanPostUrl}
        ><h3>Add a comment</h3>
            <input
                name="options[slug]"
                type="hidden"
                value={slug}
            />
            <input name="fields[name]" type="text" placeholder="Name" required />

            <textarea name="fields[message]" placeholder="Comment" required />
            <button type="submit">Submit Comment</button>
        </form>
)

export default CommentForm
