import React from "react"
import Helmet from 'react-helmet'
import {graphql} from "gatsby"
import {DiscussionEmbed} from "disqus-react"
import Layout from "../components/layout"
import CommentForm from "../components/comment-form"
import PostTags from "../components/post/tags";
import config from "../../data/config";

require("prismjs/themes/prism-okaidia.css")

export default function Template({
                                     data, // this prop will be injected by the GraphQL query below.
                                 }) {
    const {markdownRemark} = data // data.markdownRemark holds our post data
    const {frontmatter, html} = markdownRemark
    const postUrl = config.siteUrl + frontmatter.path + '/';
    
    const schemaOrgJSONLD = [
        {
            "@context": "http://schema.org",
            "@type": "WebSite",
            url: config.siteUrl,
            name: config.siteTitle
        },
        {
            "@context": "http://schema.org",
            "@type": "Blog",
            "blogPost": {
                "@type": "BlogPosting",
                "@id": postUrl,
                "mainEntityOfPage": postUrl,
                "url": postUrl,
                "headline": frontmatter.title,
                "name": frontmatter.title,
                "articleBody": html,
                "dateModified": frontmatter.date,
                "datePublished": frontmatter.date,
                "keywords": frontmatter.tags.join(', '),
                "description": frontmatter.description,
                "image": {
                    "@type": "ImageObject",
                    "url": config.siteUrl + frontmatter.image.publicURL,
                    "width": frontmatter.image.childImageSharp.original.width,
                    "height": frontmatter.image.childImageSharp.original.height,
                },
                "author": {
                    "@type": "Person",
                    "name": config.author,
                },
                "publisher": {
                    "@type": "Organization",
                    "name": config.siteTitle,
                    "sameAs": [
                        config.social.twitter,
                        config.social.googleplus,
                        config.social.linkedin,
                        config.social.github
                    ],
                    "logo": {
                        "@type": "ImageObject",
                        "url": config.siteUrl + config.logo.path,
                        "width": config.logo.width,
                        "height": config.logo.height,
                    }
                    
                }
            }
        }
    ];
    
    let metatags = [
        {name: "description", content: frontmatter.description},
        {property: "og:type", content: 'article'},
        {property: "og:title", content: frontmatter.title},
        {property: "og:description", content: frontmatter.description},
        {property: "og:url", content: postUrl},
        {property: "article:published_time", content: frontmatter.date},
        {property: "article:modified_time", content: frontmatter.date},
    ];
    metatags.push({property: "twitter:description", content: frontmatter.description});
    metatags.push({property: "twitter:title", content: frontmatter.title});
    metatags.push({property: "twitter:site", content: config.social.twitterUsername});
    metatags.push({property: "twitter:card", content: 'summary_large_image'});
    metatags.push({property: "twitter:creator", content: config.social.twitterUsername});
    if (frontmatter.image) {
        metatags.push({property: "twitter:image", content: config.siteUrl + frontmatter.image.publicURL});
        metatags.push({property: "og:image", content: config.siteUrl + frontmatter.image.publicURL});
        metatags.push({property: "og:image:width", content: frontmatter.image.childImageSharp.original.width});
        metatags.push({property: "og:image:height", content: frontmatter.image.childImageSharp.original.height});
    }
    frontmatter.tags.forEach(tag => {
        metatags.push({property: "article:tag", content: tag});
    });
    
    const commentsBlock = <div />
    
    
    return (
        <Layout>
            <Helmet
                title={frontmatter.title + ' | The Dev Files'}
                meta={metatags}
            >
                <link rel="canonical" href={postUrl} />
                <script type="application/ld+json">
                    {JSON.stringify(schemaOrgJSONLD)}
                </script>
            </Helmet>
            <article className="post card h-entry">
                <header className="post__header">
                    <h1 className="post__title card__title p-name">{frontmatter.title}</h1>
                    <h2 className="post__date">{frontmatter.published}</h2>
                </header>
                <div className="post__body e-content" dangerouslySetInnerHTML={{__html: html}}/>
                <footer className="post__footer">
                    <ul className="past__meta">
                        <li className="post__byline">Posted by <span
                            className="post__author p-author h-card"
                        >Jonathan Bernardi</span></li>
                        <li>
                            <time className="post__date--footer dt-published"
                                  dateTime={frontmatter.date}>{frontmatter.published}</time>
                        </li>
                        <li>
                            <PostTags tags={frontmatter.tags}></PostTags>
                        </li>
                    </ul>
                
                </footer>
                <section className="post__comments">
                    <h2>Comments</h2>
                    {commentsBlock}
                    <CommentForm slug={frontmatter.slug}></CommentForm>
                    {/*<DiscussionEmbed shortname={'thedevfiles'} config={{*/}
                        {/*identifier: 'https://www.thedevfiles.com' + frontmatter.path + '/',*/}
                        {/*title: frontmatter.title*/}
                    {/*}}/>*/}
                </section>
            </article>
        </Layout>
    )
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date
        published:date(formatString: "MMMM Do, YYYY")
        path
        title
        tags
        description
        image_width
        image_height
        image {
          publicURL
          childImageSharp {
            original {
              width
              height
            }
            fluid {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
    }
  }
`
