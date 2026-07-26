import { dev } from "$app/env"
import { env } from "$env/dynamic/private"
import { json, error } from "@sveltejs/kit"


const endpoints = {
    latest: '/data/latest',
    sample: '/data/sample',
    summary: '/data/summary',
    joats: '/data/joats',
    vips: '/data/vips',
    general_hist: '/data/general_hist',
    class_aff: '/data/class_aff',

    search: '/search',
    bulk: '/search/bulk'
}

export async function POST({ request }) {

    const r = await request.json()

    let url = endpoints[r.func]
    if (dev) {
        url = 'http://localhost:' + env.BACKEND_PORT + url.replace('/api', '')
    }

    switch(r.func) {
        case 'latest':
        case 'summary':
        case 'general_hist':
            return await basic_get(url)
        
        case 'sample':
        case 'joats':
        case 'class_aff':
            return await get_with_limit(url, r.limit)

        case 'search':
        case 'bulk':
        case 'vips':
            return await basic_post(url, r.search_params)
    }
}

async function basic_get(url) {

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const body = await response.json()
        return json({body})
    } catch (e) {
        console.log(e)
        throw error(500, 'Failed to contact the backend')
    }
}

async function get_with_limit(url, limit) {
    url += `?limit=${limit}`
    return await basic_get(url)
}

async function basic_post(url, search_params) {

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(search_params)
        })

        const body = await response.json()
        return json({body})
    } catch (e) {
        console.log(e)
        throw error(500, 'Failed to contact the backend')
    }
}