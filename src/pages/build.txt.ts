import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  const date = Date.now();
  const env = import.meta.env.NODE_ENV || 'development';
  return new Response(`LAST BUILD: ${date}\nENV: ${env}`, {
    headers: { 'Content-Type': 'text/plain' },
  });
};
