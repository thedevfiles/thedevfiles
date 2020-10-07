module.exports = {
    siteTitle: "The Dev Files", // Site title.
    siteDescription: 'Development blog of Jonathan Bernardi', // Website description used for RSS feeds/meta description tag.
    siteTitleShort: "Dev Files", // Short site title for homescreen (PWA). Preferably should be under 12 characters to prevent truncation.
    siteLogo: "", // Logo used for SEO and manifest.
    siteUrl: "https://www.thedevfiles.com", // Domain of your website without pathPrefix.
    sitemap: "/sitemap.xml", // Path to the RSS file.
    googleAnalyticsID: "UA-35809975-1", // GA tracking ID.
    googleTagID: "GTM-KBZCND", // GA tracking ID.
    disqusShortname: "thedevfiles", // Disqus shortname.
    staticmanPostUrl: 'https://thedevfiles-staticman.herokuapp.com/v2/entry/thedevfiles/thedevfiles/master/comments',
    author: "Jonathan Bernardi", // Username to display in the author segment.
    logo: {
      path: "/assets/images/favicon/48x48.png",
      width: 48,
      height: 48
    },
    // Links to social profiles/projects you want to display in the author segment/navigation bar.
    social: {
        twitter: 'https://twitter.com/thejonbernardi',
        twitterUsername: '@thejonbernardi',
        facebook: '',
        googleplus: 'https://plus.google.com/116642652326925126482',
        youtube: 'spekkionu',
        linkedin: 'https://www.linkedin.com/pub/jonathan-bernardi/57/318/99a',
        github: 'https://github.com/spekkionu',
        bitbucket: 'spekkionu'
    },
    themeColor: "#c62828", // Used for setting manifest and progress theme colors.
    backgroundColor: "#e0e0e0" // Used for setting manifest background color.
};
