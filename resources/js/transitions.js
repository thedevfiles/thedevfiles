document.addEventListener("turbo:before-render", async (event) => {
    if(!document.startViewTransition) return;
    let fn = null

    event.preventDefault()

    document.startViewTransition(() => {
        event.detail.resume()

        const promise = new Promise((resolve, reject) => {

            fn = (event) => {
                resolve()
            }

            document.addEventListener('turbo:render', fn)
        })

        promise.finally(() => {
            document.removeEventListener('turbo:render', fn)
        })

        return promise
    })

})

document.addEventListener('turbo:load', function(){
    window.prefetchInit();
    if(document.getElementById('disqus_thread')){
        lazyLoadDisqus();
    }
})
