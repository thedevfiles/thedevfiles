import React from 'react'
import TwitterIcon from '../assets/icons/twitter-brands.svg';
import GithubIcon from '../assets/icons/github-brands.svg';
import LinkedinIcon from '../assets/icons/linkedin-brands.svg';
import config from "../../data/config";

const SocialLinks = () => (
        <div className="widget--about__social">
            <a target="_blank" rel="noopener noreferrer" href={config.social.twitter} title="Twitter">
                <TwitterIcon className="icon" style={{height: '1em', width: 'auto', maxWidth: '100%' }} />
            </a>
            <a target="_blank" rel="noopener noreferrer" href={config.social.linkedin} title="LinkedIn">
                <LinkedinIcon className="icon" style={{height: '1em', width: 'auto', maxWidth: '100%' }} />
            </a>
            <a target="_blank" rel="noopener noreferrer" href={config.social.github} title="Github">
                <GithubIcon className="icon" style={{height: '1em', width: 'auto', maxWidth: '100%' }} />
            </a>
        </div>
)

export default SocialLinks
