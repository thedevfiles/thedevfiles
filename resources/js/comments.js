window.loadedDisqus = false;

window.loadDisqus = function () {
    if (window.loadedDisqus && DISQUS) {
        DISQUS.reset({
            reload: true,
            config: window.disqus_config
        });
    }
    const s = document.createElement('script');
    s.onload = function () {
        window.loadedDisqus = true;
    };
    s.src = 'https://thedevfiles.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (document.head || document.body).appendChild(s);
}

window.lazyLoadDisqus = function () {
    if (!document.getElementById('disqus_thread')) {
        return;
    }
    if (!('IntersectionObserver' in window &&
        'IntersectionObserverEntry' in window &&
        'isIntersecting' in window.IntersectionObserverEntry.prototype)) {
        // This browser does not support IntersectionObserver.
        // Load Disqus immediately.
        window.loadDisqus();
        return;
    }
    const observer = new IntersectionObserver(function (entries) {
        // `entries` is an array of all the elements being monitored. In our
        // case, it's always an array of one item. I'm still using a loop here
        // though since it's an easy way to handle edge cases (e.g. if the
        // #disqus_thread element was missing).
        for (const entry of entries) {
            if (entry.isIntersecting) {
                // Comments area is in view; let's load Disqus!
                window.loadDisqus();
                // We saw this element once, and that is enough. Stop monitoring it.
                // (`entry.target` is a reference to the DOM element.)
                observer.unobserve(entry.target);
            }
        }
    });

    // Monitor just one element, #disqus_thread.
    // If you had to monitor multiple elements, you'd have to call `observe`
    // on each of those elements.
    observer.observe(document.getElementById('disqus_thread'));


}

document.addEventListener('DOMContentLoaded', function () {
    // Call the lazyLoadDisqus function instead, which sets up an
    // IntersectionObserver instead of immediately loading Disqus.
    lazyLoadDisqus();
});
