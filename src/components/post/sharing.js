import React, { Component } from "react";
import LinkedinIcon from "../../assets/icons/linkedin-brands.svg";
import TwitterIcon from "../../assets/icons/twitter-brands.svg";
import FacebookIcon from "../../assets/icons/facebook-brands.svg";

export default class SharingLinks extends Component {
  render() {
    const url = encodeURIComponent(this.props.url);
    const title = encodeURIComponent(this.props.title);

    return (
      <div className="sharing sharing--post post__sharing">
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="sharing__link sharing__link--facebook"
          href={`https://facebook.com/sharer/sharer.php?u=${url}`}
          title="Share on Facebook"
          aria-label="Share on Facebook"
        >
          <FacebookIcon
            className="icon icon--sharing"
            style={{ height: "1em", width: "auto", maxWidth: "100%" }}
          />
          <span>Share</span>
        </a>
        <a
          className="sharing__link sharing__link--twitter"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://twitter.com/intent/tweet/?text=${title}&amp;url=${url}`}
          title="Share on Twitter"
          aria-label="Share on Twitter"
        >
          <TwitterIcon
            className="icon icon--sharing"
            style={{ height: "1em", width: "auto", maxWidth: "100%" }}
          />
          <span>Tweet</span>
        </a>
        <a
          className="sharing__link sharing__link--linkedin"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.linkedin.com/shareArticle?mini=true&amp;url=${url}&amp;title=${title}&amp;summary=${title}&amp;source=${url}`}
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          <LinkedinIcon
            className="icon icon--sharing"
            style={{ height: "1em", width: "auto", maxWidth: "100%" }}
          />
          <span>Share</span>
        </a>
      </div>
    );
  }
}
