import type { APIRoute } from 'astro'
import site from '../data/config';
import icon196 from '../assets/images/favicon/196x196.png';
import icon512 from '../assets/images/favicon/512x512.png';

export const GET: APIRoute = async () => {

    const manifest = {
        "lang": "en",
        "dir": "ltr",
        "short_name": site.name,
        "name": site.name,
        "description": site.description,
        "icons": [
            {
                "src": icon196.src,
                "type": "image/png",
                "sizes": "196x196"
            },
            {
                "src": icon512.src,
                "type": "image/png",
                "sizes": "512x512"
            },
            {
                "src": icon196.src,
                "type": "image/png",
                "sizes": "196x196",
                "purpose": "any maskable"
            }
        ],
        "start_url": "/",
        "scope": "/",
        "background_color": "#ffffff",
        "theme_color": "#ffffff",
        "display": "standalone",
        "orientation": "natural"
    };


    return new Response(JSON.stringify(manifest))
}

