
document.addEventListener('astro:page-load', function () {
    if (document.getElementById('disqus_thread')) {
        lazyLoadDisqus();
    }
})