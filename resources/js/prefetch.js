(function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register("/serviceworker.js");
    }

    window.fetchCache = new Set();

    const checkDomain = function(url) {
        if ( url.indexOf('//') === 0 ) { url = window.location.protocol + url; }
        return url.toLowerCase().replace(/([a-z])?:\/\//,'$1').split('/')[0];
    };

    const isExternal = function(url) {
        return ( ( url.indexOf(':') > -1 || url.indexOf('//') > -1 ) && checkDomain(window.location.href) !== checkDomain(url) );
    };

    const preload = _.debounce((el) => {
        const url = el.getAttribute('href');
        if (!url || isExternal(url)) return;
        if (window.fetchCache.has(url)) return;
        quicklink.prefetch(url);
    }, 100);

    window.prefetchInit = function () {
        if (!quicklink) return;

        document.querySelectorAll('.site-content a').forEach((el) => {
            el.addEventListener('mouseover', (e) => {
                preload(el);
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.site-sidebar a').forEach((el) => {
            el.addEventListener('mouseover', (e) => {
                preload(el);
            });
        });
        window.prefetchInit();
    });
})();
