import rss from '@astrojs/rss';
import site from '../data/config';
import {getCollection} from "astro:content";
import {DateTime} from "luxon";
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

export async function GET(context) {
    const parser = new MarkdownIt({
        html: true,
        linkify: false,
        typographer: false
    });

    const posts = await getCollection('post', ({data}) => import.meta.env.PROD ? data.published !== false : true)
        .then(posts => posts.sort((a, b) => new Date(a.data.date).getTime() - new Date(b.data.date).getTime()))
        .then(posts => posts.map(post => {
            post.date = DateTime.fromISO(post.data.date, { zone: "UTC" });
            post.data.year = post.date.toFormat('yyyy').toString();
            post.data.month = post.date.toFormat('LL').toString();
            post.data.url = `${context.site}${post.data.year}/${post.data.month}/${post.id}/`;
            if (!post.data?.excerpt) {
                if (post.body.includes('<!--more-->')) {
                    post.data.excerpt = sanitizeHtml(parser.render(post.body.split('<!--more-->')[0]), {
                        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure', 'figcaption']),
                        allowedAttributes: {
                            ...sanitizeHtml.defaults.allowedAttributes,
                            img: ['src', 'alt', 'width', 'height'],
                            figure: ['class'],
                            figcaption: ['class']
                        }
                    });
                } else {
                    post.data.excerpt = sanitizeHtml(post.data?.description || '', {
                        allowedTags: []
                    });
                }
            }

            return post;
        }));

    return rss({
        // `<title>` field in output xml
        title: site.name,
        // `<description>` field in output xml
        description: site.description,
        // Pull in your project "site" from the endpoint context
        // https://docs.astro.build/en/reference/api-reference/#site
        site: context.site,
        stylesheet: '/rss/styles.xsl',
        // Array of `<item>`s in output xml
        // See "Generating items" section for examples using content collections and glob imports
        items: posts.map((post) => {
            return {
                title: post.data.title,
                description: post.data.description,
                content: post.data.excerpt,
                link: post.data.url,
                pubDate: post.date.toJSDate(),
                categories: post.data.categories,
                // (optional) custom data to inject into the item
                customData: `<author>${post.data.author || site.author}</author>`,
            }
        }),
        // (optional) inject custom xml
        customData: `<language>en-us</language>`,
    });
}