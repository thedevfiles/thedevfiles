
document.addEventListener('astro:page-load', function () {
    if (document.getElementById('disqus_thread')) {
        lazyLoadDisqus();
    }
    if (zaraz) {
        zaraz.track('page_view', {
            page_location: window.location,
            page_title: document.title,
        });
    }
})